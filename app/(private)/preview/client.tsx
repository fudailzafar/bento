'use client';
import LoadingFallback from '@/components/loading-fallback';
import PreviewActionbar from '@/components/preview/preview-action-bar';
import { FullResume } from '@/components/resume/preview/full-resume';
import { EditResume } from '@/components/resume/editing/edit-resume';
import { useUserActions } from '@/hooks/use-user-actions';
import { ResumeData } from '@/lib/server/redis-actions';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export default function PreviewClient({ messageTip }: { messageTip?: string }) {
  const { data: session } = useSession();
  const { resumeQuery, usernameQuery, saveResumeDataMutation } =
    useUserActions();
  const [localResumeData, setLocalResumeData] = useState<ResumeData>();
  const [isEditMode, setIsEditMode] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (resumeQuery.data?.resume?.resumeData) {
      setLocalResumeData(resumeQuery.data?.resume?.resumeData);
    }
  }, [resumeQuery.data?.resume?.resumeData]);

  console.log('resumeQuery', resumeQuery.data);

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
    }, 500);
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
    return <LoadingFallback message="Loading..." />;
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col pb-32">
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

      <div className="max-w-3xl mx-auto w-full md:rounded-lg flex items-center justify-between px-4">
        {isEditMode ? (
          <EditResume
            resume={localResumeData}
            onChangeResume={handleResumeChange}
          />
        ) : (
          <FullResume
            resume={localResumeData}
            profilePicture={session?.user?.image || undefined}
          />
        )}
      </div>

      {/* Fixed Action Bar at Bottom */}
      <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-3xl mx-auto w-full md:px-0 px-4 pointer-events-auto flex justify-center">
          <PreviewActionbar
            initialUsername={usernameQuery.data.username}
            status={resumeQuery.data?.resume?.status}
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
            isSaving={saveResumeDataMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
