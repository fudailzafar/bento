'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SettingsPanel } from './preview/settings-modal';

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
          <SettingsPanel />
        </header>
      </>
    );
  }
}
