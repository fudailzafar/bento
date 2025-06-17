'use client';

import {
  Section,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardHeader,
} from '@/components/ui';
import { ResumeDataSchemaType } from '@/lib';
import { useMemo, useState, useRef } from 'react';
import { ChevronRightIcon, Plus } from 'lucide-react';
import { cn } from '@/lib';
import React from 'react';
import { motion } from 'framer-motion';
import { getShortMonth, getYear } from '@/components/resume';
import { toast } from 'sonner';
import {
  CircleArrowUpIcon,
  LoaderIcon,
  PenIcon,
  TrashIcon,
} from '@/components/icons';
import { BlurFade } from '@/components/magicui';
import { WorkExperienceField } from '@/components/resume/editing';

const BLUR_FADE_DELAY = 0.04;

export function WorkExperience({
  work,
  isEditMode,
  onChangeWork,
}: {
  work: ResumeDataSchemaType['workExperience'];
  isEditMode?: boolean;
  onChangeWork?: (newWork: ResumeDataSchemaType['workExperience']) => void;
}) {
  const [expandedIndexes, setExpandedIndexes] = React.useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Filter out invalid work experiences and pre-format dates
  const validWork = useMemo(() => {
    return work
      .filter((item) => item.company && item.title && item.description)
      .map((item) => {
        const hasStart = !!item.start;
        const hasEnd = !!item.end;
        let formattedDate = '—';
        if (hasStart && hasEnd) {
          formattedDate = `${getShortMonth(item.start ?? '')} ${getYear(
            item.start ?? ''
          )} - ${getShortMonth(item.end ?? '')} ${getYear(item.end ?? '')}`;
        } else if (hasStart) {
          formattedDate = `${getShortMonth(item.start)} ${getYear(
            item.start
          )} - Present`;
        } else if (hasEnd) {
          formattedDate = `Until ${getShortMonth(item.end ?? '')} ${getYear(
            item.end ?? ''
          )}`;
        }
        return {
          ...item,
          formattedDate,
          companyLower: item.company.toLowerCase(),
        };
      });
  }, [work]);

  const handleAdd = () => {
    if (onChangeWork) {
      onChangeWork([
        ...work,
        {
          title: '',
          company: '',
          description: '',
          location: '',
          link: '',
          contract: '',
          start: '',
        },
      ]);
      setEditingIndex(work.length);
    }
  };

  const handleDelete = (index: number) => {
    if (onChangeWork) {
      const newWork = [...work];
      newWork.splice(index, 1);
      onChangeWork(newWork);
      setEditingIndex(null);
    }
  };

  const handleUpdate = (
    index: number,
    updatedWork: {
      location: string;
      company: string;
      link: string;
      contract: string;
      title: string;
      start: string;
      end: string | null | undefined;
      description: string;
      logo?: string | null;
    }
  ) => {
    if (onChangeWork) {
      const newWork = [...work];
      newWork[index] = {
        ...updatedWork,
        end: updatedWork.end ?? null,
        logo: updatedWork.logo ?? null,
      };
      onChangeWork(newWork);
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

      const response = await fetch('/api/company-logo/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      toast.success('Image updated successfully!');

      handleUpdate(index, {
        ...work[index],
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
    const logo = work[index].logo;
    if (!logo) return;

    setUploadingIndex(index);

    try {
      const response = await fetch(
        `/api/company-logo/delete?imageUrl=${encodeURIComponent(logo)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      toast.success('Company logo removed');
      handleUpdate(index, {
        ...work[index],
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

  if (validWork.length === 0 && !isEditMode) {
    return null;
  }

  return (
    <Section>
      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <h2 className="text-xl font-bold mb-2" id="work-experience">
          Work Experience
        </h2>
      </BlurFade>
      <div
        className="flex flex-col gap-4"
        role="feed"
        aria-labelledby="work-experience"
      >
        {work.map((item, id) => {
          const isExpanded = expandedIndexes.includes(id);
          const isHovered = hoveredIndex === id;
          const isEditing = editingIndex === id;

          // Show edit form if editing
          if (isEditMode && isEditing) {
            return (
              <div
                key={id}
                className="rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
              >
                <WorkExperienceField
                  work={item}
                  index={id}
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
          if (!item.company || !item.title || !item.description) {
            if (!isEditMode) return null;
          }

          const hasStart = !!item.start;
          const hasEnd = !!item.end;
          let formattedDate = '—';
          if (hasStart && hasEnd) {
            formattedDate = `${getShortMonth(item.start ?? '')} ${getYear(
              item.start ?? ''
            )} - ${getShortMonth(item.end ?? '')} ${getYear(item.end ?? '')}`;
          } else if (hasStart) {
            formattedDate = `${getShortMonth(item.start)} ${getYear(
              item.start
            )} - Present`;
          } else if (hasEnd) {
            formattedDate = `Until ${getShortMonth(item.end ?? '')} ${getYear(
              item.end ?? ''
            )}`;
          }

          return (
            <BlurFade
              key={item.company + item.location + item.title}
              delay={BLUR_FADE_DELAY * 6 + id * 0.05}
            >
              <div
                onMouseEnter={() => setHoveredIndex(id)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  'group relative -mx-4 px-4 border-2 border-transparent transition-all duration-300',
                  isEditMode &&
                    'hover:border-gray-100 hover:shadow-md hover:rounded-xl hover:py-3 dark:hover:border-gray-600'
                )}
              >
                {/* Hidden file input */}
                <input
                  ref={(el) => (fileInputRefs.current[id] = el)}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(id, e)}
                  className="hidden"
                />

                <Card className="flex border-0 shadow-none bg-transparent">
                  <div className="flex-none relative group/logo w-12 h-12">
                    <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
                      <AvatarImage
                        src={item.logo || undefined}
                        alt={item.company}
                        className="object-contain"
                      />
                      <AvatarFallback>{item.company[0]}</AvatarFallback>
                    </Avatar>

                    {/* Upload/Delete buttons for logo - Only in edit mode on hover */}
                    {isEditMode &&
                      uploadingIndex !== id &&
                      hoveredIndex === id && (
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between opacity-0 group-hover/logo:opacity-100 transition-opacity">
                          {/* Upload Button - Left */}
                          <button
                            onClick={() => handleUploadClick(id)}
                            className="size-5 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-white/90 transition-all flex items-center justify-center"
                            aria-label="Upload company logo"
                          >
                            <CircleArrowUpIcon className="size-3 text-black" />
                          </button>

                          {/* Delete button - Right */}
                          {item.logo && (
                            <button
                              onClick={() => handleDeleteLogo(id)}
                              className="size-5 rounded-full bg-white backdrop-blur-sm border border-neutral-300 shadow-lg hover:bg-white/90 transition-all flex items-center justify-center"
                              aria-label="Delete company logo"
                            >
                              <TrashIcon className="size-3 text-black" />
                            </button>
                          )}
                        </div>
                      )}

                    {/* Loader during Upload */}
                    {uploadingIndex === id && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center overflow-hidden">
                        <LoaderIcon className="text-white size-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow ml-4 items-center flex-col group">
                    <CardHeader className="p-0">
                      <div className="flex items-center justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
                          <span className="text-base font-semibold text-left text-[#050914] dark:text-design-white">
                            {item.company}
                          </span>
                          {isHovered && (
                            <motion.button
                              key="chevron"
                              type="button"
                              aria-label={
                                isExpanded
                                  ? 'Collapse details'
                                  : 'Expand details'
                              }
                              onClick={() => {
                                setExpandedIndexes((prev) =>
                                  prev.includes(id)
                                    ? prev.filter((idx) => idx !== id)
                                    : [...prev, id]
                                );
                              }}
                              className="ml-1 focus:outline-none"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{
                                opacity: 0,
                                x: -8,
                                transition: { duration: 0.5 },
                              }}
                              transition={{
                                duration: 0.5,
                              }}
                            >
                              <ChevronRightIcon
                                className={cn(
                                  'size-4 text-design-black dark:text-design-white transition-transform duration-500 ease-out',
                                  isExpanded ? 'rotate-90' : 'rotate-0'
                                )}
                              />
                            </motion.button>
                          )}
                        </h3>
                        <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                          {formattedDate}
                        </div>
                      </div>
                      {item.title && (
                        <div className="font-sans text-xs sm:text-sm font-medium text-left text-design-resume capitalize mt-1">
                          {item.title}
                        </div>
                      )}
                    </CardHeader>
                    {item.description && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: isExpanded ? 1 : 0,
                          height: isExpanded ? 'auto' : 0,
                        }}
                        transition={{
                          duration: 0.7,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="mt-2 text-xs sm:text-sm"
                      >
                        {item.description}
                      </motion.div>
                    )}
                  </div>
                </Card>

                {/* Edit/Delete buttons for work experience - positioned on top */}
                {isEditMode && isHovered && (
                  <>
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(id)}
                      className="absolute -top-4 -left-2 size-8 rounded-full bg-white border border-gray-50 shadow-md text-black dark:text-gray-300  dark:hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-10"
                      aria-label="Delete work experience"
                    >
                      <TrashIcon className="size-4 transition-transform duration-200" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => setEditingIndex(id)}
                      className="absolute -top-4 -right-2 size-8 rounded-full bg-black border border-gray-50 shadow-md text-white dark:text-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-10"
                      aria-label="Edit work experience"
                    >
                      <PenIcon className="size-4 transition-transform duration-200" />
                    </button>
                  </>
                )}
              </div>
            </BlurFade>
          );
        })}
      </div>

      {/* Add Work Experience */}
      {isEditMode && onChangeWork && (
        <BlurFade delay={BLUR_FADE_DELAY * 6 + work.length * 0.05}>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAdd}
              className="w-full py-5 flex items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg transition-all duration-300 hover:shadow-lg bg-transparent hover:bg-muted/5 group"
            >
              <Plus className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Add Work Experience
              </span>
            </button>
          </div>
        </BlurFade>
      )}
    </Section>
  );
}
