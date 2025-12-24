'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib';
import { TrashIcon } from '@/components/icons';

interface SectionTitleProps {
  title?: string;
  isEditMode?: boolean;
  onTitleChange?: (newTitle: string) => void;
  onDelete?: () => void;
  className?: string;
}

export function SectionTitle({
  title = '',
  isEditMode = false,
  onTitleChange,
  onDelete,
  className,
}: SectionTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleBlur = () => {
    if (titleRef.current && onTitleChange) {
      const newContent = titleRef.current.textContent?.trim() || '';
      onTitleChange(newContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleRef.current?.blur();
    } else if (e.key === 'Escape') {
      titleRef.current?.blur();
    }
  };

  const enableEditing = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
          if (titleRef.current.textContent === 'Add a title...') {
            titleRef.current.textContent = '';
          }
          // Select all text
          const range = document.createRange();
          range.selectNodeContents(titleRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  return (
    <div className={cn('-px-2 group relative w-full py-1', className)}>
      {/* Delete button - positioned on top-left */}
      {isEditMode && onDelete && (
        <button
          onClick={onDelete}
          className={`absolute -left-7 -top-8 z-50 flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-black opacity-0 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 active:scale-95 active:bg-gray-100 xl:-left-6 xl:-top-5 xl:group-hover:opacity-100 ${
            isMobileActive ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Delete section title"
        >
          <TrashIcon className="size-4 xl:size-4" />
        </button>
      )}

      <h1
        ref={titleRef}
        contentEditable={isEditMode && isEditing}
        suppressContentEditableWarning={true}
        className={cn(
          'text-start text-2xl font-semibold text-foreground outline-none xl:text-[18px]',
          'transition-colors duration-200 empty:before:text-black/30 empty:before:content-[attr(data-placeholder)]',
          isEditMode &&
            'cursor-text rounded-[10px] hover:bg-muted/80 xl:px-4 xl:py-2',
          !isEditMode && 'cursor-default'
        )}
        data-placeholder="Add a title..."
        onClick={(e) => {
          if (isEditMode && !isEditing) {
            // On mobile, toggle active state, on desktop enable editing
            if (window.innerWidth < 768) {
              setIsMobileActive(!isMobileActive);
            } else {
              enableEditing();
            }
          }
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{
          __html: title,
        }}
        aria-label="Section title - click to edit in edit mode"
      />
    </div>
  );
}
