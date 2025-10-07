'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { CompassIcon, DiscordIcon } from '@/components/icons';
import { SettingsPanel } from '@/components/preview';

export function Header() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <>
        {/* Mobile Header */}
        <header className="sm:hidden w-full py-4 pb-36 md:px-0 px-6 flex justify-between items-center max-w-4xl mx-auto h-[67px]">
          <div className="flex flex-row items-center justify-center gap-2">
            <SettingsPanel />
            <Link
              href="/explore"
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition-all h-8 w-8 rounded-full active:shadow-lg group flex items-center justify-center text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95"
            >
              <CompassIcon />

              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2 py-1 rounded-md shadow-md  border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Explore
              </div>
            </Link>

            <Link
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition-all h-8 w-8 rounded-full active:shadow-lg group flex items-center justify-center text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95"
            >
              <DiscordIcon />

              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2 py-1 rounded-md shadow-md  border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Community
              </div>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/icons/android-chrome-512x512.png"
              alt="Brand Logo"
              className="h-[30px] w-auto"
            />
          </Link>
        </header>

        {/* Desktop Header */}
        <div className="hidden sm:flex fixed bottom-12 left-10 z-50 flex-row items-center justify-center gap-2">
          <SettingsPanel />
          <Link
            href="/explore"
            target="_blank"
            rel="noopener noreferrer"
            className="relative transition-all h-8 w-8 rounded-full active:shadow-lg group flex items-center justify-center text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95"
          >
            <CompassIcon />

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500 pointer-events-none whitespace-nowrap z-50">
              Explore
            </div>
          </Link>
          <Link
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative transition-all h-8 w-8 rounded-full active:shadow-lg group flex items-center justify-center text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95"
          >
            <DiscordIcon />

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500 pointer-events-none whitespace-nowrap z-50">
              Community
            </div>
          </Link>
        </div>
      </>
    );
  }
}
