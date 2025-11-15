'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import { MoveAbleIcon } from '@/components/icons/move-able-icon';

interface DraggableSectionProps {
  id: string;
  children: ReactNode;
  isEditMode?: boolean;
  className?: string;
}

export function DraggableSection({
  id,
  children,
  isEditMode = false,
  className = '',
}: DraggableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !isEditMode,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative mb-6 ${className}`}
    >
      {/* Drag Handle - Only visible in edit mode */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -bottom-4 left-1/2 z-10 -translate-x-1/2 cursor-grab opacity-0 transition-opacity duration-200 active:cursor-grabbing group-hover:opacity-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black transition-colors duration-200 hover:bg-gray-800">
          <MoveAbleIcon className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Section Content with Hover Effect */}
      <div
        className={`rounded-2xl px-4 py-4 transition-all duration-200 ${
          isDragging
            ? 'border-2 border-dashed border-gray-300 bg-gray-100 opacity-30 dark:border-gray-600 dark:bg-gray-800'
            : 'group-hover:border group-hover:border-gray-200 group-hover:bg-white group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:group-hover:border-gray-700 dark:group-hover:bg-gray-900'
        } `}
      >
        <div className={isDragging ? 'invisible' : ''}>{children}</div>
      </div>
    </div>
  );
}
