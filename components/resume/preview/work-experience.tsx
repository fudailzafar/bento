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
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib';
import React from 'react';
import { getShortMonth, getYear } from '@/components/resume';
import { toast } from 'sonner';
import { ImageIcon, LoaderIcon, PenIcon, TrashIcon } from '@/components/icons';
import { BlurFade } from '@/components/magicui';
import { WorkExperienceField } from '@/components/resume/editing';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BLUR_FADE_DELAY = 0.04;

// Sortable Work Item Component
function SortableWorkItem({
  item,
  id,
  isEditMode,
  isHovered,
  isEditing,
  uploadingIndex,
  setHoveredIndex,
  setEditingIndex,
  editingIndex,
  handleUpdate,
  handleDelete,
  handleUploadClick,
  handleFileChange,
  handleDeleteLogo,
  fileInputRefs,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${item.company}-${item.location}-${item.title}-${id}`,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Show edit form if editing
  if (isEditMode && isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        key={id}
        className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900"
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

  return isEditMode ? (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setHoveredIndex(id)}
      onMouseLeave={() => setHoveredIndex(null)}
      className={cn(
        'group relative -mx-2 border-2 border-transparent px-2 transition-all duration-300',
        isEditMode &&
          'hover:rounded-xl hover:border-gray-100 hover:py-1 hover:shadow-sm dark:hover:border-gray-600',
        isDragging && 'z-50'
      )}
    >
      {/* Hidden file input */}
      <input
        ref={(el) => {
          fileInputRefs.current[id] = el;
        }}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(id, e)}
        className="hidden"
      />

      {/* Drag Handle - Only visible in edit mode */}
      {isEditMode && isHovered && (
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-1 left-1/2 z-10 flex size-6 -translate-y-1/2 cursor-grab items-center justify-center rounded bg-gray-100 text-gray-600 opacity-0 shadow-sm transition-all hover:bg-gray-200 active:cursor-grabbing group-hover:opacity-100"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
      )}

      <div className="cursor-pointer">
        <Card className="flex border-0 bg-transparent shadow-none">
          <div className="group/logo relative h-12 w-12 flex-none">
            <Avatar className="bg-muted-background m-auto size-12 border dark:bg-foreground">
              <AvatarImage
                src={item.logo || undefined}
                alt={item.company}
                className="object-contain"
              />
              <AvatarFallback>{item.company[0]}</AvatarFallback>
            </Avatar>

            {/* Upload/Delete buttons for logo - Only in edit mode on hover */}
            {isEditMode && uploadingIndex !== id && isHovered && (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between opacity-0 transition-opacity group-hover/logo:opacity-100">
                {/* Upload Button - Left */}
                <button
                  onClick={() => handleUploadClick(id)}
                  className="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
                  aria-label="Upload company logo"
                >
                  <ImageIcon className="size-3 text-black" />
                </button>

                {/* Delete button - Right */}
                {item.logo && (
                  <button
                    onClick={() => handleDeleteLogo(id)}
                    className="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
                    aria-label="Delete company logo"
                  >
                    <TrashIcon className="size-3 text-black" />
                  </button>
                )}
              </div>
            )}

            {/* Loader during Upload */}
            {uploadingIndex === id && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-black/50">
                <LoaderIcon className="size-5 text-white" />
              </div>
            )}
          </div>

          <div className="group ml-4 flex-grow flex-col items-center">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center justify-center text-xs font-semibold leading-none sm:text-sm">
                  <span className="text-left text-base font-semibold text-[#050914] dark:text-design-white">
                    {item.company}
                  </span>
                </h3>
                <div className="text-right text-xs tabular-nums text-muted-foreground sm:text-sm">
                  {formattedDate}
                </div>
              </div>
              {item.title && (
                <div className="mt-1 text-left font-sans text-xs font-medium capitalize text-design-resume sm:text-sm">
                  {item.title}
                </div>
              )}
            </CardHeader>
            {item.description && (
              <div className="mt-2 text-xs sm:text-sm">{item.description}</div>
            )}
          </div>
        </Card>
      </div>

      {/* Edit/Delete buttons for work experience - positioned on top */}
      {isEditMode && isHovered && (
        <>
          {/* Delete */}
          <button
            onClick={() => handleDelete(id)}
            className="absolute -left-2 -top-4 z-10 flex size-8 items-center justify-center rounded-full border border-gray-50 bg-white text-gray-700 opacity-0 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-design-secondary group-hover:opacity-100 dark:text-gray-300 dark:hover:text-red-400"
            aria-label="Delete work experience"
          >
            <TrashIcon className="size-4 transition-transform duration-200" />
          </button>

          {/* Edit */}
          <button
            onClick={() => setEditingIndex(id)}
            className="absolute -right-2 -top-4 z-10 flex size-8 items-center justify-center rounded-full border border-gray-50 bg-black text-white opacity-0 shadow-md transition-all duration-300 ease-in-out group-hover:opacity-100 dark:text-gray-300"
            aria-label="Edit work experience"
          >
            <PenIcon className="size-4 transition-transform duration-200" />
          </button>
        </>
      )}
    </div>
  ) : (
    <BlurFade
      key={item.company + item.location + item.title}
      delay={BLUR_FADE_DELAY * 6 + id * 0.05}
    >
      <div
        ref={setNodeRef}
        style={style}
        onMouseEnter={() => setHoveredIndex(id)}
        onMouseLeave={() => setHoveredIndex(null)}
        className={cn(
          'group relative -mx-2 border-2 border-transparent px-2 transition-all duration-300',
          isEditMode &&
            'hover:rounded-xl hover:border-gray-100 hover:py-1 hover:shadow-sm dark:hover:border-gray-600',
          isDragging && 'z-50'
        )}
      >
        {/* Hidden file input */}
        <input
          ref={(el) => {
            fileInputRefs.current[id] = el;
          }}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(id, e)}
          className="hidden"
        />

        {/* Drag Handle - Only visible in edit mode */}
        {isEditMode && isHovered && (
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-1 left-1/2 z-10 flex size-6 -translate-y-1/2 cursor-grab items-center justify-center rounded bg-gray-100 text-gray-600 opacity-0 shadow-sm transition-all hover:bg-gray-200 active:cursor-grabbing group-hover:opacity-100"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </button>
        )}

        <div className="cursor-pointer">
          <Card className="flex border-0 bg-transparent shadow-none">
            <div className="group/logo relative h-12 w-12 flex-none">
              <Avatar className="bg-muted-background m-auto size-12 border dark:bg-foreground">
                <AvatarImage
                  src={item.logo || undefined}
                  alt={item.company}
                  className="object-contain"
                />
                <AvatarFallback>{item.company[0]}</AvatarFallback>
              </Avatar>

              {/* Upload/Delete buttons for logo - Only in edit mode on hover */}
              {isEditMode && uploadingIndex !== id && isHovered && (
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between opacity-0 transition-opacity group-hover/logo:opacity-100">
                  {/* Upload Button - Left */}
                  <button
                    onClick={() => handleUploadClick(id)}
                    className="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
                    aria-label="Upload company logo"
                  >
                    <ImageIcon className="size-3 text-black" />
                  </button>

                  {/* Delete button - Right */}
                  {item.logo && (
                    <button
                      onClick={() => handleDeleteLogo(id)}
                      className="flex size-5 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-lg backdrop-blur-sm transition-all hover:bg-white/90"
                      aria-label="Delete company logo"
                    >
                      <TrashIcon className="size-3 text-black" />
                    </button>
                  )}
                </div>
              )}

              {/* Loader during Upload */}
              {uploadingIndex === id && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-black/50">
                  <LoaderIcon className="size-5 text-white" />
                </div>
              )}
            </div>

            <div className="group ml-4 flex-grow flex-col items-center">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="inline-flex items-center justify-center text-xs font-semibold leading-none sm:text-sm">
                    <span className="text-left text-base font-semibold text-[#050914] dark:text-design-white">
                      {item.company}
                    </span>
                  </h3>
                  <div className="text-right text-xs tabular-nums text-muted-foreground sm:text-sm">
                    {formattedDate}
                  </div>
                </div>
                {item.title && (
                  <div className="mt-1 text-left font-sans text-xs font-medium capitalize text-design-resume sm:text-sm">
                    {item.title}
                  </div>
                )}
              </CardHeader>
              {item.description && (
                <div className="mt-2 text-xs sm:text-sm">
                  {item.description}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Edit/Delete buttons for work experience - positioned on top */}
        {isEditMode && isHovered && (
          <>
            {/* Delete */}
            <button
              onClick={() => handleDelete(id)}
              className="absolute -left-2 -top-4 z-10 flex size-8 items-center justify-center rounded-full border border-gray-50 bg-white text-gray-700 opacity-0 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-design-secondary group-hover:opacity-100 dark:text-gray-300 dark:hover:text-red-400"
              aria-label="Delete work experience"
            >
              <TrashIcon className="size-4 transition-transform duration-200" />
            </button>

            {/* Edit */}
            <button
              onClick={() => setEditingIndex(id)}
              className="absolute -right-2 -top-4 z-10 flex size-8 items-center justify-center rounded-full border border-gray-50 bg-black text-white opacity-0 shadow-md transition-all duration-300 ease-in-out group-hover:opacity-100 dark:text-gray-300"
              aria-label="Edit work experience"
            >
              <PenIcon className="size-4 transition-transform duration-200" />
            </button>
          </>
        )}
      </div>
    </BlurFade>
  );
}

export function WorkExperience({
  work,
  isEditMode,
  onChangeWork,
  className,
}: {
  work: ResumeDataSchemaType['workExperience'];
  isEditMode?: boolean;
  onChangeWork?: (newWork: ResumeDataSchemaType['workExperience']) => void;
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onChangeWork) {
      const oldIndex = work.findIndex(
        (item, idx) =>
          `${item.company}-${item.location}-${item.title}-${idx}` === active.id
      );
      const newIndex = work.findIndex(
        (item, idx) =>
          `${item.company}-${item.location}-${item.title}-${idx}` === over.id
      );

      const newWork = arrayMove(work, oldIndex, newIndex);
      onChangeWork(newWork);
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

  const workItems = work.map((item, idx) => ({
    ...item,
    id: `${item.company}-${item.location}-${item.title}-${idx}`,
    index: idx,
  }));

  return (
    <Section className={className}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="flex flex-col gap-4"
            role="feed"
            aria-labelledby="work-experience"
          >
            {workItems.map((item) => {
              const id = item.index;
              const isHovered = hoveredIndex === id;
              const isEditing = editingIndex === id;

              return (
                <SortableWorkItem
                  key={item.id}
                  item={item}
                  id={id}
                  isEditMode={isEditMode}
                  isHovered={isHovered}
                  isEditing={isEditing}
                  uploadingIndex={uploadingIndex}
                  setHoveredIndex={setHoveredIndex}
                  setEditingIndex={setEditingIndex}
                  editingIndex={editingIndex}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleUploadClick={handleUploadClick}
                  handleFileChange={handleFileChange}
                  handleDeleteLogo={handleDeleteLogo}
                  fileInputRefs={fileInputRefs}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </Section>
  );
}

interface WorkExperienceEntryProps {
  work: {
    location: string;
    company: string;
    link?: string;
    contract?: string;
    title: string;
    start: string;
    end?: string | null;
    description: string;
    logo?: string | null;
  };
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WorkExperienceEntry({
  work,
  isEditMode = false,
  onEdit,
  onDelete,
  onSave,
}: WorkExperienceEntryProps & { onSave?: (updatedWork: any) => void }) {
  const {
    location,
    company,
    link,
    contract,
    title,
    start,
    end,
    description,
    logo,
  } = work;
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    location: location || '',
    company: company || '',
    link: link || '',
    contract: contract || '',
    title: title || '',
    start: start || '',
    end: end || '',
    description: description || '',
    logo: logo || '',
  });

  if (!company && !title && !isEditing) {
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
      location: location || '',
      company: company || '',
      link: link || '',
      contract: contract || '',
      title: title || '',
      start: start || '',
      end: end || '',
      description: description || '',
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
              alt={editData.company}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {editData.company?.charAt(0)?.toUpperCase() || 'W'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Company
                </label>
                <input
                  type="text"
                  value={editData.company}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Title
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Location
                </label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Location"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Contract
                </label>
                <input
                  type="text"
                  value={editData.contract}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      contract: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Contract type"
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

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Description
              </label>
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Job description"
                rows={3}
              />
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
          className={`absolute -left-7 -top-8 z-50 flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-black opacity-0 shadow-md active:scale-95 active:bg-gray-100 transition-all duration-300 ease-in-out hover:bg-gray-50 md:-left-6 md:-top-5 md:group-hover:opacity-100 ${
            isMobileActive ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Delete work experience entry"
        >
          <TrashIcon className="size-4 md:size-4" />
        </button>
      )}

      <article
        className={cn(
          'flex items-start gap-4 rounded-2xl bg-white p-1 transition-all duration-200 dark:bg-gray-900',
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
          <AvatarImage src={logo || undefined} alt={company} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {company?.charAt(0)?.toUpperCase() || 'W'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg text-foreground">{company}</h3>
              <div className="flex flex-row items-center justify-center gap-4">
                <h3 className="font-medium text-sm text-foreground">{title}</h3>
              </div>
            </div>
            <div className='space-y-3'>
              {period && (
                <p className="text-xs text-muted-foreground">{period}</p>
              )}
              <h5 className="text-xs text-muted-foreground">{location}</h5>
            </div>
          </div>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </article>
    </div>
  );
}
