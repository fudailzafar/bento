'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LockOpen, LogOutIcon, MailIcon } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();
  if (session?.user) {
    return (
      <>
        <header className="w-full py-4 md:px-0 px-6 flex justify-between items-center max-w-4xl mx-auto h-[67px]">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/icons/portfolio-logo.png"
              alt="Brand Logo"
              className="h-[35px] w-auto"
            />
          </Link>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full active:shadow-lg"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ''}
                      alt={session.user.name || ''}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0)?.toUpperCase() ||
                        session.user.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-3">
                    <p className="text-lg font-semibold text-black">
                      {session.user.name || 'User'}
                    </p>
                    <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <MailIcon className="text-gray-600 size-4" />
                        <span className="text-sm text-gray-700">
                          {session.user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LockOpen className="text-gray-600 size-4" />
                        <span className="text-sm text-gray-700">
                          Authed with <strong>google.com</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer flex items-center justify-center py-3 text-gray-700 hover:bg-gray-50"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOutIcon className="text-gray-600 size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </>
    );
  }
  return (
    <>
      <header className="w-full py-4 md:px-0 px-6 flex justify-between items-center max-w-4xl mx-auto h-[67px]">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/icons/portfolio-logo.png"
            alt="Brand Logo"
            className="h-[35px] w-auto"
          />
        </Link>

        <div>
          <div className="flex flex-row gap-3">
            <Link href="/signup">
              <Button
                variant="default"
                className="text-sm font-medium py-2 px-4 bg-black hover:bg-black/65 cursor-pointer"
              >
                Create Your Portfolio
              </Button>
            </Link>
            <Button variant={'ghost'}>
              <Link href={'/login'} className="text-design-gray">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
