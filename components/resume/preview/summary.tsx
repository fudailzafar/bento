'use client';

import { BlurFade } from '@/components/magicui';
import { Section } from '@/components/ui';
import { ResumeDataSchemaType } from '@/lib/resume';
import { useState, useRef } from 'react';

interface AboutProps {
  summary: ResumeDataSchemaType['summary'];
  className?: string;
  isEditMode?: boolean;
  onChangeSummary?: (newSummary: string) => void;
}

const BLUR_FADE_DELAY = 0.04;

/**
 * Summary section component
 * Displays a summary of professional experience and goals
 */
export function Summary({
  summary,
  className,
  isEditMode,
  onChangeSummary,
}: AboutProps) {
  const [isEditing, setIsEditing] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    if (summaryRef.current && onChangeSummary) {
      const newContent = summaryRef.current.textContent || '';
      onChangeSummary(newContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      summaryRef.current?.blur();
    }
  };

  const enableEditing = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        if (summaryRef.current) {
          summaryRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(summaryRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  return (
    <Section className={className}>
      {isEditMode && onChangeSummary ? (
        <div className="group relative -mx-4 rounded-lg px-4 py-3 transition-all duration-300">
          <div>
            <div
              ref={summaryRef}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              className={
                'text-pretty text-sm text-design-resume outline-none print:text-[12px]'
              }
              onClick={enableEditing}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              aria-labelledby="about-section"
              dangerouslySetInnerHTML={{
                __html: summary?.length > 0 ? summary : 'Add your summary...',
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div
              className="text-pretty text-sm text-design-resume print:text-[12px]"
              aria-labelledby="about-section"
            >
              {summary}
            </div>
          </BlurFade>
        </>
      )}
    </Section>
  );
}
