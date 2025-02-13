import BlurFade from '@/components/magicui/blur-fade';
import { Badge } from '@/components/ui/badge';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const BLUR_FADE_DELAY = 0.04;

type Skills = readonly string[];

interface SkillsProps {
  skills: Skills;
  className?: string;
}

/**
 * Skills section component
 * Displays a list of professional skills as badges
 */
export function Skills({ skills, className }: SkillsProps) {
  return (
    <Section className={className}>
      <BlurFade delay={BLUR_FADE_DELAY * 9} className="my-2">
        <h2 className="text-xl font-bold">Skills</h2>
      </BlurFade>
      <ul
        className={cn('flex list-none flex-wrap gap-1 p-0 gap-y-1')}
        aria-label="List of skills"
        aria-labelledby="skills-section"
      >
        {skills.map((skill, id) => (
          <li key={skill}>
            <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
              <Badge
                className="print:text-[10px]"
                aria-label={`Skill: ${skill}`}
              >
                {skill}
              </Badge>
            </BlurFade>
          </li>
        ))}
      </ul>
    </Section>
  );
}
