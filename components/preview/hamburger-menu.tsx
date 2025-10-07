'use client';

import {
  BicepsFlexed,
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
} from 'lucide-react';
import React from 'react';
import { LinkIcon, SectionIcon } from '../icons';
import Image from 'next/image';

interface HamburgerMenuProps {
  onAddWorkExperience?: () => void;
  onAddEducation?: () => void;
  onAddSkill?: () => void;
  onAddProject?: () => void;
  onAddSocialLink?: () => void;
}

// Shared gradient style (can't be expressed in Tailwind)
const BUTTON_GRADIENT =
  'linear-gradient(180deg, rgba(0, 0, 0, .06), rgba(0, 0, 0, .059) 11.97%, rgba(0, 0, 0, .056) 21.38%, rgba(0, 0, 0, .051) 28.56%, rgba(0, 0, 0, .044) 34.37%, rgba(0, 0, 0, .037) 39.32%, rgba(0, 0, 0, .03) 44%, rgba(0, 0, 0, .023) 49.02%, rgba(0, 0, 0, .016) 54.96%, rgba(0, 0, 0, .009) 62.44%, rgba(0, 0, 0, .004) 72.04%, rgba(0, 0, 0, .001) 84.36%, transparent)';

export const HamburgerMenu = ({
  onAddWorkExperience,
  onAddEducation,
  onAddSkill,
  onAddProject,
}: HamburgerMenuProps) => {
  return (
    <div className="flex items-center space-x-2.5">
      {/* Projects Button */}
      <button
        onClick={onAddProject}
        className="relative h-[25px] w-[25px] rounded-lg transition-all active:scale-95 group hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
        data-state="closed"
        aria-label="Add Project"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] backdrop-blur-[255px] shadow-[0_.6px_2px_rgba(0,0,0,.06)]">
          {/* Gradient - complex gradient requires inline style */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />

          {/* Icon */}
          <LinkIcon />

          {/* Border */}
          <div className="pointer-events-none absolute inset-0 border border-black/[0.12] rounded-[7px]" />

          {/* Hover Highlight */}
          <div className="absolute inset-0 rounded-[7px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>

        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Project
        </div>
      </button>

      {/* Work Experience Button */}
      <button
        onClick={onAddWorkExperience}
        className="relative h-[25px] w-[25px] rounded-lg transition-all active:scale-95 group hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
        data-link-button="true"
        data-state="closed"
        aria-label="Add Work Experience"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] backdrop-blur-[255px] shadow-[0_.6px_2px_rgba(0,0,0,.06)]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <Image
            src={'/suitcase.png'}
            alt="Work Experience"
            width={15}
            height={15}
          />
          <div className="pointer-events-none absolute inset-0 border border-black/[0.12] rounded-[7px]" />
          <div className="absolute inset-0 rounded-[7px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Work Experience
        </div>
      </button>

      {/* Education Button */}
      <button
        onClick={onAddEducation}
        className="relative h-[25px] w-[25px] rounded-lg transition-all active:scale-95 group hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
        data-state="closed"
        aria-label="Add Education"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] backdrop-blur-[255px] shadow-[0_.6px_2px_rgba(0,0,0,.06)]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <Image
            src={'/education.png'}
            alt="Education"
            width={15}
            height={15}
          />
          <div className="pointer-events-none absolute inset-0 border border-black/[0.12] rounded-[7px]" />
          <div className="absolute inset-0 rounded-[7px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Education
        </div>
      </button>

      {/* Skills Button */}
      <button
        onClick={onAddSkill}
        className="relative h-[25px] w-[25px] rounded-lg transition-all active:scale-95 group hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
        data-state="closed"
        aria-label="Add Skill"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] backdrop-blur-[255px] shadow-[0_.6px_2px_rgba(0,0,0,.06)]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <Image src="/image.png" alt="Add Skill" width={15} height={15} />
          <div className="pointer-events-none absolute inset-0 border border-black/[0.12] rounded-[7px]" />
          <div className="absolute inset-0 rounded-[7px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Skill
        </div>
      </button>

      {/* Section Title Button */}
      <button
        onClick={onAddSkill}
        className="relative h-[25px] w-[25px] rounded-lg transition-all active:scale-95 group hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
        data-state="closed"
        aria-label="Add Section Title"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] backdrop-blur-[255px] shadow-[0_.6px_2px_rgba(0,0,0,.06)]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <SectionIcon />
          <div className="pointer-events-none absolute inset-0 border border-black/[0.12] rounded-[7px]" />
          <div className="absolute inset-0 rounded-[7px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Section Title
        </div>
      </button>
    </div>
  );
};
