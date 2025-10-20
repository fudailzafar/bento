'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="group fixed sm:right-10 right-4 bottom-4 z-50 size-16 rounded-full bg-gradient-to-br from-black to-gray-800 shadow-lg shadow-black/20 transition-all hover:shadow-xl hover:scale-105 pointer-events-auto flex items-center justify-center border-4 border-white">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-45' : 'rotate-0'
            }`}
          >
            {/* Horizontal line */}
            <line
              x1="13"
              y1="20"
              x2="27"
              y2="20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Vertical line */}
            <line
              x1="20"
              y1="13"
              x2="20"
              y2="27"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-2xl p-2"
        align="end"
        side="top"
        sideOffset={8}
        alignOffset={-8}
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
