'use client';

import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserActions } from '@/hooks';
import { UploadButton } from '@/lib';
import { CircleArrowUpIcon, CrossIcon, LoaderIcon } from '@/components/icons';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { LoadingFallback } from '@/components/utils';
import { AuthAnimation } from '@/components/auth';

type FileState =
  | { status: 'empty' }
  | { status: 'saved'; file: { name: string; url: string; size: number } };

export default function UploadPageClient() {
  const router = useRouter();

  const { resumeQuery, uploadResumeMutation } = useUserActions();
  const [fileState, setFileState] = useState<FileState>({ status: 'empty' });

  const resume = resumeQuery.data?.resume;

  // Update fileState whenever resume changes
  useEffect(() => {
    if (resume?.file?.url && resume.file.name && resume.file.size) {
      setFileState({
        status: 'saved',
        file: {
          name: resume.file.name,
          url: resume.file.url,
          size: resume.file.size,
        },
      });
    }
  }, [resume]);

  // Handles UploadThing result
  const handleUploadThing = (res: any[]) => {
    if (res && res[0]) {
      // res[0].name, res[0].url, res[0].size
      uploadResumeMutation.mutate({
        name: res[0].name,
        url: res[0].url ?? res[0].fileUrl ?? '',
        size: res[0].size ?? 0,
      });
    }
  };

  const handleReset = () => {
    setFileState({ status: 'empty' });
  };

  if (resumeQuery.isLoading) {
    return <LoadingFallback />;
  }

  const isUpdating = resumeQuery.isPending || uploadResumeMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:justify-between sm:px-6 md:gap-12 lg:gap-16 lg:px-32">
      <div className="w-full max-w-[440px] space-y-6 sm:space-y-8">
        <div className="text-left">
          <h1 className="text-xl font-semibold text-design-black sm:text-2xl md:mb-4 lg:text-2xl">
            Now, let's upload your resume for your portfolio.
          </h1>
        </div>

        <div className="relative">
          <div className="relative flex min-h-[180px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white transition-all sm:min-h-[220px]">
            {fileState.status === 'empty' && !isUpdating && (
              <UploadButton
                endpoint="resumeUploader"
                onClientUploadComplete={handleUploadThing}
                appearance={{
                  button:
                    'w-full h-full min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-center bg-transparent border-none shadow-none cursor-pointer',
                  container: 'w-full',
                }}
                content={{
                  button() {
                    return (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CircleArrowUpIcon className="h-6 w-6 text-gray-600" />
                        <span className="text-center text-base font-bold text-black">
                          Upload PDF
                        </span>
                        <span className="text-center text-xs font-light text-gray-500">
                          Resume or LinkedIn
                        </span>
                      </div>
                    );
                  },
                }}
              />
            )}
            {isUpdating && (
              <div className="flex h-full min-h-[180px] w-full flex-col items-center justify-center sm:min-h-[220px]">
                <LoaderIcon className="mb-2 h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-xs text-gray-500 sm:text-sm">
                  Uploading...
                </span>
              </div>
            )}
            {fileState.status === 'saved' && !isUpdating && (
              <>
                <button
                  onClick={handleReset}
                  className="absolute right-2 top-2 z-10 rounded-full p-1 hover:bg-gray-100"
                  disabled={isUpdating}
                >
                  <CrossIcon className="h-4 w-4 text-gray-500" />
                </button>
                <div className="flex h-full min-h-[180px] w-full flex-col items-center justify-center gap-2 sm:min-h-[220px]">
                  <FileText className="mx-auto size-10 sm:size-12" />
                  <span className="text-center text-sm font-bold text-black sm:text-base">
                    {fileState.file.name}
                  </span>
                  <span className="text-center text-xs font-light text-gray-500">
                    {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="mx-auto mt-3 flex cursor-help flex-row justify-center gap-1.5 border border-transparent text-center hover:border-gray-200 hover:bg-white"
            >
              <span className="ml-1 inline-block h-4 w-4 cursor-help items-center justify-center rounded-full border border-gray-300 text-xs">
                i
              </span>
              <p className="whitespace-normal text-center text-xs text-design-gray">
                How to upload LinkedIn profile
              </p>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[652px] gap-0 !p-0 text-center">
            <DialogTitle className="px-7 py-4 text-center text-base text-design-gray">
              Go to your profile → Click on “Resources” → Then “Save to PDF”
            </DialogTitle>
            <img
              src="/user/linkedin-save-to-pdf.png"
              alt="Linkedin Steps to Save PDF"
              className="h-auto w-full"
            />
          </DialogContent>
        </Dialog>

        <div className="flex w-full flex-row items-center gap-3">
          <Button
            className="flex-1 cursor-pointer rounded-md bg-design-primary py-6 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-design-primaryDark active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 md:rounded-lg md:py-3"
            disabled={isUpdating}
            onClick={async () => {
              if (fileState.status === 'saved') {
                router.push('/pdf');
              } else {
                const usernameRes = await fetch('/api/username');
                const usernameData = await usernameRes.json();
                router.push(
                  usernameData.username
                    ? `/${usernameData.username}`
                    : '/upload'
                );
              }
            }}
          >
            {isUpdating ? (
              <>
                <LoaderIcon />
              </>
            ) : fileState.status === 'saved' ? (
              <>Generate Portfolio</>
            ) : (
              <>Continue</>
            )}
          </Button>
          {fileState.status === 'empty' && !isUpdating && (
            <Button
              onClick={async () => {
                const usernameRes = await fetch('/api/username');
                const usernameData = await usernameRes.json();
                router.push(
                  usernameData.username
                    ? `/${usernameData.username}`
                    : '/upload'
                );
              }}
              className="flex-1 rounded-md py-6 text-sm text-gray-600 transition-colors hover:text-gray-900 md:py-3"
              variant={'ghost'}
            >
              Skip
            </Button>
          )}
        </div>
      </div>

      <div className="hidden max-w-[700px] flex-1 items-center justify-center md:flex">
        <AuthAnimation />
      </div>
    </div>
  );
}
