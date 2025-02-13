'use client';

import { Section } from '@/components/ui/section';
import { ResumeDataSchemaType } from '@/lib/resume';
import { useMemo } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BlurFade from '@/components/magicui/blur-fade';
import { getShortMonth, getYear } from '../resume-utils';

const BLUR_FADE_DELAY = 0.04;

export function WorkExperience({
  work,
}: {
  work: ResumeDataSchemaType['workExperience'];
}) {
  const [expandedIndexes, setExpandedIndexes] = React.useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  // Filter out invalid work experiences and pre-format dates
  const validWork = useMemo(() => {
    return work
      .filter(
        (item) =>
          item.company && item.title && item.description,
      )
      .map((item) => {
        const hasStart = !!item.start;
        const hasEnd = !!item.end;
        let formattedDate = '—';
        if (hasStart && hasEnd) {
          formattedDate = `${getShortMonth(item.start ?? '')} ${getYear(
            item.start ?? '',
          )} - ${getShortMonth(item.end ?? '')} ${getYear(item.end ?? '')}`;
        } else if (hasStart) {
          formattedDate = `${getShortMonth(item.start)} ${getYear(
            item.start,
          )} - Present`;
        } else if (hasEnd) {
          formattedDate = `Until ${getShortMonth(item.end ?? '')} ${getYear(
            item.end ?? '',
          )}`;
        }
        return {
          ...item,
          formattedDate,
          companyLower: item.company.toLowerCase(),
        };
      });
  }, [work]);

  if (validWork.length === 0) {
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
        {validWork.map((item, id) => {
          const isExpanded = expandedIndexes.includes(id);
          const isHovered = hoveredIndex === id;
          return (
            <div
              key={id}
              onMouseEnter={() => setHoveredIndex(id)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <BlurFade
                key={item.company + item.location + item.title}
                delay={BLUR_FADE_DELAY * 6 + id * 0.05}
                className="flex flex-col justify-start items-start gap-1 print:mb-4"
              >
                <div className="flex flex-wrap justify-between items-start self-stretch gap-2">
                  <div className="flex flex-wrap justify-start items-center gap-2">
                    <p className="text-base font-semibold text-left text-[#050914] dark:text-design-white flex items-center gap-1">
                      {item.company}
                    </p>
                    {item.location && (
                      <div className="flex justify-center items-center relative overflow-hidden gap-2.5 px-[7px] py-0.5 rounded bg-[#eeeff0]">
                        <p className="text-[12px] font-semibold text-center text-[#54575e]">
                          {item.location}
                        </p>
                      </div>
                    )}
                    {isHovered && (
                      <AnimatePresence>
                        <motion.button
                          key="chevron"
                          type="button"
                          aria-label={
                            isExpanded ? 'Collapse details' : 'Expand details'
                          }
                          onClick={() => {
                            setExpandedIndexes((prev) =>
                              prev.includes(id)
                                ? prev.filter((idx) => idx !== id)
                                : [...prev, id],
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
                              isExpanded ? 'rotate-90' : 'rotate-0',
                            )}
                          />
                        </motion.button>
                      </AnimatePresence>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
                    {item.formattedDate}
                  </p>
                </div>
                <div className="flex flex-col justify-start items-start relative gap-1.5">
                  <p className="self-stretch text-sm font-medium text-left text-design-resume capitalize flex flex-wrap gap-1">
                    <span>{item.title}</span>
                  </p>
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
                      className="mt-1 text-xs sm:text-sm"
                    >
                      {item.description}
                    </motion.div>
                  )}
                </div>
              </BlurFade>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
