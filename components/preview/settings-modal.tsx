'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useUserActions } from '@/hooks/use-user-actions';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { signOut } from 'next-auth/react';
import UsernameEditorView from './username-editor-view';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { SettingsIcon } from '../icons/settings';

export function SettingsPanel() {
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { usernameQuery } = useUserActions();
  const [isUsernameEditorOpen, setIsUsernameEditorOpen] = useState(false);

  {
    /* Settings - Desktop */
  }
  if (!isMobile) {
    return (
      <>
        <div className="relative">
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`relative active:scale-95 transition-transform h-8 w-8 rounded-full active:shadow-lg group ${
                  isDropdownOpen
                    ? 'bg-slate-100 text-black'
                    : 'text-design-gray hover:bg-slate-100 hover:text-design-gray'
                }`}
              >
                <SettingsIcon />

                {/* Tooltip */}
                <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2.5 py-1.5 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-500 pointer-events-none whitespace-nowrap z-[100]">
                  Settings
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-2xl -p-2"
              align="start"
              side="top"
              sideOffset={8}
              alignOffset={-8}
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col">
                  <div
                    className="cursor-pointer hover:bg-slate-100 hover:rounded-xl p-3"
                    onClick={() => setIsUsernameEditorOpen(true)}
                  >
                    <div className="text-xs font-normal text-design-black">
                      Change Username
                    </div>
                    <div className="text-xs text-gray-500">
                      /{usernameQuery.data?.username || 'username'}
                    </div>
                  </div>

                  <div className="p-3 cursor-default">
                    <div className="text-xs font-normal text-design-gray">
                      Change Email
                    </div>
                    <div className="text-xs text-design-gray">
                      Signed in with Google
                    </div>
                  </div>

                  <div className="p-3 cursor-default">
                    <div className="text-xs font-normal text-design-gray">
                      Change Password
                    </div>
                    <div className="text-xs text-design-gray">
                      Signed in with Google
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div
                  className="cursor-pointer hover:bg-slate-100 hover:rounded-xl p-3"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <div className="text-xs font-normal text-red-500">
                    Log Out
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          <UsernameEditorView
            initialUsername={usernameQuery.data?.username || ''}
            isOpen={isUsernameEditorOpen}
            onClose={() => setIsUsernameEditorOpen(false)}
          />
        </div>
      </>
    );
  }

  {
    /* Settings - Mobile */
  }
  return (
    <>
      <div className="relative">
        <Drawer onOpenChange={setIsDropdownOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              className={`relative transition-all h-8 w-8 rounded-full active:shadow-lg group ${
                isDropdownOpen
                  ? 'bg-slate-100 text-black'
                  : 'text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95'
              }`}
            >
              <SettingsIcon />

              {/* Tooltip */}
              <div className="hidden md:block absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-xs px-2 py-1 rounded-md shadow-md  border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Settings
              </div>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="px-3 pb-20 rounded-t-[32px]">
            <DrawerHeader className="">
              <DrawerTitle className="text-right">
                <DrawerClose asChild>
                  <Button className="text-white text-lg p-6 rounded-xl bg-[#3dda69] hover:bg-[#3dda69] active:scale-95 transition-all font-bold">
                    Done
                  </Button>
                </DrawerClose>
              </DrawerTitle>
            </DrawerHeader>

            <div className="flex mt-10 flex-col space-y-1">
              <div
                className="cursor-pointer hover:bg-slate-50 rounded-lg p-3 transition-colors"
                onClick={() => {
                  setIsUsernameEditorOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="text-sm font-normal text-design-black">
                  Change Username
                </div>
                <div className="text-sm text-gray-500">
                  /{usernameQuery.data?.username || 'username'}
                </div>
              </div>

              <div className="p-3 rounded-lg">
                <div className="text-sm font-normal text-design-gray">
                  Change Email
                </div>
                <div className="text-sm text-design-gray">
                  Signed in with Google
                </div>
              </div>

              <div className="p-3 rounded-lg">
                <div className="text-sm font-normal text-design-gray">
                  Change Password
                </div>
                <div className="text-sm text-design-gray">
                  Signed in with Google
                </div>
              </div>
            </div>

            <div
              className="cursor-pointer rounded-lg p-3 transition-colors"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <div className="mt-32 text-sm text-center font-normal text-red-500">
                Log Out
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <UsernameEditorView
          initialUsername={usernameQuery.data?.username || ''}
          isOpen={isUsernameEditorOpen}
          onClose={() => setIsUsernameEditorOpen(false)}
        />
      </div>
    </>
  );
}
