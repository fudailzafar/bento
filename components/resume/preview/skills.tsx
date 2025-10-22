'use client';

import { Badge, Section } from '@/components/ui';
import { cn } from '@/lib';
import { useState } from 'react';
import { Plus } from 'lucide-react';
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
        toast.success('Skill added successfully.');
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
      <BlurFade delay={BLUR_FADE_DELAY * 9} className="my-2">
        <h2 className="text-xl font-bold">Skills</h2>
      </BlurFade>
      <ul
        className={cn('flex list-none flex-wrap gap-1 p-0 gap-y-1')}
        aria-label="List of skills"
        aria-labelledby="skills-section"
      >
        {skills.map((skill, id) => (
          <li key={skill + id}>
            <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
              <div className="relative group inline-block">
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
                    className="absolute -top-2 -left-2 size-5 rounded-full hover:bg-gray-50 border border-gray-50 shadow-md hover:text-design-secondary bg-white text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    aria-label={`Remove ${skill}`}
                  >
                    <TrashIcon className="size-3" />
                  </button>
                )}
              </div>
            </BlurFade>
          </li>
        ))}
      </ul>

      {/* Add Skill */}
      {isEditMode && onChangeSkills && (
        <BlurFade delay={BLUR_FADE_DELAY * 10 + skills.length * 0.05}>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsAddSkillDialogOpen(true)}
              className="px-3 active:scale-95 py-2 flex items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg transition-all duration-300 hover:shadow-lg bg-transparent hover:bg-muted/5 group"
            >
              <Plus className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Add Skill
              </span>
            </button>
          </div>
        </BlurFade>
      )}

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
