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
        <header className="mx-auto flex h-[67px] w-full max-w-4xl items-center justify-between px-6 py-4 pb-36 sm:hidden md:px-0">
          <div className="flex flex-row items-center justify-center gap-2">
            <SettingsPanel />
            <Link
              href="/explore"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-8 w-8 items-center justify-center rounded-full text-design-resume transition-all hover:bg-slate-100 hover:text-design-resume active:scale-95 active:shadow-lg"
            >
              <CompassIcon />

              {/* Tooltip */}
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 transform whitespace-nowrap rounded-md border border-slate-100 bg-white px-2 py-1 text-xs font-normal text-design-resume opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
                Explore
              </div>
            </Link>

            <Link
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-8 w-8 items-center justify-center rounded-full text-design-resume transition-all hover:bg-slate-100 hover:text-design-resume active:scale-95 active:shadow-lg"
            >
              <DiscordIcon />

              {/* Tooltip */}
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 transform whitespace-nowrap rounded-md border border-slate-100 bg-white px-2 py-1 text-xs font-normal text-design-resume opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
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
        <div className="fixed bottom-12 left-10 z-50 hidden flex-row items-center justify-center gap-2 sm:flex">
          <SettingsPanel />
          <Link
            href="/explore"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-8 w-8 items-center justify-center rounded-full text-design-resume transition-all hover:bg-slate-100 hover:text-design-resume active:scale-95 active:shadow-lg"
          >
            <CompassIcon />

            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md border border-slate-100 bg-white px-2 py-1 text-xs font-normal text-design-resume opacity-0 shadow-md transition-opacity delay-500 duration-200 group-hover:opacity-100">
              Explore
            </div>
          </Link>
          <Link
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-8 w-8 items-center justify-center rounded-full text-design-resume transition-all hover:bg-slate-100 hover:text-design-resume active:scale-95 active:shadow-lg"
          >
            <DiscordIcon />

            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md border border-slate-100 bg-white px-2 py-1 text-xs font-normal text-design-resume opacity-0 shadow-md transition-opacity delay-500 duration-200 group-hover:opacity-100">
              Community
            </div>
          </Link>
        </div>
      </>
    );
  }
}
