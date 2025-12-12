'use client';

import React from 'react';
import { LinkIcon, SectionIcon } from '../icons';
import Image from 'next/image';

interface SectionActionBarProps {
  onAddWorkExperience?: () => void;
  onAddEducation?: () => void;
  onAddSkill?: () => void;
  onAddProject?: () => void;
  onAddSocialLink?: () => void;
  onAddSectionTitle?: () => void;
}

// Gradient Style (can't be expressed in Tailwind)
const BUTTON_GRADIENT =
  'linear-gradient(180deg, rgba(0, 0, 0, .06), rgba(0, 0, 0, .059) 11.97%, rgba(0, 0, 0, .056) 21.38%, rgba(0, 0, 0, .051) 28.56%, rgba(0, 0, 0, .044) 34.37%, rgba(0, 0, 0, .037) 39.32%, rgba(0, 0, 0, .03) 44%, rgba(0, 0, 0, .023) 49.02%, rgba(0, 0, 0, .016) 54.96%, rgba(0, 0, 0, .009) 62.44%, rgba(0, 0, 0, .004) 72.04%, rgba(0, 0, 0, .001) 84.36%, transparent)';

export const SectionActionBar = ({
  onAddWorkExperience,
  onAddEducation,
  onAddSkill,
  onAddProject,
  onAddSectionTitle,
}: SectionActionBarProps) => {
  return (
    <div className="flex items-center space-x-5 rounded-2xl bg-white px-4 py-4 shadow-[0_0_0_1px_rgba(0,0,0,.04),0_27px_54px_rgba(0,0,0,.04),0_17.5px_31.625px_rgba(0,0,0,.03),0_10.4px_17.2px_rgba(0,0,0,.024),0_5.4px_8.775px_rgba(0,0,0,.02),0_2.2px_4.4px_rgba(0,0,0,.016),0_.5px_2.125px_rgba(0,0,0,.01)] xl:space-x-2.5 xl:p-0 xl:shadow-none">
      {/* Projects Button */}
      <button
        onClick={onAddProject}
        className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95 lg:size-[25px]"
        data-state="closed"
        aria-label="Add Project"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
          {/* Gradient - complex gradient requires inline style */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />

          {/* Icon */}
          <LinkIcon />

          {/* Border */}
          <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />

          {/* Hover Highlight */}
          <div className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Tooltip */}
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100 xl:block">
          Project
        </div>
      </button>

      {/* Work Experience Button */}
      <button
        onClick={onAddWorkExperience}
        className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95 lg:size-[25px]"
        data-link-button="true"
        data-state="closed"
        aria-label="Add Work Experience"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <Image
            src={'/image_copy.png'}
            alt="Work Experience"
            width={30}
            height={15}
          />
          <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />
          {/* <div className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" /> */}
        </div>
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100 xl:block">
          Work Experience
        </div>
      </button>

      {/* Education Button */}
      <button
        onClick={onAddEducation}
        className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95"
        data-state="closed"
        aria-label="Add Education"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <Image src={'/text.png'} alt="Education" width={25} height={15} />
          <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />
          {/* <div className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" /> */}
        </div>
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100 xl:block">
          Education
        </div>
      </button>

      {/* Skills Button */}
      <button
        onClick={onAddSkill}
        className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95 lg:size-[25px]"
        data-state="closed"
        aria-label="Add Skill"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <Image src="/map.png" alt="Add Skill" width={25} height={15} />
          <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />
          {/* <div className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" /> */}
        </div>
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100 xl:block">
          Skill
        </div>
      </button>

      {/* Section Title Button */}
      <button
        onClick={onAddSectionTitle}
        className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95 lg:size-[25px]"
        data-state="closed"
        aria-label="Add Section Title"
      >
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[7px]"
            style={{ background: BUTTON_GRADIENT }}
          />
          <SectionIcon />
          <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />
          <div className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100 xl:block">
          Section Title
        </div>
      </button>
    </div>
  );
};
