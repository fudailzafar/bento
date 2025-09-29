'use client';

import { Button } from '@/components/ui/button';
import { FileText, Linkedin, WandSparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { CustomSpinner } from '@/components/upload/custom-spinner';
import LoadingFallback from '@/components/loading-fallback';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserActions } from '@/hooks/use-user-actions';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-2xl">
          
          <p className="text-lg text-gray-600 mb-2">
            Upload your resume or LinkedIn PDF and we'll transform it into a beautiful portfolio
          </p>
          <p className="text-sm text-gray-500">
            Supports PDF files up to 10MB
          </p>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-lg mb-8">
          <div className="relative">
            <div className={`
              w-full min-h-[280px] flex flex-col items-center justify-center 
              border-2 border-dashed rounded-2xl relative transition-all duration-300
              ${fileState.status === 'empty' 
                ? 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50' 
                : 'border-green-200 bg-green-50/50'
              }
            `}>
              {fileState.status === 'empty' && !isUpdating && (
                <UploadButton
                  endpoint="resumeUploader"
                  onClientUploadComplete={handleUploadThing}
                  appearance={{
                    button:
                      'w-full h-full min-h-[280px] flex flex-col items-center justify-center bg-transparent border-none shadow-none cursor-pointer hover:bg-gray-50/50 transition-colors',
                    container: 'w-full',
                  }}
                  content={{
                    button({ ready }) {
                      return (
                        <div className="flex flex-col items-center justify-center gap-4 p-8">
                          <div className="p-4 rounded-full bg-blue-100">
                            <Linkedin className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Upload Your PDF
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Drop your resume or LinkedIn PDF here, or click to browse
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                              <FileText className="h-4 w-4" />
                              Choose File
                            </div>
                          </div>
                        </div>
                      );
                    },
                  }}
                />
              )}

              {isUpdating && (
                <div className="flex flex-col items-center justify-center w-full h-full min-h-[280px] p-8">
                  <div className="p-4 rounded-full bg-blue-100 mb-4">
                    <CustomSpinner className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Processing Your File
                  </h3>
                  <p className="text-sm text-gray-500">
                    We're analyzing your resume and extracting information...
                  </p>
                </div>
              )}

              {fileState.status === 'saved' && !isUpdating && (
                <>
                  <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10 transition-colors"
                    disabled={isUpdating}
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                  <div className="flex flex-col items-center justify-center w-full h-full min-h-[280px] gap-4 p-8">
                    <div className="p-4 rounded-full bg-green-100">
                      <FileText className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {fileState.file.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {(fileState.file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ✓ File uploaded successfully
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg px-4 py-2"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-xs mr-2">
                    ?
                  </span>
                  How to export from LinkedIn
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-2xl !p-0 gap-0 rounded-xl overflow-hidden">
                <div className="p-6 pb-4">
                  <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                    Export Your LinkedIn Profile
                  </DialogTitle>
                  <p className="text-gray-600 text-sm">
                    Follow these steps to save your LinkedIn profile as a PDF
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <ol className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-medium flex-shrink-0">1</span>
                        Go to your LinkedIn profile page
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-medium flex-shrink-0">2</span>
                        Click on "..." → "Save to PDF"
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-medium flex-shrink-0">3</span>
                        Upload the downloaded PDF file here
                      </li>
                    </ol>
                  </div>
                  <img
                    src="/user/linkedin-save-to-pdf.png"
                    alt="LinkedIn export steps"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Action Button */}
        <div className="relative mb-16">
          <Button
            size="lg"
            className={`
              px-8 py-4 h-auto text-base font-semibold rounded-xl transition-all duration-200
              ${fileState.status === 'saved' && !isUpdating
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            disabled={fileState.status === 'empty' || isUpdating}
            onClick={() => router.push('/pdf')}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <CustomSpinner className="h-5 w-5" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <WandSparkles className="h-5 w-5" />
                Generate My Portfolio
              </div>
            )}
          </Button>
          
          {fileState.status === 'empty' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute inset-0" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-900 text-white">
                  <p>Upload a PDF file to continue</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}