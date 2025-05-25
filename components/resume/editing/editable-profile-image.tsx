'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useRef } from 'react';
import { Trash, CircleArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { Loader } from '@/components/icons/loader';

interface EditableProfileImageProps {
  name: string;
  currentImage?: string;
  onImageChange?: (newImageUrl: string | null) => void;
}

export function EditableProfileImage({
  name,
  currentImage,
  onImageChange,
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
      toast.success('Profile image updated successfully!');
      onImageChange?.(data.imageUrl);

      // Refresh the page to show the new image (this will refetch all queries)
      window.location.reload();
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

      const data = await response.json();
      toast.success('Profile image reset to default');
      onImageChange?.(data.defaultImage || null);

      // Refresh the page to show the default image
      window.location.reload();
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
      <Avatar className="size-28 border">
        <AvatarImage src={currentImage} alt={`${name}'s profile picture`} />
        <AvatarFallback>
          {name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action buttons - Always visible on mobile, hover on desktop */}
      {!isUploading && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-2 pb-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {/* Upload button - bottom left */}
          <button
            onClick={handleUploadClick}
            className="size-8 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-white/90 transition-all flex items-center justify-center"
          >
            <CircleArrowUp className="size-4 text-gray-700" />
          </button>

          {/* Delete button - bottom right */}
          <button
            onClick={handleDelete}
            className="size-8 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-red-50 transition-all flex items-center justify-center"
          >
            <Trash className="size-4 text-gray-700 hover:text-red-600" />
          </button>
        </div>
      )}

      {/* Loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <Loader className="text-white" />
        </div>
      )}
    </div>
  );
}
