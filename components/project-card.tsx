'use client';

import {
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { GitHubLogoIcon, GlobeIcon } from '@radix-ui/react-icons';
import { ImageIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { LoaderIcon } from './icons';

interface Props {
  title: string;
  liveLink?: string;
  githubLink?: string;
  tags?: readonly string[];
  description: string;
  dates?: string;
  link?: string;
  image?: string;
  video?: string;
  className?: string;
  isEditMode?: boolean;
  onImageChange?: (newImageUrl: string | null) => void;
}

export function ProjectCard({
  title,
  liveLink,
  githubLink,
  description,
  dates,
  tags,
  link,
  image,
  video,
  className,
  isEditMode,
  onImageChange,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to ensure links have https://
  const ensureHttps = (url?: string) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  };

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

      const response = await fetch('/api/project-image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      toast.success('Image updated successfully!');
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
    if (!image) return;

    setIsUploading(true);

    try {
      const response = await fetch(
        `/api/project-image/delete?imageUrl=${encodeURIComponent(image)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      toast.success('Project image removed');
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
    <Card
      className={
        'flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-[370px]'
      }
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="relative group/image"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <a
          href={ensureHttps(liveLink)}
          className={cn('block cursor-pointer', className)}
        >
          {video && (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
            />
          )}
          {image && !video && (
            <Image
              src={image}
              alt={title}
              width={500}
              height={300}
              className="h-40 w-full overflow-hidden object-cover object-top"
            />
          )}
          {!image && !video && (
            <div className="h-40 w-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
        </a>

        {/* Upload/Delete buttons - Only in edit mode on hover */}
        {isEditMode && !isUploading && isHovered && (
          <div className="absolute bottom-2 left-2 flex gap-2 items-center opacity-0 group-hover/image:opacity-100 transition-opacity">
            <div className="flex gap-1 items-center bg-black/80 backdrop-blur-sm rounded-xl p-1">
              {/* Upload Button */}
              <button
                onClick={handleUploadClick}
                className="size-6 rounded-lg bg-transparent hover:bg-white/10 transition-all flex items-center justify-center"
                aria-label="Upload project image"
              >
                <ImageIcon className="size-4 text-white" />
              </button>
              {image && (
                <>
                  <div className="h-4 w-[1px] bg-white/30" />
                  {/* Delete button */}
                  <button
                    onClick={handleDelete}
                    className="size-6 rounded-lg bg-transparent hover:bg-white/10 transition-all flex items-center justify-center"
                    aria-label="Delete project image"
                  >
                    <Trash className="size-4 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Loader during Upload */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <LoaderIcon className="text-white" />
          </div>
        )}
      </div>
      <CardHeader className="flex-1 px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base">{title}</CardTitle>
          {dates && <time className="font-sans text-xs">{dates}</time>}
          <div className="hidden font-sans text-xs underline print:visible">
            {link?.replace('https://', '').replace('www.', '').replace('/', '')}
          </div>
          <div
            className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert overflow-y-auto scrollbar-hide"
            style={{
              maxHeight: '6rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
            <Markdown>{description}</Markdown>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                className="px-1 py-0 text-[10px] bg-[#F7F7F7] hover:bg-[#f7f7f7] text-black dark:text-white dark:bg-[#202020]"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {(liveLink || githubLink) && (
        <CardFooter className="px-2 py-2">
          <div className="flex flex-row flex-wrap items-start gap-1">
            <div className="hidden font-sans text-xs underline print:visible">
              {githubLink
                ?.replace('https://', '')
                .replace('www.', '')
                .replace('/', '')}
              {liveLink
                ?.replace('https://', '')
                .replace('www.', '')
                .replace('/', '')}
            </div>
            {liveLink && (
              <a
                href={ensureHttps(liveLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                  <GlobeIcon className="size-3" /> Website
                </Badge>
              </a>
            )}
            {githubLink && (
              <a
                href={ensureHttps(githubLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                  <GitHubLogoIcon className="size-3" /> Source
                </Badge>
              </a>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
