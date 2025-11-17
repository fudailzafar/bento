'use client';

import { Badge, Section } from '@/components/ui';
import { cn } from '@/lib';
import { useState } from 'react';
import { toast } from 'sonner';
import { BlurFade } from '@/components/magicui';
import { AddSkillDialog } from '@/components/resume/editing';
import { TrashIcon } from '@/components/icons';

const BLUR_FADE_DELAY = 0.04;

type Skills = readonly string[];

interface SkillsProps {
  skills: Skills;
  className?: string;
  isEditMode?: boolean;
  onChangeSkills?: (newSkills: string[]) => void;
}

export function Skills({
  skills,
  className,
  isEditMode,
  onChangeSkills,
}: SkillsProps) {
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);

  const handleAddSkill = (skillToAdd: string) => {
    if (onChangeSkills) {
      if (skills.includes(skillToAdd)) {
        toast.warning('This skill is already added.');
      } else {
        onChangeSkills([...skills, skillToAdd]);
      }
    }
  };

  const handleDeleteSkill = (index: number) => {
    if (onChangeSkills) {
      const newSkills = [...skills];
      newSkills.splice(index, 1);
      onChangeSkills(newSkills);
    }
  };

  return (
    // Skills Section
    <Section className={className}>
      <ul
        className={cn('flex list-none flex-wrap gap-1 gap-y-1 p-0')}
        aria-label="List of skills"
        aria-labelledby="skills-section"
      >
        {skills.map((skill, id) => (
          <li key={skill + id}>
            {isEditMode ? (
              <div className="group relative inline-block">
                {/* Skill Card */}
                <Badge
                  className="print:text-[10px]"
                  aria-label={`Skill: ${skill}`}
                >
                  {skill}
                </Badge>
                {/* Delete on Hover */}
                {isEditMode && onChangeSkills && (
                  <button
                    onClick={() => handleDeleteSkill(id)}
                    className="absolute -left-2 -top-2 flex size-5 items-center justify-center rounded-full border border-gray-50 bg-white text-gray-700 opacity-0 shadow-md transition-all duration-200 hover:bg-gray-50 hover:text-design-secondary group-hover:opacity-100"
                    aria-label={`Remove ${skill}`}
                  >
                    <TrashIcon className="size-3" />
                  </button>
                )}
              </div>
            ) : (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <div className="group relative inline-block">
                  {/* Skill Card */}
                  <Badge
                    className="print:text-[10px]"
                    aria-label={`Skill: ${skill}`}
                  >
                    {skill}
                  </Badge>
                  {/* Delete on Hover */}
                  {isEditMode && onChangeSkills && (
                    <button
                      onClick={() => handleDeleteSkill(id)}
                      className="absolute -left-2 -top-2 flex size-5 items-center justify-center rounded-full border border-gray-50 bg-white text-gray-700 opacity-0 shadow-md transition-all duration-200 hover:bg-gray-50 hover:text-design-secondary group-hover:opacity-100"
                      aria-label={`Remove ${skill}`}
                    >
                      <TrashIcon className="size-3" />
                    </button>
                  )}
                </div>
              </BlurFade>
            )}
          </li>
        ))}
      </ul>

      {isEditMode && onChangeSkills && (
        <AddSkillDialog
          open={isAddSkillDialogOpen}
          onOpenChange={setIsAddSkillDialogOpen}
          onAddSkill={handleAddSkill}
        />
      )}
    </Section>
  );
}
