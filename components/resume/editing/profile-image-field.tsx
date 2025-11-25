'use client';

import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { CircleArrowUpIcon, LoaderIcon, TrashIcon } from '@/components/icons';

interface ProfileImageFieldProps {
  name: string;
  currentImage?: string;
  onImageChange?: (newImageUrl: string | null) => void;
  isPublicView?: boolean;
  showCopyButton?: boolean;
  onCopyLink?: () => void;
  isSaving?: boolean;
}

export function ProfileImageField({
  name,
  currentImage,
  onImageChange,
  isPublicView = false,
  showCopyButton = false,
  onCopyLink,
  isSaving = false,
}: ProfileImageFieldProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile-image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      onImageChange?.(data.imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;

    setIsUploading(true);

    try {
      const response = await fetch('/api/profile-image/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }
      onImageChange?.(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete image'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className='flex justify-end'>
        {showCopyButton && onCopyLink && (
          <Button
            onClick={onCopyLink}
            disabled={isSaving}
            className="flex h-[40px] w-[130px] items-center justify-center gap-2 rounded-lg bg-design-success font-semibold text-white shadow-[0px_2px_3px_rgba(0,0,0,0.06)] transition-all hover:bg-[#3dda69] active:scale-95 md:hidden"
          >
            {isSaving ? (
              <>
                <LoaderIcon className="size-4" />
                <span>Saving...</span>
              </>
            ) : (
              'Copy Link'
            )}
          </Button>
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-3 sm:inline-block">
        {/* Copy Link Button - Mobile Only - TOP RIGHT */}

        {/* Profile Image */}
        <div
          className="group relative inline-block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Hidden File Input for Profile Picture */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/heic,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          {currentImage ? (
            // Avatar with image
            <>
              <Avatar className="size-32 border md:size-48">
                <AvatarImage
                  src={currentImage}
                  alt={`${name}'s profile picture`}
                />
                <AvatarFallback>
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              {/* Action Buttons - Always visible on mobile, hover on desktop */}
              {!isUploading && !isPublicView && (
                <div className="absolute bottom-0 right-0 flex items-center justify-between px-3 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 md:bottom-2 md:left-0">
                  {/* Upload - Desktop only */}
                  <button
                    onClick={handleUploadClick}
                    className="hidden size-9 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90 sm:flex"
                  >
                    <CircleArrowUpIcon className="size-4 text-black" />
                  </button>

                  {/* Delete - Always visible on mobile, hover on desktop */}
                  <button
                    onClick={handleDelete}
                    className="flex size-9 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
                  >
                    <TrashIcon className="size-4 text-black md:size-4" />
                  </button>
                </div>
              )}
            </>
          ) : isPublicView ? (
            // Public view - Show placeholder
            <Avatar className="hidden size-32 border">
              <AvatarImage
                src="/user/placeholder.svg"
                alt={`${name}'s profile picture`}
              />
              <AvatarFallback>
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          ) : (
            // Empty state - Upload Icon (Edit mode only)
            <button
              onClick={handleUploadClick}
              className="flex size-28 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-black/[0.08] bg-[#FAFAFA] transition-colors duration-200 ease-in-out hover:bg-[#F6F6F6] active:bg-[#F1F1F1] md:size-48"
            >
              <CircleArrowUpIcon className="mb-2 size-8 text-black/10" />
              <span className="text-xs font-medium text-black/60 md:text-sm md:font-semibold">
                Add Avatar
              </span>
            </button>
          )}

          {/* Loader during Upload */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <LoaderIcon className="text-white" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
