'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';
import { MoveAbleIcon } from '@/components/icons/move-able-icon';

interface DraggableSectionProps {
  id: string;
  children: ReactNode;
  isEditMode?: boolean;
}

export function DraggableSection({
  id,
  children,
  isEditMode = false,
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
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div ref={setNodeRef} className="group relative mb-6">
      {/* Placeholder/Shadow - Visible when dragging */}
      {isDragging && (
        <div
          className="absolute inset-0 rounded-xl border-2 border-dashed border-gray-300 bg-gray-100/50 dark:border-gray-600 dark:bg-gray-800/30 -mx-4 -my-4"
          style={{
            width: 'calc(100% + 2rem)',
            height: '100%',
          }}
        />
      )}

      {/* Draggable Content */}
      <div
        style={style}
        className={`
          ${isDragging ? 'relative z-50' : ''}
        `}
      >
        {/* Drag Handle - Only visible in edit mode */}
        <div
          {...attributes}
          {...listeners}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-10"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black hover:bg-gray-800 transition-colors duration-200">
            <MoveAbleIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Section Content with Hover Effect */}
        <div
          className={`
            rounded-2xl
            transition-all duration-200
            -mx-4 px-4 -my-4 py-4
            ${
              isDragging
                ? 'shadow-2xl scale-105 bg-white dark:bg-gray-900 opacity-90 rotate-2'
                : 'group-hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)] group-hover:bg-white group-hover:border group-hover:border-gray-200 dark:group-hover:border-gray-700 dark:group-hover:bg-gray-900'
            }
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
