'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { CircleArrowUpIcon, LoaderIcon, TrashIcon } from '@/components/icons';

interface EditableProfileImageProps {
  name: string;
  currentImage?: string;
  onImageChange?: (newImageUrl: string | null) => void;
  isPublicView?: boolean;
}

export function EditableProfileImage({
  name,
  currentImage,
  onImageChange,
  isPublicView = false,
}: EditableProfileImageProps) {
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
    <div
      className="relative inline-block group"
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
          <Avatar className="size-28 border">
            <AvatarImage src={currentImage} alt={`${name}'s profile picture`} />
            <AvatarFallback>
              {name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          {/* Action Buttons - Always visible on mobile, hover on desktop */}
          {!isUploading && !isPublicView && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {/* Upload - Desktop only */}
              <button
                onClick={handleUploadClick}
                className="hidden sm:flex size-8 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-white/90 transition-all items-center justify-center"
              >
                <CircleArrowUpIcon className="size-4 text-black" />
              </button>

              {/* Delete - Always visible on mobile, hover on desktop */}
              <button
                onClick={handleDelete}
                className="size-8 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-white/90 transition-all flex items-center justify-center"
              >
                <TrashIcon className="size-4 text-black" />
              </button>
            </div>
          )}
        </>
      ) : isPublicView ? (
        // Public view - Show placeholder
        <Avatar className="size-28 border">
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
          className="size-28 rounded-full border-2 border-dashed border-black/[0.08] bg-[#FAFAFA] hover:bg-[#F6F6F6] active:bg-[#F1F1F1] transition-colors duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer"
        >
          <CircleArrowUpIcon className="size-8 mb-2 text-black/10" />
          <span className="text-xs text-black/60 font-medium">Add Avatar</span>
        </button>
      )}

      {/* Loader during Upload */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <LoaderIcon className="text-white" />
        </div>
      )}
    </div>
  );
}
