'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Responsive, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { Block, BlockType, defaultBlockData } from '@/lib';
import { MousePointerClick, Move, Pencil } from 'lucide-react';
import { TrashIcon } from '@/components/icons';
import { toast } from 'sonner';
import { fetchLinkPreview, isVideoFile, uploadBlockMedia } from '@/lib/media';
import { findPlatform } from '@/lib/platforms';
import { cn } from '@/lib/utils';
import { BlockContent, type BlockEditing } from './block-content';
import {
  DESKTOP_MIN_WIDTH,
  PHONE_COLUMNS,
  packInOrder,
  phonePlacements,
  readingOrder,
  withPhoneLayout,
} from '@/lib/layout';
import { CropEditor } from './editing/crop-editor';
import { widgetRadius } from './editing/widget-radius';
import { NO_DRAG } from './editing/no-drag';
import { WidgetToolbar } from './editing/widget-toolbar';
import { EditDrawer } from './editing/edit-drawer';
import { MobileBar } from './editing/mobile-bar';

type GridProps = React.ComponentProps<typeof Responsive>;

const MOBILE_GAP = 24;

// A file on its way up: its picture, and how far along it is (0–1).
export interface UploadState {
  preview?: string;
  kind: 'image' | 'video';
  progress: number;
}

interface BentoGridProps {
  isEditMode?: boolean;
  blocks?: Block[];
  onBlocksChange?: (newBlocks: Block[]) => void;
  // Link clicks per block, shown on hover in the editor.
  clicks?: Record<string, number>;
  // The editor's phone view: the phone layout whatever the window's width.
  forceMobile?: boolean;
  // Uploads started outside the grid (a new widget made from a chosen file).
  uploads?: Record<string, UploadState>;
  // Links whose details are being fetched (started outside the grid).
  fetchingIds?: string[];
  // Lets the editor ask which row of the grid is in view.
  anchorRef?: React.MutableRefObject<
    (() => { row: number; desktop: boolean }) | null
  >;
}

