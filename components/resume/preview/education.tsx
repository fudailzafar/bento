'use client';

import {
  Card,
  CardHeader,
  Section,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui';
import { ResumeDataSchemaType } from '@/lib';
import { getYear } from '@/components/resume';
import { useMemo, useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib';
import { toast } from 'sonner';
import {
  ImageIcon,
  LoaderIcon,
  PenIcon,
  TrashIcon,
} from '@/components/icons';
import { BlurFade } from '@/components/magicui';
import { EducationField } from '@/components/resume/editing';

const BLUR_FADE_DELAY = 0.04;

function EducationItem({
  education,
  isEditMode,
  onEdit,
  onDelete,
  onLogoUpload,
  onLogoDelete,
  isUploading,
  fileInputRef,
}: {
  education: ResumeDataSchemaType['education'][0];
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onLogoUpload?: () => void;
  onLogoDelete?: () => void;
  isUploading?: boolean;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  const { school, start, end, degree, logo } = education;
  const [isHovered, setIsHovered] = useState(false);

  // Allow rendering even if start or degree is missing
  if (!school) {
    return null;
  }

  // Prepare period string
  let period = '—';
  if (start && end) {
    period = `${getYear(start)} - ${getYear(end)}`;
  } else if (start) {
    period = `${getYear(start)} - Present`;
  } else if (end) {
    period = `Until ${getYear(end)}`;
  }

  return (
    <Card
      className={cn(
        'group relative -mx-4 px-4 border-2 border-transparent transition-all duration-300',
        isEditMode &&
          'hover:border-gray-100 hover:shadow-md hover:py-3 dark:hover:border-gray-600'
      )}
      onMouseEnter={() => isEditMode && setIsHovered(true)}
      onMouseLeave={() => isEditMode && setIsHovered(false)}
    >
      {/* Hidden file input */}
      {fileInputRef && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
        />
      )}

      <div className="flex">
        <div className="flex-none relative group/logo">
          <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={logo || undefined}
              alt={school}
              className="object-contain"
            />
            <AvatarFallback>{school[0]}</AvatarFallback>
          </Avatar>

          {/* Upload/Delete buttons for logo - Only in edit mode on hover */}
          {isEditMode && !isUploading && isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity">
              <div className="flex gap-1">
                {/* Upload Button */}
                <button
                  onClick={onLogoUpload}
                  className="size-6 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-white/90 transition-all flex items-center justify-center"
                  aria-label="Upload school logo"
                >
                  <ImageIcon className="size-3 text-black" />
                </button>

                {/* Delete button */}
                {logo && (
                  <button
                    onClick={onLogoDelete}
                    className="size-6 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-white/90 transition-all flex items-center justify-center"
                    aria-label="Delete school logo"
                  >
                    <TrashIcon className="size-3 text-black" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loader during Upload */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <LoaderIcon className="text-white size-6" />
            </div>
          )}
        </div>

        <div className="flex-grow ml-4 items-center flex-col">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3
                className="font-semibold leading-none text-base text-left text-[#050914] dark:text-design-white"
                id={`education-${school.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {school}
              </h3>
              <div
                className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right"
                aria-label={`Period: ${period}`}
              >
                {period}
              </div>
            </div>
            {degree && (
              <div
                className="mt-1 font-sans text-xs sm:text-sm text-design-resume"
                aria-labelledby={`education-${school
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
              >
                {degree}
              </div>
            )}
          </CardHeader>
        </div>
      </div>

      {/* Edit/Delete buttons for education */}
      {isEditMode && isHovered && onEdit && onDelete && (
        <>
          {/* Delete */}
          <button
            onClick={onDelete}
            className="absolute -top-4 -left-2 size-8 rounded-full hover:bg-gray-50 border border-gray-50 shadow-md hover:text-design-secondary bg-white text-gray-700 dark:text-gray-300 dark:hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-10"
            aria-label="Delete education"
          >
            <TrashIcon className="size-4 transition-transform duration-200" />
          </button>

          {/* Edit */}
          <button
            onClick={onEdit}
            className="absolute -top-4 -right-2 size-8 rounded-full bg-black border border-gray-50 shadow-md text-white dark:text-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-10"
            aria-label="Edit education"
          >
            <PenIcon className="size-4 transition-transform duration-200" />
          </button>
        </>
      )}
    </Card>
  );
}

export function Education({
  educations,
  isEditMode,
  onChangeEducation,
}: {
  educations: ResumeDataSchemaType['education'];
  isEditMode?: boolean;
  onChangeEducation?: (newEducation: ResumeDataSchemaType['education']) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Filter out invalid education entries (only require school)
  const validEducations = useMemo(
    () => educations.filter((edu) => edu.school),
    [educations]
  );

  const handleAdd = () => {
    if (onChangeEducation) {
      onChangeEducation([
        ...educations,
        { degree: '', school: '', start: '', end: '' },
      ]);
      setEditingIndex(educations.length);
    }
  };

  const handleDelete = (index: number) => {
    if (onChangeEducation) {
      const newEducation = [...educations];
      newEducation.splice(index, 1);
      onChangeEducation(newEducation);
      setEditingIndex(null);
    }
  };

  const handleUpdate = (
    index: number,
    updatedEdu: ResumeDataSchemaType['education'][0]
  ) => {
    if (onChangeEducation) {
      const newEducation = [...educations];
      newEducation[index] = updatedEdu;
      onChangeEducation(newEducation);
    }
  };

  const handleUploadClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/education-logo/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      handleUpdate(index, {
        ...educations[index],
        logo: data.imageUrl,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    } finally {
      setUploadingIndex(null);
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = '';
      }
    }
  };

  const handleDeleteLogo = async (index: number) => {
    const logo = educations[index].logo;
    if (!logo) return;

    setUploadingIndex(index);

    try {
      const response = await fetch(
        `/api/education-logo/delete?imageUrl=${encodeURIComponent(logo)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      toast.success('School logo removed');
      handleUpdate(index, {
        ...educations[index],
        logo: null,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete image'
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  if (validEducations.length === 0 && !isEditMode) {
    return null;
  }

  return (
    // Education Section
    <Section>
      <BlurFade delay={BLUR_FADE_DELAY * 7}>
        <h2 className="text-xl font-bold mb-2" id="education-section">
          Education
        </h2>
      </BlurFade>
      <div
        className="space-y-4"
        role="feed"
        aria-labelledby="education-section"
      >
        {educations.map((item, idx) => {
          const isEditing = editingIndex === idx;

          // Show edit form if editing
          if (isEditMode && isEditing) {
            return (
              <div
                key={idx}
                className="rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
              >
                <EducationField
                  edu={item}
                  index={idx}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={() => setEditingIndex(null)}
                    variant="outline"
                    size="sm"
                  >
                    Save
                  </Button>
                </div>
              </div>
            );
          }

          // Skip invalid entries in view mode
          if (!item.school) {
            if (!isEditMode) return null;
          }

          return (
            // Education Card with Animation
            <BlurFade
              key={item.school + idx}
              delay={BLUR_FADE_DELAY * 8 + idx * 0.05}
            >
              <article key={idx} role="article">
                {/* Hidden file input */}
                <input
                  ref={(el) => {
                    fileInputRefs.current[idx] = el;
                  }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(idx, e)}
                  className="hidden"
                />
                <EducationItem
                  education={item}
                  isEditMode={isEditMode}
                  onEdit={() => setEditingIndex(idx)}
                  onDelete={() => handleDelete(idx)}
                  onLogoUpload={() => handleUploadClick(idx)}
                  onLogoDelete={() => handleDeleteLogo(idx)}
                  isUploading={uploadingIndex === idx}
                  fileInputRef={{ current: fileInputRefs.current[idx] }}
                />
              </article>
            </BlurFade>
          );
        })}
      </div>

      {/* Add Education */}
      {isEditMode && onChangeEducation && (
        <BlurFade delay={BLUR_FADE_DELAY * 8 + educations.length * 0.05}>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAdd}
              className="w-full py-5 flex items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg transition-all duration-300 hover:shadow-lg bg-transparent hover:bg-muted/5 group"
            >
              <Plus className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Add Education
              </span>
            </button>
          </div>
        </BlurFade>
      )}
    </Section>
  );
}
