'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { usePageActions, useAutosave } from '@/hooks';
import { useDockLift } from '@/hooks/use-dock-lift';
import { postPage } from '@/hooks/use-page-actions';
import { PageData, BlockType } from '@/lib';
import {
  asUrl,
  checkMediaFile,
  fetchLinkPreview,
  isVideoFile,
  uploadBlockMedia,
} from '@/lib/media';
import { findPlatform } from '@/lib/platforms';
import { appendBlock, insertBlock } from '@/lib/layout';
import { DockActionBar, ViewMode } from '@/components/preview';
import { PreviewPortfolio, newBlock } from '@/components/bento';
import type { UploadState } from '@/components/bento/grid';
import { EditorViewport } from './viewport';

// bento's wording when a save fails.
const SAVE_ERROR = "Couldn't save Bento. Try again, or refresh the page.";

export default function PreviewClient({ messageTip }: { messageTip?: string }) {
  const { pageQuery, usernameQuery, savePageMutation, userProfileQuery } =
    usePageActions();
  const [localPage, setLocalPage] = useState<PageData>();
  const [localProfilePicture, setLocalProfilePicture] = useState<
    string | undefined
  >();
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  // The latest page, for edits that land after an upload or fetch finishes.
  const pageRef = useRef<PageData | undefined>(undefined);
  pageRef.current = localPage;
  const [isDragging, setIsDragging] = useState(false);
  // Asks the grid which row is in view, so new widgets land there.
  const anchorRef = useRef<(() => { row: number; desktop: boolean }) | null>(
    null
  );
  // On phones the dock rides up above the footer when the page ends.
  const dockLift = useDockLift(viewMode !== 'mobile');
  const [fetchingIds, setFetchingIds] = useState<string[]>([]);
  const [uploads, setUploads] = useState<Record<string, UploadState>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  // The server's page seeds the editor once; after that the editor's own copy
  // is the truth, so a refetch can never overwrite what was just typed.
  const seeded = useRef(false);
  useEffect(() => {
    if (!seeded.current && pageQuery.data?.page) {
      seeded.current = true;
      setLocalPage(pageQuery.data.page);
    }
  }, [pageQuery.data?.page]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      const profilePic =
        userProfileQuery.data?.profile?.image ||
        session?.user?.user_metadata?.avatar_url ||
        undefined;
      setLocalProfilePicture(profilePic);
    });
  }, [userProfileQuery.data?.profile?.image]);

  const profilePicture = localProfilePicture;

  // Saved a second after the last edit, at the latest every 8 seconds of
  // continuous editing, and whenever the tab is hidden or closed.
  const scheduleSave = useAutosave<PageData>({
    save: async (page) => {
      try {
        await savePageMutation.mutateAsync(page);
      } catch (error) {
        toast.error(SAVE_ERROR);
        throw error;
      }
    },
    saveOnExit: (page) => {
      postPage(page, true).catch(() => {});
    },
  });

  const handlePageChange = (newPage: PageData) => {
    pageRef.current = newPage;
    setLocalPage(newPage);
    scheduleSave(newPage);
  };

  const handleImageChange = (newImageUrl: string | null) => {
    setLocalProfilePicture(newImageUrl || undefined);
    userProfileQuery.refetch();
  };

  const handleAddBlock = (type: BlockType, data?: Record<string, unknown>) => {
    const page = pageRef.current;
    if (!page) return;

    // The new block goes where the user is looking.
    const anchor = anchorRef.current?.();
    const block = newBlock(type, 0, data);
    handlePageChange({
      ...page,
      blocks: anchor
        ? insertBlock(page.blocks || [], block, anchor)
        : appendBlock(page.blocks || [], block),
    });
    return block.id;
  };

  const patchBlockData = (id: string, patch: Record<string, unknown>) => {
    const page = pageRef.current;
    if (!page) return;
    handlePageChange({
      ...page,
      blocks: (page.blocks || []).map((block) =>
        block.id === id
          ? { ...block, data: { ...block.data, ...patch } }
          : block
      ),
    });
  };

  // bento's quick add: paste a link anywhere to make a link widget, and its
  // preview fills in once fetched.
  const addLink = async (url: string) => {
    const id = handleAddBlock('LINK', { url, title: 'New link' });
    if (!id) return;
    setFetchingIds((ids) => [...ids, id]);
    const preview = await fetchLinkPreview(url);
    setFetchingIds((ids) => ids.filter((x) => x !== id));
    patchBlockData(id, {
      image: preview.image,
      description: preview.description,
      favicon: preview.icon ?? '',
      ...(preview.title && !findPlatform(url) ? { title: preview.title } : {}),
    });
  };

  // Chosen, pasted or dropped images and videos become media widgets at
  // once, showing the file with a progress ring while it uploads.
  const addMedia = async (files: File[]) => {
    for (const file of files) {
      const invalid = checkMediaFile(file);
      if (invalid) {
        toast.error(invalid);
        continue;
      }
      const kind = isVideoFile(file) ? 'video' : 'image';
      const id = handleAddBlock('IMAGE', { kind });
      if (!id) return;
      const preview = URL.createObjectURL(file);
      setUploads((u) => ({ ...u, [id]: { preview, kind, progress: 0 } }));
      try {
        const url = await uploadBlockMedia(file, 'image.jpg', (progress) =>
          setUploads((u) =>
            u[id] ? { ...u, [id]: { ...u[id], progress } } : u
          )
        );
        patchBlockData(id, { url, kind });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to upload file'
        );
        const page = pageRef.current;
        if (page) {
          handlePageChange({
            ...page,
            blocks: (page.blocks || []).filter((block) => block.id !== id),
          });
        }
      } finally {
        URL.revokeObjectURL(preview);
        setUploads((u) => {
          const rest = { ...u };
          delete rest[id];
          return rest;
        });
      }
    }
  };

  const addMediaRef = useRef(addMedia);
  addMediaRef.current = addMedia;
  const addLinkRef = useRef(addLink);
  addLinkRef.current = addLink;

  useEffect(() => {
    const isTyping = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

    const onPaste = (event: ClipboardEvent) => {
      if (isTyping(event.target) || document.querySelector('[role="dialog"]'))
        return;
      const files = Array.from(event.clipboardData?.files ?? []);
      if (files.length) {
        event.preventDefault();
        addMediaRef.current(files);
        return;
      }
      const url = asUrl(event.clipboardData?.getData('text') ?? '');
      if (url) {
        event.preventDefault();
        addLinkRef.current(url);
      }
    };

    const hasFiles = (event: DragEvent) =>
      event.dataTransfer?.types.includes('Files') ?? false;
    let depth = 0;
    const onDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth++;
      setIsDragging(true);
    };
    const onDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setIsDragging(false);
    };
    const onDragOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault();
    };
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth = 0;
      setIsDragging(false);
      if (document.querySelector('[role="dialog"]')) return;
      addMediaRef.current(Array.from(event.dataTransfer?.files ?? []));
    };

    window.addEventListener('paste', onPaste);
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('paste', onPaste);
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  if (
    pageQuery.isLoading ||
    usernameQuery.isLoading ||
    !usernameQuery.data ||
    !localPage
  ) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {isDragging && (
        <div className="pointer-events-none fixed inset-4 z-[60] flex items-center justify-center rounded-[32px] border-2 border-dashed border-black/20 bg-white/70 backdrop-blur-sm">
          <p className="text-sm font-semibold text-black/60">
            Drop images or videos to add them
          </p>
        </div>
      )}
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*,video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          addMedia(Array.from(e.target.files ?? []));
          e.target.value = '';
        }}
      />
      <div className="flex flex-1 flex-col">
        {messageTip && (
          <div className="mx-auto w-full max-w-3xl px-4 pt-4 md:px-0">
            <div className="flex items-start rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 mt-0.5 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{messageTip}</p>
            </div>
          </div>
        )}

        <EditorViewport viewMode={viewMode}>
          {(mode) => (
            <PreviewPortfolio
              page={localPage}
              profilePicture={profilePicture}
              isEditMode={true}
              onChangePage={handlePageChange}
              onImageChange={handleImageChange}
              username={usernameQuery.data?.username}
              viewMode={mode}
              uploads={uploads}
              fetchingIds={fetchingIds}
              anchorRef={anchorRef}
            />
          )}
        </EditorViewport>

        {/* Action Bar */}
        <div
          className="[transition-timing-function:cubic-bezier(.16,1,.3,1)] pointer-events-none fixed bottom-1 left-0 right-0 z-50 transition-transform duration-500 xl:bottom-10"
          style={{ transform: `translateY(${-dockLift}px)` }}
        >
          <div className="pointer-events-auto mx-auto flex w-full max-w-3xl justify-center px-4 md:px-0">
            <DockActionBar
              initialUsername={usernameQuery.data.username}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isSaving={savePageMutation.isPending}
              onAddLink={(url) => addLink(url)}
              onAddImage={() => fileInput.current?.click()}
              onAddText={() => handleAddBlock('TEXT')}
              onAddMap={() => handleAddBlock('MAP')}
              onAddSectionTitle={() => handleAddBlock('SECTION_TITLE')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
