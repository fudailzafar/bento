'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { AddSkillDialog } from '@/components/resume/editing';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserActions } from '@/hooks';
import { ResumeData } from '@/lib/server';
import { DockActionBar, ViewMode } from '@/components/preview';
import { LoadingFallback } from '@/components/utils';
import { InteractablePortfolio } from '@/components/resume/preview';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollableMessageContainer } from '@/components/ui/scrollable-message-container';
import {
  ThreadContent,
  ThreadContentMessages,
} from '@/components/ui/thread-content';
import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from '@/components/ui/message-input';

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
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

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

  // Handlers for adding items
  const handleAddWorkExperience = () => {
    if (!localResumeData) return;
    const newWork = [
      ...(localResumeData.workExperience || []),
      {
        title: 'Your position',
        company: 'Your company',
        description: '1-2 lines on what you did (if u did something lol)',
        location: '',
        link: '',
        contract: '',
        start: 'March 2024',
        end: 'Jan 2025',
        logo: null,
      },
    ];
    handleResumeChange({
      ...localResumeData,
      workExperience: newWork,
    });
  };

  const handleAddEducation = () => {
    if (!localResumeData) return;
    const newEducation = [
      ...(localResumeData.education || []),
      {
        degree: 'Your degree',
        school: 'Your school',
        start: 'August 2025',
        end: '',
        logo: null,
      },
    ];
    handleResumeChange({
      ...localResumeData,
      education: newEducation,
    });
  };

  const handleAddSkill = () => {
    if (!localResumeData) return;
    setIsAddSkillDialogOpen(true);
  };

  const handleAddProject = () => {
    if (!localResumeData) return;
    const newProjects = [
      ...(localResumeData.projects || []),
      {
        title: 'Your Project',
        description:
          '2-3 lines on what this project does, impact, and numbers.',
        githubLink: 'https://github.com',
        liveLink: 'https://example.com',
        start: 'Oct 2025',
        end: null,
        skills: ['list', 'project', 'skills', 'here'],
        image: null,
      },
    ];
    handleResumeChange({
      ...localResumeData,
      projects: newProjects,
    });
  };

  const handleAddSocialLink = () => {
    if (!localResumeData) return;
    toast.info('Click on Edit button right next to the Social links section');
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
    <div className="flex min-h-screen w-full bg-background">
      {/* Chat Sidebar */}
      <div
        className={`${
          isChatOpen ? 'w-80' : 'w-0'
        } fixed right-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-l border-gray-200 bg-white transition-all duration-300`}
      >
        {isChatOpen && (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Chat Assistant
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Try: &quot;Change the name to John Doe&quot; or &quot;Add Work
                Experience&quot;
              </p>
            </div>

            <ScrollableMessageContainer className="flex-1 p-4">
              <ThreadContent variant="default">
                <ThreadContentMessages />
              </ThreadContent>
            </ScrollableMessageContainer>

            <div className="p-4 text-black">
              <MessageInput contextKey="portfolio-editor" variant="bordered">
                <MessageInputTextarea placeholder="Update the name..." />
                <MessageInputToolbar>
                  <MessageInputSubmitButton />
                </MessageInputToolbar>
              </MessageInput>
            </div>
          </>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`${
          isChatOpen ? 'right-80' : 'right-0'
        } fixed top-1/2 z-50 -translate-y-1/2 rounded-l-lg border border-gray-200 bg-white p-2 transition-all duration-300 hover:bg-gray-50`}
      >
        {isChatOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

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
        <div className="flex flex-1 items-center justify-center pb-16 md:pb-0">
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
                    animate={{ borderRadius: '2.5rem' }}
                    exit={{ borderRadius: '0.5rem' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full w-full overflow-hidden border border-gray-200 bg-white shadow-2xl"
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
                className="mx-auto flex items-center justify-between md:rounded-lg"
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
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="pointer-events-none fixed bottom-10 left-0 right-0 z-50">
          <div className="pointer-events-auto mx-auto flex w-full max-w-3xl justify-center px-4 md:px-0">
            <DockActionBar
              initialUsername={usernameQuery.data.username}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isSaving={saveResumeDataMutation.isPending}
              onAddWorkExperience={handleAddWorkExperience}
              onAddEducation={handleAddEducation}
              onAddSkill={handleAddSkill}
              onAddProject={handleAddProject}
              onAddSocialLink={handleAddSocialLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
