'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserActions } from '@/hooks';
import { ResumeData } from '@/lib/server';
import { PreviewActionbar, ViewMode } from '@/components/preview';
import { FullResume } from '@/components/resume/preview';
import { LoadingFallback } from '@/components/utils';

export default function PreviewClient({ messageTip }: { messageTip?: string }) {
  const { data: session } = useSession();
  const {
    resumeQuery,
    usernameQuery,
    saveResumeDataMutation,
    userProfileQuery,
  } = useUserActions();
  const [localResumeData, setLocalResumeData] = useState<ResumeData>();
  const [localProfilePicture, setLocalProfilePicture] = useState<
    string | undefined
  >();
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (resumeQuery.data?.resume?.resumeData) {
      setLocalResumeData(resumeQuery.data?.resume?.resumeData);
    }
  }, [resumeQuery.data?.resume?.resumeData]);

  // Update local profile picture when query data changes
  useEffect(() => {
    const profilePic =
      userProfileQuery.data?.profile?.image ||
      session?.user?.image ||
      undefined;
    setLocalProfilePicture(profilePic);
  }, [userProfileQuery.data?.profile?.image, session?.user?.image]);

  console.log('resumeQuery', resumeQuery.data);

  // Get profile picture: custom uploaded image > Google image > undefined
  const profilePicture = localProfilePicture;

  // Debounced save function
  const debouncedSave = useCallback(
    async (newResume: ResumeData) => {
      try {
        await saveResumeDataMutation.mutateAsync(newResume);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to save changes: ${error.message}`);
        } else {
          toast.error('Failed to save changes');
        }
      }
    },
    [saveResumeDataMutation]
  );

  const handleResumeChange = (newResume: ResumeData) => {
    setLocalResumeData(newResume);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced save (500ms)
    debounceTimerRef.current = setTimeout(() => {
      debouncedSave(newResume);
    }, 3000);
  };

  const handleImageChange = (newImageUrl: string | null) => {
    setLocalProfilePicture(newImageUrl || undefined);
    // Invalidate the user profile query to refetch the data
    userProfileQuery.refetch();
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (
    resumeQuery.isLoading ||
    usernameQuery.isLoading ||
    !usernameQuery.data ||
    !localResumeData
  ) {
    return <LoadingFallback />;
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {messageTip && (
        <div className="max-w-3xl mx-auto w-full md:px-0 px-4 pt-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 mt-0.5"
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
      <div className="flex-1 flex items-center justify-center pb-16">
        <AnimatePresence mode="wait">
          {viewMode === 'mobile' ? (
            /* Mobile View */
            <motion.div
              key="mobile"
              initial={{ opacity: 0, width: '100%', maxWidth: '768px' }}
              animate={{ opacity: 1, width: '452px', maxWidth: '452px' }}
              exit={{ opacity: 0, width: '100%', maxWidth: '768px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center items-center"
              style={{ height: 'min(80vh, 900px)' }}
            >
              <div className="relative w-full h-full">
                <motion.div
                  initial={{ borderRadius: '0.5rem' }}
                  animate={{ borderRadius: '2.5rem' }}
                  exit={{ borderRadius: '0.5rem' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full bg-white shadow-2xl overflow-hidden relative border border-gray-200"
                >
                  {/* Scrollable Content */}
                  <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-background scrollbar-hide">
                    <motion.div
                      initial={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                      animate={{ paddingLeft: '2rem', paddingRight: '2rem' }}
                      exit={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <FullResume
                        resume={localResumeData}
                        profilePicture={profilePicture}
                        isEditMode={true}
                        onChangeResume={handleResumeChange}
                        onImageChange={handleImageChange}
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
              animate={{ opacity: 1, width: '100%', maxWidth: '768px' }}
              exit={{ opacity: 0, width: '452px', maxWidth: '452px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto md:rounded-lg flex items-center justify-between"
            >
              <motion.div
                initial={{ borderRadius: '2.5rem' }}
                animate={{ borderRadius: '0.5rem' }}
                exit={{ borderRadius: '2.5rem' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full px-4"
              >
                <FullResume
                  resume={localResumeData}
                  profilePicture={profilePicture}
                  isEditMode={true}
                  onChangeResume={handleResumeChange}
                  onImageChange={handleImageChange}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-3xl mx-auto w-full md:px-0 px-4 pointer-events-auto flex justify-center">
          <PreviewActionbar
            initialUsername={usernameQuery.data.username}
            status={resumeQuery.data?.resume?.status}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isSaving={saveResumeDataMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
