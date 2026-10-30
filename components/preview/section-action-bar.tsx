'use client';

import React from 'react';
import { LinkIcon, SectionIcon } from '../icons';
import Image from 'next/image';
import { BentoTooltip } from '@/components/common/bento-tooltip';

interface SectionActionBarProps {
  onAddLink?: () => void;
  onAddImage?: () => void;
  onAddText?: () => void;
  onAddMap?: () => void;
  onAddSectionTitle?: () => void;
}

// Gradient Style (can't be expressed in Tailwind)
const BUTTON_GRADIENT =
  'linear-gradient(180deg, rgba(0, 0, 0, .06), rgba(0, 0, 0, .059) 11.97%, rgba(0, 0, 0, .056) 21.38%, rgba(0, 0, 0, .051) 28.56%, rgba(0, 0, 0, .044) 34.37%, rgba(0, 0, 0, .037) 39.32%, rgba(0, 0, 0, .03) 44%, rgba(0, 0, 0, .023) 49.02%, rgba(0, 0, 0, .016) 54.96%, rgba(0, 0, 0, .009) 62.44%, rgba(0, 0, 0, .004) 72.04%, rgba(0, 0, 0, .001) 84.36%, transparent)';

export const SectionActionBar = ({
  onAddLink,
  onAddImage,
  onAddText,
  onAddMap,
  onAddSectionTitle,
}: SectionActionBarProps) => {
  return (
    <div className="flex items-center space-x-5 rounded-2xl bg-white px-4 py-4 shadow-[0_0_0_1px_rgba(0,0,0,.04),0_27px_54px_rgba(0,0,0,.04),0_17.5px_31.625px_rgba(0,0,0,.03),0_10.4px_17.2px_rgba(0,0,0,.024),0_5.4px_8.775px_rgba(0,0,0,.02),0_2.2px_4.4px_rgba(0,0,0,.016),0_.5px_2.125px_rgba(0,0,0,.01)] xl:space-x-[11px] xl:p-0 xl:shadow-none">
      {/* Projects Button */}
      <BentoTooltip content="Link">
        <button
          onClick={onAddLink}
          className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95 lg:size-[25px]"
          data-state="closed"
          aria-label="Add Link"
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
        </button>
      </BentoTooltip>

      {/* Work Experience Button */}
      <BentoTooltip content="Image & Video">
        <button
          onClick={onAddImage}
          className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95 lg:size-[25px]"
          data-link-button="true"
          data-state="closed"
          aria-label="Add Image"
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
            <div
              className="pointer-events-none absolute inset-0 rounded-[7px]"
              style={{ background: BUTTON_GRADIENT }}
            />
            <Image src={'/image_copy.png'} alt="Image" width={30} height={15} />
            <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />
            {/* <div className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" /> */}
          </div>
        </button>
      </BentoTooltip>

      {/* Education Button */}
      <BentoTooltip content="Text">
        <button
          onClick={onAddText}
          className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95"
          data-state="closed"
          aria-label="Add Text"
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
            <div
              className="pointer-events-none absolute inset-0 rounded-[7px]"
              style={{ background: BUTTON_GRADIENT }}
            />
            <Image src={'/text.png'} alt="Text" width={25} height={15} />
            <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />
            {/* <div className="absolute inset-0 rounded-[7px] bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" /> */}
          </div>
        </button>
      </BentoTooltip>

      {/* Map Button */}
      <BentoTooltip content="Map">
        <button
          onClick={onAddMap}
          className="group relative size-[25px] rounded-lg transition-all hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)] active:scale-95 lg:size-[25px]"
          data-state="closed"
          aria-label="Add Map"
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[7px] shadow-[0_.6px_2px_rgba(0,0,0,.06)] backdrop-blur-[255px]">
            <div
              className="pointer-events-none absolute inset-0 rounded-[7px]"
              style={{ background: BUTTON_GRADIENT }}
            />
            <Image src="/map.png" alt="Map" width={25} height={15} />
            <div className="pointer-events-none absolute inset-0 rounded-[7px] border border-black/[0.12]" />
          </div>
        </button>
      </BentoTooltip>

      {/* Section Title Button */}
      <BentoTooltip content="Section Title">
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
        </button>
      </BentoTooltip>
    </div>
  );
};
