import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { ResumeDataSchemaType } from '@/lib/resume';
import { getYear } from './resumeUtils';
import { useMemo } from 'react';
import BlurFade from '../magicui/blur-fade';

const BLUR_FADE_DELAY = 0.04;

/**
 * Individual education card component
 */
function EducationItem({
  education,
}: {
  education: ResumeDataSchemaType['education'][0];
}) {
  const { school, start, end, degree } = education;

  // Skip rendering if required fields are missing
  if (!school || !degree || !start) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-base">
          <h3
            className="font-semibold leading-none"
            id={`education-${school.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {school}
          </h3>
          <div
            className="text-sm tabular-nums text-gray-500"
            aria-label={`Period: ${getYear(start)} to ${
              end ? ` ${getYear(end)}` : 'Present'
            }`}
          >
            {getYear(start)} - {end ? `${getYear(end)}` : 'Present'}
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="mt-1 text-design-resume text-sm print:text-[12px]"
        aria-labelledby={`education-${school
          .toLowerCase()
          .replace(/\s+/g, '-')}`}
      >
        {degree}
      </CardContent>
    </Card>
  );
}

/**
 * Main education section component
 * Renders a list of education experiences
 */
export function Education({
  educations,
}: {
  educations: ResumeDataSchemaType['education'];
}) {
  // Filter out invalid education entries
  const validEducations = useMemo(
    () => educations.filter((edu) => edu.school && edu.degree && edu.start),
    [educations]
  );

  if (validEducations.length === 0) {
    return null;
  }

  return (
    <Section>
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <h2 className="text-xl font-bold mb-2" id="education-section">
            Education
          </h2>
        </BlurFade>
        <div
          className="space-y-4"
          role="feed"
          aria-labelledby="education-section"
        >
          {validEducations.map((item, idx) => (
            <BlurFade
              key={item.school}
              delay={BLUR_FADE_DELAY * 8 + idx * 0.05}
            >
              <article key={idx} role="article">
                <EducationItem education={item} />
              </article>
            </BlurFade>
          ))}
        </div>
    </Section>
  );
}
