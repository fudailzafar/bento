import BlurFade from '@/components/magicui/blur-fade';
import { Section } from '@/components/ui/section';
import { ResumeDataSchemaType } from '@/lib/resume';


interface AboutProps {
  summary: ResumeDataSchemaType['summary'];
  className?: string;
}

const BLUR_FADE_DELAY = 0.04;

/**
 * Summary section component
 * Displays a summary of professional experience and goals
 */
export function Summary({ summary, className }: AboutProps) {
  return (
    <Section className={className}>
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
    </Section>
  );
}
