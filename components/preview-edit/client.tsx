'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { AddSkillDialog } from '@/components/resume/editing';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserActions } from '@/hooks';
import { ResumeData } from '@/lib/server';
import { DockActionBar, ViewMode } from '@/components/preview';
import { LoadingFallback } from '@/components/utils';
import { InteractablePortfolio } from '@/components/resume/preview';
import { ChatSidebar } from './chat-sidebar';

export default function PreviewClient({ messageTip }: { messageTip?: string }) {

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
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (resumeQuery.data?.resume?.resumeData) {
      // Ensure education field exists for schema validation
      const resumeData = resumeQuery.data.resume.resumeData;
      const resumeWithEducation = {
        ...resumeData,
        education: resumeData.education || [],
      };
      setLocalResumeData(resumeWithEducation);
    }
  }, [resumeQuery.data?.resume?.resumeData]);

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
    // Ensure education field exists for schema validation
    const resumeWithEducation = {
      ...newResume,
      education: newResume.education || [],
    };

    setLocalResumeData(resumeWithEducation);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced save (500ms)
    debounceTimerRef.current = setTimeout(() => {
      debouncedSave(resumeWithEducation);
    }, 500);
  };

  const handleImageChange = (newImageUrl: string | null) => {
    setLocalProfilePicture(newImageUrl || undefined);
    // Invalidate the user profile query to refetch the data
    userProfileQuery.refetch();
  };

  // Add widget for Bento Grid
  const handleAddWidget = (type: string) => {
    if (!localResumeData) return;
    
    // Default size is "Small Square" (1x2)
    let w = 1;
    let h = 2;
    
    if (type === 'sectionTitle') {
      w = 4;
      h = 1;
    }

    // Find the current max y position to place it at the bottom
    const maxY = localResumeData.layout?.reduce((max, item) => Math.max(max, item.y + item.h), 0) || 0;

    const newWidget = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 0,
      y: maxY, // Place at the bottom
      w,
      h,
      data: {},
    };
    
    handleResumeChange({
      ...localResumeData,
      layout: [...(localResumeData.layout || []), newWidget as any],
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
    resumeQuery.isLoading ||
    usernameQuery.isLoading ||
    !usernameQuery.data ||
    !localResumeData
  ) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <ChatSidebar isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Add Skill Dialog */}
        <AddSkillDialog
          open={isAddSkillDialogOpen}
          onOpenChange={setIsAddSkillDialogOpen}
          onAddSkill={(skillToAdd) => {
            if (!localResumeData) return;
            if ((localResumeData.header.skills || []).includes(skillToAdd)) {
              toast.warning('This skill is already added.');
            } else {
              handleResumeChange({
                ...localResumeData,
                header: {
                  ...localResumeData.header,
                  skills: [
                    ...(localResumeData.header.skills || []),
                    skillToAdd,
                  ],
                },
              });
            }
          }}
        />
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
                        <InteractablePortfolio
                          resume={localResumeData}
                          profilePicture={profilePicture}
                          isEditMode={true}
                          onChangeResume={handleResumeChange}
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
                  <InteractablePortfolio
                    resume={localResumeData}
                    profilePicture={profilePicture}
                    isEditMode={true}
                    onChangeResume={handleResumeChange}
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
              isSaving={saveResumeDataMutation.isPending}
              onAddLink={() => handleAddWidget('link')}
              onAddImage={() => handleAddWidget('image')}
              onAddText={() => handleAddWidget('text')}
              onAddMap={() => handleAddWidget('map')}
              onAddSectionTitle={() => handleAddWidget('sectionTitle')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
