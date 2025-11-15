'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useIsMobile, useUserActions } from '@/hooks';
import { SettingsIcon } from '@/components/icons';
import { UsernameEditorView, EmailEditorView, PasswordEditorView } from '@/components/preview';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Separator,
} from '@/components/ui';

export function SettingsActionBar() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { usernameQuery } = useUserActions();
  const [isUsernameEditorOpen, setIsUsernameEditorOpen] = useState(false);
  const [isEmailEditorOpen, setIsEmailEditorOpen] = useState(false);
  const [isPasswordEditorOpen, setIsPasswordEditorOpen] = useState(false);
  const [authInfo, setAuthInfo] = useState<{
    email: string;
    provider: 'google' | 'credentials';
  } | null>(null);

  // Fetch auth info
  useEffect(() => {
    fetch('/api/user/auth-info')
      .then((res) => res.json())
      .then((data) => setAuthInfo(data))
      .catch((error) => console.error('Failed to fetch auth info:', error));
  }, []);

  const handleLogout = async () => {
    const username = usernameQuery.data?.username;
    if (username) {
      await signOut({ redirect: false });
      router.push(`/${username}`);
    } else {
      await signOut({ callbackUrl: '/' });
    }
  };

  /* Settings - Desktop */
  if (!isMobile) {
    return (
      <>
        <div className="relative">
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`group relative h-8 w-8 rounded-full transition-transform active:scale-95 active:shadow-lg ${
                  isDropdownOpen
                    ? 'bg-slate-100 text-black'
                    : 'text-design-gray hover:bg-slate-100 hover:text-design-gray'
                }`}
              >
                <SettingsIcon />

                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-[100] mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md border border-slate-100 bg-white px-2.5 py-1.5 text-xs font-normal text-design-resume opacity-0 shadow-md transition-opacity delay-500 duration-200 group-hover:opacity-100">
                  Settings
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="-p-2 w-56 rounded-2xl"
              align="start"
              side="top"
              sideOffset={8}
              alignOffset={-8}
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col">
                  <div
                    className="cursor-pointer p-3 hover:rounded-xl hover:bg-slate-100"
                    onClick={() => setIsUsernameEditorOpen(true)}
                  >
                    <div className="text-xs font-normal text-design-black">
                      Change Username
                    </div>
                    <div className="text-xs text-gray-500">
                      /{usernameQuery.data?.username || 'username'}
                    </div>
                  </div>

                  <div
                    className={`p-3 ${
                      authInfo?.provider === 'credentials'
                        ? 'cursor-pointer hover:rounded-xl hover:bg-slate-100'
                        : 'cursor-default'
                    }`}
                    onClick={() => {
                      if (authInfo?.provider === 'credentials') {
                        setIsEmailEditorOpen(true);
                      }
                    }}
                  >
                    <div
                      className={`text-xs font-normal ${
                        authInfo?.provider === 'credentials'
                          ? 'text-design-black'
                          : 'text-design-gray'
                      }`}
                    >
                      Change Email
                    </div>
                    <div className="text-xs text-gray-500">
                      {authInfo?.provider === 'credentials'
                        ? authInfo.email
                        : 'Signed in with Google'}
                    </div>
                  </div>

                  <div
                    className={`p-3 ${
                      authInfo?.provider === 'credentials'
                        ? 'cursor-pointer hover:rounded-xl hover:bg-slate-100'
                        : 'cursor-default'
                    }`}
                    onClick={() => {
                      if (authInfo?.provider === 'credentials') {
                        setIsPasswordEditorOpen(true);
                      }
                    }}
                  >
                    <div
                      className={`text-xs font-normal ${
                        authInfo?.provider === 'credentials'
                          ? 'text-design-black'
                          : 'text-design-gray'
                      }`}
                    >
                      Change Password
                    </div>
                    <div className="text-xs text-gray-500">
                      {authInfo?.provider === 'credentials'
                        ? '•••••••'
                        : 'Signed in with Google'}
                    </div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div
                  className="cursor-pointer p-3 hover:rounded-xl hover:bg-slate-100"
                  onClick={handleLogout}
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
          <EmailEditorView
            initialEmail={authInfo?.email || ''}
            isOpen={isEmailEditorOpen}
            onClose={() => setIsEmailEditorOpen(false)}
          />
          <PasswordEditorView
            isOpen={isPasswordEditorOpen}
            onClose={() => setIsPasswordEditorOpen(false)}
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
              className={`group relative h-8 w-8 rounded-full transition-all active:shadow-lg ${
                isDropdownOpen
                  ? 'bg-slate-100 text-black'
                  : 'text-design-resume hover:bg-slate-100 hover:text-design-resume active:scale-95'
              }`}
            >
              <SettingsIcon />

              {/* Tooltip */}
              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 transform whitespace-nowrap rounded-md border border-slate-100 bg-white px-2 py-1 text-xs font-normal text-design-resume opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 md:block">
                Settings
              </div>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="rounded-t-[32px] px-3 pb-20">
            <DrawerHeader className="">
              <DrawerTitle className="text-right">
                <DrawerClose asChild>
                  <Button className="rounded-xl bg-[#3dda69] p-6 text-lg font-bold text-white transition-all hover:bg-[#3dda69] active:scale-95">
                    Done
                  </Button>
                </DrawerClose>
              </DrawerTitle>
            </DrawerHeader>

            <div className="mt-10 flex flex-col space-y-1">
              <div
                className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-slate-50"
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

              <div
                className={`rounded-lg p-3 ${
                  authInfo?.provider === 'credentials'
                    ? 'cursor-pointer transition-colors hover:bg-slate-50'
                    : ''
                }`}
                onClick={() => {
                  if (authInfo?.provider === 'credentials') {
                    setIsEmailEditorOpen(true);
                    setIsDropdownOpen(false);
                  }
                }}
              >
                <div
                  className={`text-sm font-normal ${
                    authInfo?.provider === 'credentials'
                      ? 'text-design-black'
                      : 'text-design-gray'
                  }`}
                >
                  Change Email
                </div>
                <div className="text-sm text-gray-500">
                  {authInfo?.provider === 'credentials'
                    ? authInfo.email
                    : 'Signed in with Google'}
                </div>
              </div>

              <div
                className={`rounded-lg p-3 ${
                  authInfo?.provider === 'credentials'
                    ? 'cursor-pointer transition-colors hover:bg-slate-50'
                    : ''
                }`}
                onClick={() => {
                  if (authInfo?.provider === 'credentials') {
                    setIsPasswordEditorOpen(true);
                    setIsDropdownOpen(false);
                  }
                }}
              >
                <div
                  className={`text-sm font-normal ${
                    authInfo?.provider === 'credentials'
                      ? 'text-design-black'
                      : 'text-design-gray'
                  }`}
                >
                  Change Password
                </div>
                <div className="text-sm text-gray-500">
                  {authInfo?.provider === 'credentials'
                    ? '••••••••'
                    : 'Signed in with Google'}
                </div>
              </div>
            </div>

            <div
              className="cursor-pointer rounded-lg p-3 transition-colors"
              onClick={handleLogout}
            >
              <div className="mt-32 text-center text-sm font-normal text-red-500">
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
        <EmailEditorView
          initialEmail={authInfo?.email || ''}
          isOpen={isEmailEditorOpen}
          onClose={() => setIsEmailEditorOpen(false)}
        />
        <PasswordEditorView
          isOpen={isPasswordEditorOpen}
          onClose={() => setIsPasswordEditorOpen(false)}
        />
      </div>
    </>
  );
}
