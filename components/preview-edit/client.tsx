'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageActions } from '@/hooks';
import { PageData, BlockType } from '@/lib';
import { DockActionBar, ViewMode } from '@/components/preview';
import { LoadingFallback } from '@/components/utils';
import { PreviewPortfolio, newBlock } from '@/components/bento';

export default function PreviewClient({ messageTip }: { messageTip?: string }) {
  const { pageQuery, usernameQuery, savePageMutation, userProfileQuery } =
    usePageActions();
  const [localPage, setLocalPage] = useState<PageData>();
  const [localProfilePicture, setLocalProfilePicture] = useState<
    string | undefined
  >();
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pageQuery.data?.page) {
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

  const debouncedSave = useCallback(
    async (newPage: PageData) => {
      try {
        await savePageMutation.mutateAsync(newPage);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to save changes: ${error.message}`);
        } else {
          toast.error('Failed to save changes');
        }
      }
    },
    [savePageMutation]
  );

  const handlePageChange = (newPage: PageData) => {
    setLocalPage(newPage);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      debouncedSave(newPage);
    }, 500);
  };

  const handleImageChange = (newImageUrl: string | null) => {
    setLocalProfilePicture(newImageUrl || undefined);
    userProfileQuery.refetch();
  };

  const handleAddBlock = (type: BlockType) => {
    if (!localPage) return;

    const maxY = (localPage.blocks || []).reduce(
      (max, block) => Math.max(max, block.y + block.h),
      0
    );

    handlePageChange({
      ...localPage,
      blocks: [...(localPage.blocks || []), newBlock(type, maxY)],
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (
    pageQuery.isLoading ||
    usernameQuery.isLoading ||
    !usernameQuery.data ||
    !localPage
  ) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
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

        {/* Desktop/Mobile View Toggle */}
        <div
          className={`flex flex-1 items-center justify-center pb-24 ${viewMode === 'mobile' ? 'bg-[#f8f8f8]' : ''}`}
        >
          <AnimatePresence mode="wait">
            {viewMode === 'mobile' ? (
              /* Mobile View */
              <motion.div
                key="mobile"
                initial={{ opacity: 0, width: '100%', maxWidth: '768px' }}
                animate={{ opacity: 1, width: '452px', maxWidth: '452px' }}
                exit={{ opacity: 0, width: '100%', maxWidth: '768px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
                style={{ height: 'min(80vh, 900px)' }}
              >
                <div className="relative h-full w-full">
                  <motion.div
                    initial={{ borderRadius: '0.5rem' }}
                    animate={{ borderRadius: '4.5rem' }}
                    exit={{ borderRadius: '0.5rem' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full w-full overflow-hidden border border-gray-200 bg-white shadow-lg"
                  >
                    {/* Scrollable Content */}
                    <div className="scrollbar-hide h-full w-full overflow-y-auto overflow-x-hidden bg-background">
                      <motion.div
                        initial={{
                          paddingLeft: '1rem',
                          paddingRight: '1rem',
                        }}
                        animate={{
                          paddingLeft: '2rem',
                          paddingRight: '2rem',
                        }}
                        exit={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                        transition={{
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <PreviewPortfolio
                          page={localPage}
                          profilePicture={profilePicture}
                          isEditMode={true}
                          onChangePage={handlePageChange}
                          onImageChange={handleImageChange}
                          username={usernameQuery.data?.username}
                          viewMode={viewMode}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* Desktop View */
              <motion.div
                key="desktop"
                initial={{ opacity: 0, width: '452px', maxWidth: '452px' }}
                animate={{ opacity: 1, width: '100%', maxWidth: '1400px' }}
                exit={{ opacity: 0, width: '452px', maxWidth: '452px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto flex items-center justify-between xl:rounded-lg"
              >
                <motion.div
                  initial={{ borderRadius: '2.5rem' }}
                  animate={{ borderRadius: '0.5rem' }}
                  exit={{ borderRadius: '2.5rem' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full px-4"
                >
                  <PreviewPortfolio
                    page={localPage}
                    profilePicture={profilePicture}
                    isEditMode={true}
                    onChangePage={handlePageChange}
                    onImageChange={handleImageChange}
                    username={usernameQuery.data?.username}
                    viewMode={viewMode}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="pointer-events-none fixed bottom-1 left-0 right-0 z-50 xl:bottom-10">
          <div className="pointer-events-auto mx-auto flex w-full max-w-3xl justify-center px-4 md:px-0">
            <DockActionBar
              initialUsername={usernameQuery.data.username}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isSaving={savePageMutation.isPending}
              onAddLink={() => handleAddBlock('LINK')}
              onAddImage={() => handleAddBlock('IMAGE')}
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
