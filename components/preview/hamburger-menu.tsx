'use client';

import {
  BicepsFlexed,
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
} from 'lucide-react';
import React from 'react';

interface HamburgerMenuProps {
  onAddWorkExperience?: () => void;
  onAddEducation?: () => void;
  onAddSkill?: () => void;
  onAddProject?: () => void;
  onAddSocialLink?: () => void;
}

export const HamburgerMenu = ({
  onAddWorkExperience,
  onAddEducation,
  onAddSkill,
  onAddProject,
}: HamburgerMenuProps) => {
  return (
    <div className="flex items-center space-x-1">

      {/* Work Experience Button */}
      <button
        onClick={onAddWorkExperience}
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-link-button="true"
        data-state="closed"
        aria-label="Add Work Experience"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />

          {/* Icon - 14x14 size */}
          <BriefcaseBusiness size={15} />

          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Highlight - Strong */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>

        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Add Work Experience
        </div>
      </button>

      {/* Education Button */}
      <button
        onClick={onAddEducation}
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-state="closed"
        aria-label="Add Education"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />

          {/* Icon */}
          <GraduationCap size={15} />

          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Highlight */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04]" />
        </div>

        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Add Education
        </div>
      </button>

      {/* Skills Button */}
      <button
        onClick={onAddSkill}
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-state="closed"
        aria-label="Add Skill"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />

          {/* Icon */}
          <BicepsFlexed size={15} />

          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Highlight */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04]" />
        </div>

        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Add Skill
        </div>
      </button>

      {/* Projects Button */}
      <button
        onClick={onAddProject}
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-state="closed"
        aria-label="Add Project"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />

          {/* Icon */}
          <Lightbulb size={15} />

          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Highlight */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04]" />
        </div>

        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Add Project
        </div>
      </button>
    </div>
  );
};
