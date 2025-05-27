'use client';

import BlurFade from '@/components/magicui/blur-fade';
import { Section } from '@/components/ui/section';
import { ResumeDataSchemaType } from '@/lib/resume';
import { useState } from 'react';

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

  // Calculate rows based on content length
  const calculateRows = (text: string) => {
    const lineBreaks = (text.match(/\n/g) || []).length;
    const estimatedLines = Math.ceil(text.length / 80); // ~80 chars per line
    return Math.max(lineBreaks + 1, estimatedLines, 2); // minimum 2 rows
  };

  return (
    <Section className={className}>
      {isEditMode && onChangeSummary ? (
        <div
          className="group relative -mx-4 px-4 py-3 border-2 hover:border-gray-100 hover:shadow-md hover:rounded-xl p-2 transition-all duration-300 border-transparent  dark:hover:border-gray-600 rounded-lg cursor-text"
          onClick={() => !isEditing && setIsEditing(true)}
        >
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold mb-2" id="about-section">
              About
            </h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            {isEditing ? (
              <textarea
                value={summary}
                onChange={(e) => onChangeSummary(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="w-full bg-transparent border-none outline-none text-pretty text-sm text-design-resume print:text-[12px] p-0 resize-none focus:ring-0 leading-normal"
                rows={calculateRows(summary)}
                aria-labelledby="about-section"
              />
            ) : (
              <div className="text-pretty text-sm text-design-resume print:text-[12px]">
                {summary}
              </div>
            )}
          </BlurFade>
        </div>
      ) : (
        <>
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold" id="about-section">
              About
            </h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div
              className="text-pretty  text-sm text-design-resume print:text-[12px]"
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