export function BentoGrid({
  isEditMode = false,
  blocks = [],
  onBlocksChange,
  clicks,
  forceMobile = false,
  uploads: externalUploads,
  fetchingIds = [],
  anchorRef,
}: BentoGridProps) {
  const [mounted, setMounted] = useState(false);
  // The widget being edited in place: its toolbar stays open.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Files being uploaded: the picture shows straight away, with a progress ring.
  const [ownUploads, setUploads] = useState<Record<string, UploadState>>({});
  const uploads = { ...ownUploads, ...externalUploads };
  const [ownFetching, setOwnFetching] = useState<string[]>([]);
  const fetchingAll = [...ownFetching, ...fetchingIds];
  const [croppingBlockId, setCroppingBlockId] = useState<string | null>(null);
  // On phones a widget is edited in a drawer, opened from its edit button.
  const [drawerId, setDrawerId] = useState<string | null>(null);
  // Cropping ends when the widget is no longer the one being edited.
  useEffect(() => {
    if (croppingBlockId && selectedId !== croppingBlockId) {
      setCroppingBlockId(null);
    }
  }, [selectedId, croppingBlockId]);
  const blocksRef = useRef(blocks);
  // The widgets there when the grid first shows: only they animate in.
  const loadedIds = useRef<Set<string> | null>(null);
  blocksRef.current = blocks;

  // Which bento layout to use, and the grid's width (tile height follows it,
  // so squares stay square).
  const [wideScreen, setWideScreen] = useState<boolean | null>(null);
  const [width, setWidth] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Element | null;
      // Clicking another widget selects it instead (its own handler).
      // The phone toolbar and drawer belong to the selected widget.
      if (!target?.closest?.('[data-block-id],[data-keep-selection]'))
        setSelectedId(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [selectedId]);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const onChange = () => setWideScreen(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    if (wrapper.current) {
      // Read the width now too; the observer may not fire in a hidden tab.
      setWidth(wrapper.current.getBoundingClientRect().width);
      observer.observe(wrapper.current);
    }
    return () => {
      mql.removeEventListener('change', onChange);
      observer.disconnect();
    };
  }, [mounted]);
  const desktop = wideScreen === null ? null : wideScreen && !forceMobile;
  // bento's phone editing: tap a widget to select it, edit it in a drawer,
  // and move it by its handle alone.
  const mobileEdit = isEditMode && desktop === false;

  const gridLayouts: Layout[] = blocks.map((block) => ({
    i: block.id,
    x: block.x,
    y: block.y === Infinity ? 9999 : block.y,
    w: block.w,
    h: block.h,
    minW: 1,
    minH: 1,
    maxW: 4,
    maxH: 4,
    isDraggable: isEditMode,
    isResizable: false,
  }));

  const handleGridLayoutChange = (currentLayout: Layout[]) => {
    if (!onBlocksChange) return;

    let hasChanges = false;
    const newBlocks = blocksRef.current.map((block) => {
      const match = currentLayout.find((l) => l.i === block.id);

      // ONLY sync x and y — w/h changes from react-grid-layout are auto-compaction
      // on smaller breakpoints, not real resizes, so they must be ignored here.
      if (match && (match.x !== block.x || match.y !== block.y)) {
        hasChanges = true;
        return { ...block, x: match.x, y: match.y };
      }
      return block;
    });

    if (hasChanges) {
      onBlocksChange(newBlocks);
    }
  };

  const updateBlockSize = (id: string, w: number, h: number) => {
    if (!onBlocksChange) return;
    if (desktop === false) {
      // A size set in the phone view is the phone layout's own.
      const resized = phonePlacements(blocksRef.current).map((p) =>
        p.id === id ? { ...p, w: Math.min(w, PHONE_COLUMNS), h } : p
      );
      onBlocksChange(
        withPhoneLayout(
          blocksRef.current,
          packInOrder(readingOrder(resized), PHONE_COLUMNS)
        )
      );
      return;
    }
    onBlocksChange(
      blocksRef.current.map((block) =>
        block.id === id ? { ...block, w, h } : block
      )
    );
  };

  const updateBlockData = (id: string, data: Record<string, unknown>) => {
    if (!onBlocksChange) return;
    onBlocksChange(
      blocksRef.current.map((block) =>
        block.id === id ? { ...block, data } : block
      )
    );
  };

  const patchBlock = (id: string, patch: Record<string, unknown>) => {
    const block = blocksRef.current.find((b) => b.id === id);
    if (block) updateBlockData(id, { ...block.data, ...patch });
  };

  const uploadInto = async (
    id: string,
    file: File,
    field: 'url' | 'customImage' | 'gallery'
  ) => {
    const preview = field === 'gallery' ? undefined : URL.createObjectURL(file);
    setUploads((u) => ({
      ...u,
      [id]: {
        preview,
        kind: isVideoFile(file) ? 'video' : 'image',
        progress: 0,
      },
    }));
    try {
      const url = await uploadBlockMedia(file, 'image.jpg', (progress) =>
        setUploads((u) => (u[id] ? { ...u, [id]: { ...u[id], progress } } : u))
      );
      patchBlock(
        id,
        field === 'url'
          ? {
              url,
              kind: isVideoFile(file) ? 'video' : 'image',
            }
          : field === 'gallery'
            ? {
                images: [
                  ...((
                    blocks.find((b) => b.id === id)?.data as {
                      images?: string[];
                    }
                  )?.images ?? []),
                  url,
                ].slice(0, 6),
              }
            : { customImage: url }
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    } finally {
      setUploads(({ [id]: done, ...rest }) => {
        if (done?.preview) URL.revokeObjectURL(done.preview);
        return rest;
      });
    }
  };

  // A link's address is set in place; its preview (and title, for plain
  // sites) fills in once fetched.
  const setLinkUrl = async (id: string, url: string) => {
    patchBlock(id, {
      url,
      image: undefined,
      description: undefined,
      favicon: undefined,
    });
    setOwnFetching((ids) => [...ids, id]);
    const preview = await fetchLinkPreview(url);
    setOwnFetching((ids) => ids.filter((x) => x !== id));
    const block = blocksRef.current.find((b) => b.id === id);
    const title = (block?.data as { title?: string } | undefined)?.title;
    const untitled =
      !title || title === 'New link' || title === 'Untitled link';
    patchBlock(id, {
      image: preview.image,
      description: preview.description,
      favicon: preview.icon ?? '',
      ...(untitled && !findPlatform(url) && preview.title
        ? { title: preview.title }
        : {}),
    });
  };

  // Links saved before icons were kept get theirs once, in the editor: the
  // result (an empty string when the site has none) is stored, so nothing is
  // ever fetched twice.
  const backfilled = useRef(new Set<string>());
  useEffect(() => {
    if (!isEditMode) return;
    const todo = blocks.filter((b) => {
      const data = b.data as { url?: string; favicon?: string };
      return (
        b.type === 'LINK' &&
        !!data.url &&
        data.favicon === undefined &&
        !findPlatform(data.url) &&
        !backfilled.current.has(b.id)
      );
    });
    if (!todo.length) return;
    todo.forEach((b) => backfilled.current.add(b.id));
    setOwnFetching((ids) => [...ids, ...todo.map((b) => b.id)]);
    todo.forEach(async (b) => {
      const preview = await fetchLinkPreview((b.data as { url: string }).url);
      setOwnFetching((ids) => ids.filter((x) => x !== b.id));
      patchBlock(b.id, { favicon: preview.icon ?? '' });
    });
    // patchBlock reads the latest blocks from a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, isEditMode]);

  const editingFor = (block: Block): BlockEditing => ({
    onPatch: (patch) => patchBlock(block.id, patch),
    onSetUrl: (url) => setLinkUrl(block.id, url),
    onUpload: (file, field) => uploadInto(block.id, file, field),
    inline: !mobileEdit,
    uploading: block.id in uploads,
    fetching: fetchingAll.includes(block.id),
    preview: uploads[block.id]?.preview
      ? { url: uploads[block.id].preview!, kind: uploads[block.id].kind }
      : undefined,
    progress: uploads[block.id]?.progress,
  });

  const deleteBlock = (id: string) => {
    if (!onBlocksChange) return;
    setSelectedId(null);
    setDrawerId(null);
    onBlocksChange(blocksRef.current.filter((block) => block.id !== id));
  };

  if (!mounted) return null;

  // bento's widget suggestions: an empty editor shows dashed "Add …" tiles
  // that drop in that block type.
  if (isEditMode && blocks.length === 0 && onBlocksChange) {
    const suggestions: { type: BlockType; label: string }[] = [
      { type: 'LINK', label: 'Add Link' },
      { type: 'IMAGE', label: 'Add Photo' },
      { type: 'TEXT', label: 'Add Note' },
      { type: 'MAP', label: 'Add Map' },
    ];
    return (
      <div className="mx-auto grid w-full max-w-[820px] grid-cols-2 gap-6 pb-32 xl:grid-cols-4 xl:gap-10">
        {suggestions.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => onBlocksChange([newBlock(type, 0)])}
            className="relative flex aspect-square flex-col items-center justify-center gap-2 rounded-[24px] border-2 border-dashed border-black/[.08] text-xs font-semibold text-black transition-colors hover:border-black/20 hover:bg-black/[.02] active:scale-[.97]"
          >
            <span className="absolute right-3 top-2 text-lg font-normal leading-none text-black/20">
              +
            </span>
            {label}
          </button>
        ))}
      </div>
    );
  }

  // bento's two layouts, in the editor and on the public profile alike: 4
  // columns with 40px gaps from 1280px, otherwise 2 columns with 24px gaps
  // and tiles scaled to the width (a phone, a tablet and the editor's phone
  // view are the same layout). Tile height follows width, so squares stay
  // square.
  const publicMode = !isEditMode;
  if (desktop === null || width === 0) {
    return <div ref={wrapper} className="w-full" />;
  }
  const cols = desktop ? 4 : 2;
  const gap = desktop ? 40 : MOBILE_GAP;
  const colWidth = (width - gap * (cols - 1)) / cols;
  const rowHeight = (colWidth - gap) / 2;
  if (anchorRef) {
    // The row a fifth of the way down the screen: where new widgets go.
    anchorRef.current = () => {
      const top = wrapper.current?.getBoundingClientRect().top ?? 0;
      const offset = window.innerHeight * 0.2 - top;
      return {
        row: Math.max(0, Math.round(offset / (rowHeight + gap))),
        desktop: !!desktop,
      };
    };
  }
  // How much wider or narrower than bento's 175px tile this one is: notes
  // scale their text and padding by it.
  const scale = colWidth / 175;
  // The phone layout has its own positions and sizes (derived from the desktop
  // one until it is first edited).
  const phoneById = new Map(
    (desktop ? [] : phonePlacements(blocks)).map((p) => [p.id, p])
  );
  const publicLayout: Layout[] = desktop
    ? gridLayouts
    : blocks.map((b) => {
        const p = phoneById.get(b.id)!;
        return {
          i: b.id,
          x: p.x,
          y: p.y,
          w: p.w,
          h: p.h,
          minW: 1,
          minH: 1,
          maxW: PHONE_COLUMNS,
          maxH: 4,
          isDraggable: isEditMode,
          isResizable: false,
        };
      });
  // The blocks as the current layout sees them: their size there decides how
  // a widget draws.
  const viewBlocks = blocks.map((b) => {
    const p = phoneById.get(b.id);
    return p ? { ...b, x: p.x, y: p.y, w: p.w, h: p.h } : b;
  });
  const selectedBlock = viewBlocks.find((b) => b.id === selectedId);
  const gridProps: Partial<GridProps> = {
    layouts: { lg: publicLayout },
    breakpoints: { lg: 0 },
    width,
    cols: { lg: cols },
    rowHeight,
    margin: [gap, gap] as [number, number],
  };
  const Grid = Responsive as React.ComponentType<GridProps>;
  // Dropping a widget in the phone layout saves the phone layout; the desktop
  // one is left as it is.
  const commitPhoneLayout = (layout: Layout[]) => {
    if (!onBlocksChange) return;
    onBlocksChange(
      withPhoneLayout(
        blocksRef.current,
        layout.map((l) => ({ id: l.i, x: l.x, y: l.y, w: l.w, h: l.h }))
      )
    );
  };
  loadedIds.current ??= new Set(blocks.map((b) => b.id));
  // bento staggers each widget by its grid position: 0.15s per tile across
  // and down, after 0.2s (0.5s on phones).
  const entranceDelay = (id: string) => {
    const item = publicLayout.find((l) => l.i === id);
    if (!item) return 0;
    return 0.15 * item.x + 0.15 * (item.y / 2) + (desktop ? 0.2 : 0.5);
  };

  return (
    <div
      ref={wrapper}
      className={
        publicMode
          ? 'w-full'
          : cn(
              'mx-auto w-full pb-32',
              desktop ? 'max-w-[820px]' : 'max-w-[380px]'
            )
      }
    >
      <Grid
        className="layout"
        {...gridProps}
        containerPadding={[0, 0]}
        onLayoutChange={(layout) => {
          if (isEditMode && desktop) handleGridLayoutChange(layout);
        }}
        onDragStop={(layout) => {
          if (isEditMode && !desktop) commitPhoneLayout(layout);
        }}
        isDraggable={isEditMode}
        draggableCancel={`.${NO_DRAG}`}
        {...(mobileEdit ? { draggableHandle: '.bento-drag-handle' } : {})}
        isResizable={false}
        compactType="vertical"
        useCSSTransforms={true}
      >
        {viewBlocks.map((block) => {
          const data = block.data as { url?: string; href?: string };
          // Any widget with a link tints and presses down, as on bento.
          const clickable =
            publicMode && (block.type === 'LINK' ? !!data?.url : !!data?.href);
          // Section titles are bento's plain labels above a group, not cards.
          const label = block.type === 'SECTION_TITLE';
          const selected = isEditMode && selectedId === block.id;
          const card = (
            // bento's widget: corners by size, 8% black hairline with a faint
            // white top highlight, 0 2px 4px shadow. Linked widgets tint on
            // hover (inside the tile) and press down to 97%. A selected widget
            // looks like any other: only its toolbar shows.
            <div
              data-widget
              style={
                {
                  '--widget-radius': `${widgetRadius(block)}px`,
                  // Notes scale with the tile; link tiles pad 24px, or 20px
                  // on phones.
                  '--ws': scale,
                  '--tile-pad': desktop ? '24px' : '20px',
                  // bento's caption tag: 10px on the large square, else 8px.
                  '--caption-radius':
                    block.w >= 2 && block.h >= 4 ? '10px' : '8px',
                } as React.CSSProperties
              }
              className={cn(
                'rounded-[var(--widget-radius)] [transition:box-shadow_.2s_ease-in-out,transform_.24s_cubic-bezier(.43,.01,.29,1),background_.2s_cubic-bezier(.43,.01,.29,1)]',
                // bento's section title is 60px tall, sitting on the bottom
                // of its row so it stays 40px above what it introduces.
                label
                  ? 'absolute inset-x-0 bottom-0 h-[60px]'
                  : 'relative h-full w-full',
                !label && 'bg-card shadow-[0_2px_4px_rgba(0,0,0,.04)]',
                label && selected && 'bg-card',
                // On a phone the selected widget lifts, as bento's does.
                selected &&
                  mobileEdit &&
                  !label &&
                  '-translate-y-1 shadow-[0_25px_31px_rgba(0,0,0,.06),0_16.2px_18.16px_rgba(0,0,0,.046),0_9.63px_9.87px_rgba(0,0,0,.036),0_5px_5.04px_rgba(0,0,0,.03),0_2.04px_2.53px_rgba(0,0,0,.024),0_.46px_1.22px_rgba(0,0,0,.014)]',
                clickable &&
                  'group/card cursor-pointer active:scale-[.97] active:shadow-none'
              )}
            >
              <div className="h-full w-full overflow-hidden rounded-[inherit]">
                <BlockContent
                  block={block}
                  interactive={!isEditMode}
                  edit={isEditMode ? editingFor(block) : undefined}
                />
              </div>
              {label && isEditMode && (
                // The title shows its outline while editing: a hairline on
                // hover, 2px black when selected.
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 rounded-[inherit] border transition-[border,opacity] duration-200 ease-in-out',
                    selected
                      ? 'border-2 border-black'
                      : 'border-black/[.08] opacity-0 group-hover:opacity-100'
                  )}
                />
              )}
              {!label && (
                <>
                  <div className="pointer-events-none absolute inset-px rounded-[calc(var(--widget-radius)-1px)] border border-white/[.22] [mask-image:linear-gradient(0deg,transparent,#000)]" />
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 rounded-[inherit] border transition-[border,opacity] duration-200 ease-in-out',
                      selected && mobileEdit
                        ? 'border-2 border-black'
                        : 'border-black/[.08]'
                    )}
                  />
                </>
              )}
            </div>
          );
          return (
            <div
              key={block.id}
              data-block-id={block.id}
              // Desktop selects on press; a phone on tap, so scrolling past a
              // widget doesn't select it.
              onPointerDown={() => {
                if (isEditMode && !mobileEdit) setSelectedId(block.id);
              }}
              onClick={() => {
                if (mobileEdit) setSelectedId(block.id);
              }}
              className={cn(
                'group relative overflow-visible',
                isEditMode && 'cursor-grab hover:z-50 active:cursor-grabbing',
                selectedId === block.id && 'z-[60] hover:z-[60]',
                // The other widgets blur away while one is being cropped.
                croppingBlockId &&
                  croppingBlockId !== block.id &&
                  'pointer-events-none opacity-60 blur-[8px] transition-[filter,opacity] duration-300'
              )}
            >
              {publicMode || loadedIds.current?.has(block.id) ? (
                // bento's entrance, on the public profile and in the editor:
                // fade in and rise 60px over 1s, slight overshoot. A widget
                // added in the editor just appears.
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    opacity: {
                      duration: 1,
                      ease: [0.42, 0, 0.25, 1],
                      delay: entranceDelay(block.id),
                    },
                    y: {
                      duration: 1,
                      ease: [0.2, 1.18, 0.47, 1],
                      delay: entranceDelay(block.id),
                    },
                  }}
                >
                  {card}
                </motion.div>
              ) : (
                card
              )}

              {isEditMode && (
                <>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => deleteBlock(block.id)}
                    className={cn(
                      NO_DRAG,
                      // The same delete button as the profile picture's.
                      'absolute -left-3 -top-3 z-50 flex size-9 items-center justify-center rounded-full border border-neutral-300 bg-white opacity-0 shadow-lg backdrop-blur-sm transition-all hover:bg-white/90 group-hover:opacity-100',
                      selectedId === block.id && 'opacity-100',
                      // Bigger to tap, and only on the selected widget.
                      mobileEdit &&
                        'size-11 group-hover:pointer-events-none group-hover:opacity-0',
                      mobileEdit &&
                        selectedId === block.id &&
                        '!pointer-events-auto !opacity-100',
                      label && 'top-[calc(100%-72px)]'
                    )}
                  >
                    <TrashIcon className="size-4 text-black" />
                  </button>

                  {mobileEdit && selectedId === block.id && (
                    <>
                      <button
                        type="button"
                        aria-label="Edit"
                        onClick={() => setDrawerId(block.id)}
                        className={cn(
                          NO_DRAG,
                          'absolute -right-3 -top-3 z-50 flex size-11 items-center justify-center rounded-full bg-black text-white shadow-[0_6px_14px_rgba(0,0,0,.2)] active:scale-95',
                          label && 'top-[calc(100%-72px)]'
                        )}
                      >
                        <Pencil className="size-[18px]" />
                      </button>
                      <div
                        aria-label="Move"
                        role="button"
                        className={cn(
                          'bento-drag-handle absolute -bottom-5 left-1/2 z-50 flex size-11 -translate-x-1/2 cursor-grab touch-none items-center justify-center rounded-full bg-black text-white shadow-[0_6px_14px_rgba(0,0,0,.2)] active:cursor-grabbing',
                          label && 'bottom-[-14px]'
                        )}
                      >
                        <Move className="size-5" />
                      </div>
                    </>
                  )}

                  {croppingBlockId === block.id && block.type === 'IMAGE' && (
                    <CropEditor
                      src={(block.data as { url: string }).url}
                      posX={(block.data as { posX?: number }).posX ?? 0.5}
                      posY={(block.data as { posY?: number }).posY ?? 0.5}
                      radius={widgetRadius(block)}
                      onCommit={(pos) => patchBlock(block.id, pos)}
                    />
                  )}

                  {block.type !== 'SECTION_TITLE' && !mobileEdit && (
                    <div
                      className={cn(
                        'absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100',
                        selectedId === block.id
                          ? 'opacity-100'
                          : 'pointer-events-none group-hover:pointer-events-auto'
                      )}
                    >
                      <WidgetToolbar
                        selected={selectedId === block.id}
                        block={block}
                        onResize={(w, h) => updateBlockSize(block.id, w, h)}
                        onPatch={(patch) => patchBlock(block.id, patch)}
                        cropping={croppingBlockId === block.id}
                        onCrop={() =>
                          setCroppingBlockId((id) =>
                            id === block.id ? null : block.id
                          )
                        }
                      />
                    </div>
                  )}

                  {clicks?.[block.id] &&
                  block.type !== 'IMAGE' &&
                  !mobileEdit ? (
                    <div className="pointer-events-none absolute right-3 top-3 z-40 flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <MousePointerClick size={12} />
                      {clicks[block.id]}{' '}
                      {clicks[block.id] === 1 ? 'click' : 'clicks'}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </Grid>

      {mobileEdit && selectedBlock && (
        <MobileBar
          block={selectedBlock}
          onResize={(w, h) => updateBlockSize(selectedBlock.id, w, h)}
          onDone={() => {
            setDrawerId(null);
            setSelectedId(null);
          }}
        />
      )}
      {mobileEdit && (
        <EditDrawer
          block={viewBlocks.find((b) => b.id === drawerId) ?? null}
          edit={
            drawerId
              ? editingFor(viewBlocks.find((b) => b.id === drawerId)!)
              : null
          }
          onClose={() => setDrawerId(null)}
        />
      )}
    </div>
  );
}

export function newBlock(
  type: BlockType,
  y: number,
  data?: Record<string, unknown>
): Block {
  const w = type === 'SECTION_TITLE' ? 4 : 1;
  const h = type === 'SECTION_TITLE' ? 1 : 2;
  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 11),
    type,
    x: 0,
    y,
    w,
    h,
    data: { ...defaultBlockData(type), ...data },
  };
}
