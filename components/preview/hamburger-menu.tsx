'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui';
import { LinkIcon, SectionIcon } from '@/components/icons';

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center space-x-1">
      {/* Link Button */}
      <button
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-link-button="true"
        data-state="closed"
        aria-label="Add Links"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />
          
          {/* Icon - 14x14 size */}
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.95034 13.8492C5.12191 15.0208 7.02141 15.0208 8.19298 13.8492L9.6072 12.435C9.99772 12.0445 10.6309 12.0445 11.0214 12.435C11.4119 12.8256 11.4119 13.4587 11.0214 13.8492L9.6072 15.2635C7.65457 17.2161 4.48875 17.2161 2.53613 15.2635C0.583506 13.3108 0.583507 10.145 2.53613 8.19239L3.95034 6.77817C4.34087 6.38765 4.97403 6.38765 5.36455 6.77817C5.75508 7.1687 5.75508 7.80186 5.36455 8.19239L3.95034 9.6066C2.77877 10.7782 2.77877 12.6777 3.95034 13.8492ZM12.4356 9.6066L13.8498 8.19239C15.0214 7.02082 15.0214 5.12132 13.8498 3.94975C12.6783 2.77817 10.7788 2.77817 9.6072 3.94975L8.19298 5.36396C7.80246 5.75449 7.16929 5.75449 6.77877 5.36396C6.38824 4.97344 6.38824 4.34027 6.77877 3.94975L8.19298 2.53553C10.1456 0.582913 13.3114 0.582913 15.264 2.53553C17.2167 4.48816 17.2167 7.65398 15.264 9.6066L13.8498 11.0208C13.4593 11.4113 12.8261 11.4113 12.4356 11.0208C12.0451 10.6303 12.0451 9.99713 12.4356 9.6066ZM11.7285 7.48528C12.119 7.09476 12.119 6.46159 11.7285 6.07107C11.338 5.68054 10.7048 5.68054 10.3143 6.07107L6.07166 10.3137C5.68114 10.7042 5.68114 11.3374 6.07166 11.7279C6.46219 12.1184 7.09535 12.1184 7.48588 11.7279L11.7285 7.48528Z" fill="currentColor"/>
          </svg>
          
          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Highlight - Strong */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        
        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Link
        </div>
      </button>

      {/* Image Button */}
      <button
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-state="closed"
        aria-label="Add Image"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />
          
          {/* Icon */}
          <img src="/image.png" alt="" width={24} height={24} className="relative z-10 rounded-md" />
          
          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Highlight */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04]" />
        </div>
        
        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Image & Video
        </div>
      </button>

      {/* Text Button */}
      <button
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-state="closed"
        aria-label="Add Text"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />
          
          {/* Icon */}
          <img src="/text.png" alt="" width={24} height={24} className="relative z-10 rounded-md" />
          
          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Highlight */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04]" />
        </div>
        
        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Text
        </div>
      </button>

      {/* Map Button */}
      <button
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-state="closed"
        aria-label="Add Map"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />
          
          {/* Icon */}
          <img src="/map.png" alt="" width={24} height={24} className="relative z-10 rounded-md" />
          
          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Highlight */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-black/[0.04]" />
        </div>
        
        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Map
        </div>
      </button>

      {/* Section Button */}
      <button
        className="relative h-[33px] w-[33px] rounded-lg transition-all active:scale-95 group shadow-[0_1px_2px_rgba(0,0,0,0.08),0_1px_1px_rgba(0,0,0,0.05)]"
        data-state="closed"
        aria-label="Add Section"
      >
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg">
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-lg" />
          
          {/* Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
            <rect x="4" y="12" width="7" height="8" rx="3" fill="#E3E3E3" />
            <rect x="4.5" y="12.5" width="6" height="7" rx="2.5" stroke="black" strokeOpacity="0.08" />
            <rect x="13" y="12" width="7" height="8" rx="3" fill="#E3E3E3" />
            <rect x="13.5" y="12.5" width="6" height="7" rx="2.5" stroke="black" strokeOpacity="0.08" />
            <rect x="4" y="4" width="12" height="5" rx="2.5" fill="url(#paint0_linear_sections)" />
            <defs>
              <linearGradient id="paint0_linear_sections" x1="10" y1="4" x2="10" y2="9" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5B5B5B" />
                <stop offset="1" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Border */}
          <div className="absolute inset-0 rounded-lg border border-black/[0.08] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Highlight - Strong */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        
        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
          Section
        </div>
      </button>
    </div>
  );
};

const LINKS = [
  {
    title: 'about',
    href: '#',
  },
  {
    title: 'work experience',
    href: '#',
  },
  {
    title: 'education',
    href: '#',
  },
  {
    title: 'skills',
    href: '#',
  },
  {
    title: 'projects',
    href: '#',
  },
  {
    title: 'contact',
    href: '#',
  },
];
