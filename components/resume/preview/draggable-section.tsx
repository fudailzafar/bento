'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode, useState } from 'react';
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
  const [isMobileActive, setIsMobileActive] = useState(false);
  
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
      className={`group relative mb-6 transition-transform duration-200 md:mb-6 ${
        isMobileActive ? '-translate-y-2 md:translate-y-0' : ''
      } ${className}`}
    >
      {/* Mobile Drag Handle - Shows on tap/click on mobile */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 touch-none transition-opacity duration-200 md:hidden ${
          isMobileActive || isDragging ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black shadow-lg transition-colors duration-200 active:bg-gray-800">
          <MoveAbleIcon className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Section Content with Hover Effect */}
      <div
        onClick={() => setIsMobileActive(!isMobileActive)}
        {...attributes}
        {...listeners}
        className={`rounded-2xl border px-4 py-4 transition-all duration-200 md:cursor-grab ${
          isDragging
            ? 'md:cursor-grabbing md:shadow-[0_1px_3px_rgba(0,0,0,0.1)] border-gray-200 bg-gray-200 opacity-30 dark:border-gray-700 dark:bg-gray-800'
            : isMobileActive
              ? 'border-2 border-black shadow-md md:border md:border-gray-200 md:bg-white md:shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:md:border-gray-700 dark:md:bg-gray-900'
              : 'border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]  dark:border-gray-700 dark:bg-gray-900'
        } `}
      >
        <div className={isDragging ? 'invisible' : ''}>{children}</div>
      </div>
    </div>
  );
}
