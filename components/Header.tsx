'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SettingsPanel } from './preview/settings-modal';
import { Compass } from './icons/compass';
import { Discord } from './icons/discord';

export function Header() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <>
        <header className="w-full py-4 md:px-0 px-6 flex justify-between items-center max-w-4xl mx-auto h-[67px]">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/icons/android-chrome-512x512.png"
              alt="Brand Logo"
              className="h-[30px] w-auto"
            />
          </Link>

          <div className="flex flex-row items-center justify-center gap-2">
            <Link
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition-all h-8 w-8 rounded-full active:shadow-lg group flex items-center justify-center text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95"
            >
              <Discord />

              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2 py-1 rounded-md shadow-md  border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Community
              </div>
            </Link>
            <Link
              href="/explore"
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition-all h-8 w-8 rounded-full active:shadow-lg group flex items-center justify-center text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95"
            >
              <Compass />

              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2 py-1 rounded-md shadow-md  border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Explore
              </div>
            </Link>

            <SettingsPanel />
          </div>
        </header>
      </>
    );
  }
}
