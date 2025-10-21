'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from './icons/link';

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95 relative group"
          aria-label="Menu"
        >
          <Link/>
          {/* Tooltip */}
          <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
            Add Sections
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-2xl p-2"
        align="center"
        side="bottom"
        sideOffset={8}
        forceMount
      >
        <div className="flex flex-col">
          {LINKS.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="cursor-pointer hover:bg-slate-100 hover:rounded-xl p-3 transition-colors"
            >
              <div className="text-xs font-normal text-design-black capitalize">
                {link.title}
              </div>
            </a>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
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
