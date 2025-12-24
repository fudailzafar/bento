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
import { cn } from '@/lib';
import { toast } from 'sonner';
import { ImageIcon, LoaderIcon, PenIcon, TrashIcon } from '@/components/icons';
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
        'group relative -mx-2 border-2 border-transparent px-2 transition-all duration-300',
        isEditMode &&
          'hover:rounded-xl hover:border-gray-100 hover:py-1 hover:shadow-sm dark:hover:border-gray-600'
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
        <div className="group/logo relative flex-none">
          <Avatar className="bg-muted-background m-auto size-12 border dark:bg-foreground">
            <AvatarImage
              src={logo || undefined}
              alt={school}
              className="object-contain"
            />
            <AvatarFallback>{school[0]}</AvatarFallback>
          </Avatar>

          {/* Upload/Delete buttons for logo - Only in edit mode on hover */}
          {isEditMode && !isUploading && isHovered && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover/logo:opacity-100">
              <div className="flex gap-1">
                {/* Upload Button */}
                <button
                  onClick={onLogoUpload}
                  className="flex size-6 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
                  aria-label="Upload school logo"
                >
                  <ImageIcon className="size-3 text-black" />
                </button>

                {/* Delete button */}
                {logo && (
                  <button
                    onClick={onLogoDelete}
                    className="flex size-6 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
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
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <LoaderIcon className="size-6 text-white" />
            </div>
          )}
        </div>

        <div className="ml-4 flex-grow flex-col items-center">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3
                className="text-left text-base font-semibold leading-none text-[#050914] dark:text-design-white"
                id={`education-${school.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {school}
              </h3>
              <div
                className="text-right text-xs tabular-nums text-muted-foreground sm:text-sm"
                aria-label={`Period: ${period}`}
              >
                {period}
              </div>
            </div>
            {degree && (
              <div
                className="mt-1 font-sans text-xs text-design-resume sm:text-sm"
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
            className="absolute -left-2 -top-4 z-10 flex size-8 items-center justify-center rounded-full border border-gray-50 bg-white text-black opacity-0 shadow-2xl transition-all duration-300 ease-in-out hover:bg-gray-50 group-hover:opacity-100 dark:text-gray-300"
            aria-label="Delete education"
          >
            <TrashIcon className="size-4 transition-transform duration-200" />
          </button>

          {/* Edit */}
          <button
            onClick={onEdit}
            className="absolute -right-2 -top-4 z-10 flex size-8 items-center justify-center rounded-full border border-gray-50 bg-black text-white opacity-0 shadow-md transition-all duration-300 ease-in-out group-hover:opacity-100 dark:text-gray-300"
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
  educations = [],
  isEditMode,
  onChangeEducation,
  className,
}: {
  educations: ResumeDataSchemaType['education'];
  isEditMode?: boolean;
  onChangeEducation?: (newEducation: ResumeDataSchemaType['education']) => void;
  className?: string;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Filter out invalid education entries (only require school)
  const validEducations = useMemo(
    () => educations.filter((edu) => edu.school),
    [educations]
  );

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
    updatedEdu: ResumeDataSchemaType['education'][number]
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
    <Section className={className}>
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
                className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
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
            isEditMode ? (
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
            ) : (
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
            )
          );
        })}
      </div>
    </Section>
  );
}

interface EducationEntryProps {
  education: {
    school: string;
    degree: string;
    start: string;
    end: string;
    logo?: string | null;
  };
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EducationEntry({
  education,
  isEditMode = false,
  onEdit,
  onDelete,
  onSave,
}: EducationEntryProps & {
  onSave?: (
    updatedEducation: ResumeDataSchemaType['education'][number]
  ) => void;
}) {
  const { school, start, end, degree, logo } = education;
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    school: school || '',
    degree: degree || '',
    start: start || '',
    end: end || '',
    logo: logo || '',
  });

  if (!school && !degree && !isEditing) {
    return null;
  }

  const period = [start, end].filter(Boolean).join(' - ');

  const handleSave = () => {
    if (onSave) {
      onSave(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      school: school || '',
      degree: degree || '',
      start: start || '',
      end: end || '',
      logo: logo || '',
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className="group relative w-full py-1">
        <article className="flex items-start gap-4 p-2 dark:bg-gray-900">
          <Avatar className="mt-1 h-12 w-12">
            <AvatarImage
              src={editData.logo || undefined}
              alt={editData.school}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {editData.school?.charAt(0)?.toUpperCase() || 'E'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  School
                </label>
                <input
                  type="text"
                  value={editData.school}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, school: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="School name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Degree
                </label>
                <input
                  type="text"
                  value={editData.degree}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, degree: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Degree"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Start Date
                </label>
                <input
                  type="text"
                  value={editData.start}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Start date"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  End Date
                </label>
                <input
                  type="text"
                  value={editData.end}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="End date"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="group relative w-full py-1">
      {/* Delete button - positioned on top-left */}
      {isEditMode && onDelete && (
        <button
          onClick={onDelete}
          className={`absolute -left-7 -top-8 z-50 flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-black opacity-0 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 active:scale-95 active:bg-gray-100 md:-left-6 md:-top-5 md:group-hover:opacity-100 ${
            isMobileActive ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Delete education entry"
        >
          <TrashIcon className="size-4 md:size-4" />
        </button>
      )}

      <article
        className={cn(
          'flex items-start gap-4 bg-white p-2 transition-all duration-200 dark:bg-gray-900',
          isEditMode && 'cursor-pointer hover:border-gray-200',
          !isEditMode && 'cursor-default'
        )}
        onClick={() => {
          if (isEditMode && !isMobileActive) {
            if (window.innerWidth < 768) {
              setIsMobileActive(!isMobileActive);
            } else {
              handleEdit();
            }
          }
        }}
      >
        <Avatar className="mt-1 h-12 w-12">
          <AvatarImage src={logo || undefined} alt={school} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {school?.charAt(0)?.toUpperCase() || 'E'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{school}</h3>
              <p className="text-sm">{degree}</p>
            </div>
            {period && <p className="text-xs">{period}</p>}
          </div>
        </div>
      </article>
    </div>
  );
}
