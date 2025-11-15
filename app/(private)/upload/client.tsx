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
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-12">
      <div className="w-full max-w-[438px] text-center">
        <h1 className="pb-6 text-center text-base">
          Upload a PDF of your LinkedIn or your resume and generate your
          personal site <span className="text-gray-500">(Optional)</span>
        </h1>

        <div className="relative mx-2.5">
          <div className="relative flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white transition-all">
            {fileState.status === 'empty' && !isUpdating && (
              <UploadButton
                endpoint="resumeUploader"
                onClientUploadComplete={handleUploadThing}
                appearance={{
                  button:
                    'w-full h-full min-h-[220px] flex flex-col items-center justify-center bg-transparent border-none shadow-none cursor-pointer',
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
              <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center">
                <LoaderIcon className="mb-2 h-8 w-8" />
                <span className="text-sm text-gray-500">Uploading...</span>
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
                <div className="flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-2">
                  <FileText className="mx-auto size-12" />
                  <span className="text-center text-base font-bold text-black">
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
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Button
            className="group relative flex cursor-pointer items-center rounded-xl bg-design-primary px-20 py-8 text-lg font-semibold transition-transform hover:bg-design-primaryDark active:scale-95 sm:px-14 sm:py-8"
            disabled={isUpdating}
            onClick={() =>
              router.push(fileState.status === 'saved' ? '/pdf' : '/preview')
            }
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
        </div>

        {fileState.status === 'empty' && !isUpdating && (
          <button
            onClick={() => router.push('/preview')}
            className="text-sm text-gray-600 underline transition-colors hover:text-gray-900"
          >
            Skip and start from scratch
          </button>
        )}
      </div>
    </div>
  );
}
