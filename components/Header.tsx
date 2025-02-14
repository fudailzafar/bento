'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { useUserActions } from '@/hooks/use-user-actions';
import UsernameEditorView from '@/components/preview/username-editor-view';
import { Separator } from './ui/separator';

export function Header() {
  const { data: session } = useSession();
  const { usernameQuery } = useUserActions();
  const [isUsernameEditorOpen, setIsUsernameEditorOpen] = useState(false);

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
              <DropdownMenuContent
                className="w-56 rounded-3xl"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal m-1">
                  <div className="flex flex-col space-y-5">
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-slate-400"
                      onClick={() => setIsUsernameEditorOpen(true)}
                    >
                      <div className="">
                        <div className="text-xs font-normal text-design-black">
                          Change Username
                        </div>
                        <div className="text-xs text-gray-500">
                          /
                          {usernameQuery.data?.username ||
                            session.user.name
                              ?.toLowerCase()
                              .replace(/\s+/g, '') ||
                            'username'}
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="">
                      <div className="text-xs font-normal text-design-gray">
                        Change Email
                      </div>
                      <div className="text-xs text-design-gray">
                        Signed in with Google
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="">
                      <div className="text-xs font-normal text-design-gray">
                        Change Password
                      </div>
                      <div className="text-xs text-design-gray">
                        Signed in with Google
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <Separator className="my-3" />
                  <DropdownMenuItem
                    className="cursor-pointer text-design-black rounded-xl py-3 text-xs"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Username Editor Dialog */}
        <UsernameEditorView
          initialUsername={usernameQuery.data?.username || ''}
          isOpen={isUsernameEditorOpen}
          onClose={() => setIsUsernameEditorOpen(false)}
        />
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
