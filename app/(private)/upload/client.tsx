'use client';

import { Button } from '@/components/ui/button';
import { Linkedin, WandSparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { CustomSpinner } from '@/components/CustomSpinner';
import LoadingFallback from '@/components/LoadingFallback';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserActions } from '@/hooks/useUserActions';
import { UploadButton } from '@/lib/utils';

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
    return <LoadingFallback message="Loading..." />;
  }

  const isUpdating = resumeQuery.isPending || uploadResumeMutation.isPending;

  return (
    <div className="flex flex-col items-center flex-1 px-4 py-12 gap-6">
      <div className="w-full max-w-[438px] text-center">
        <h1 className="text-base text-center pb-6">
          Upload a PDF of your LinkedIn or your resume and generate your
          personal site
        </h1>

        <div className="relative mx-2.5">
          <div className="w-full min-h-[220px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-white relative transition-all">
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
                  button({ ready }) {
                    return (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Linkedin className="h-6 w-6 text-gray-600" />
                        <span className="text-base font-bold text-center text-black">
                          Upload PDF
                        </span>
                        <span className="text-xs font-light text-center text-gray-500">
                          Resume or LinkedIn
                        </span>
                      </div>
                    );
                  },
                }}
              />
            )}
            {isUpdating && (
              <div className="flex flex-col items-center justify-center w-full h-full min-h-[220px]">
                <CustomSpinner className="h-8 w-8 mb-2" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            )}
            {fileState.status === 'saved' && !isUpdating && (
              <>
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full z-10"
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
                <div className="flex flex-col items-center justify-center w-full h-full min-h-[220px] gap-2">
                  <img
                    src="/user/uploaded-pdf.svg"
                    alt="PDF Icon"
                    className="h-12 w-12 mx-auto"
                  />
                  <span className="text-base font-bold text-center text-black">
                    {fileState.file.name}
                  </span>
                  <span className="text-xs font-light text-center text-gray-500">
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
              className="mt-3 hover:bg-white border border-transparent hover:border-gray-200 text-center cursor-help flex flex-row gap-1.5 justify-center mx-auto"
            >
              <span className="ml-1 inline-block w-4 h-4 rounded-full border border-gray-300 items-center justify-center text-xs cursor-help">
                i
              </span>
              <p className="text-xs text-center text-design-gray whitespace-normal">
                How to upload LinkedIn profile
              </p>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[652px] text-center !p-0 gap-0">
            <DialogTitle className="text-base text-center text-design-gray px-7 py-4">
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
      <div>
        <div className="relative">
          <Button
            className="px-4 py-3 h-auto bg-black hover:bg-black/75 cursor-pointer"
            disabled={fileState.status === 'empty' || isUpdating}
            onClick={() => router.push('/pdf')}
          >
            {isUpdating ? (
              <>Processing...</>
            ) : (
              <>
                <WandSparkles className="h-5 w-5 mr-2" />
                Generate Portfolio
              </>
            )}
          </Button>
          {fileState.status === 'empty' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute inset-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload a PDF to continue</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
