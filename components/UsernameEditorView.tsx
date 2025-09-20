'use client';

import { useState, useEffect, useRef } from 'react';
import { CheckCircleIcon, Copy } from 'lucide-react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserActions } from '@/hooks/useUserActions';
import { toast } from 'sonner';
import { MAX_USERNAME_LENGTH } from '@/lib/config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from './ui/use-mobile';
import { ConfettiButton } from './ui/confetti';

interface UsernameEditorContentProps {
  initialUsername: string;
  onClose: () => void;
  prefix?: string;
}

function UsernameEditorContent({
  initialUsername,
  onClose,
  prefix = 'portfoliofy.me/',
}: UsernameEditorContentProps) {
  const [newUsername, setNewUsername] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { updateUsernameMutation, checkUsernameMutation } = useUserActions();

  const isInitialUsername = newUsername === initialUsername;

  useEffect(() => {
    if (!isInitialUsername && newUsername) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        checkUsernameMutation.mutateAsync(newUsername);
      }, 500);
    }
  }, [newUsername, isInitialUsername]);

  const isValid =
    /^[a-zA-Z0-9-]+$/.test(newUsername) &&
    newUsername.length > 0 &&
    newUsername !== initialUsername &&
    ((isInitialUsername || checkUsernameMutation.data?.available) ?? false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^a-zA-Z0-9-]/g, '')
      .slice(0, MAX_USERNAME_LENGTH);
    setNewUsername(value);
  };

  const handleSave = async () => {
    try {
      await updateUsernameMutation.mutateAsync(newUsername);
      setShowSuccess(true);
    } catch (error) {
      toast.error('Failed to update username');
    }
  };

  // Success Modal Content
  const [copied, setCopied] = useState(false);
  const fullUrl = `${prefix}${newUsername}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <Dialog
          open={showSuccess}
          onOpenChange={(open) => {
            if (!open) {
              setShowSuccess(false);
              onClose();
            }
          }}
        >
          <DialogContent className="max-w-xs rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-2">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="#22c55e"
                    opacity="0.15"
                  />
                  <polyline
                    points="16 12 12 16 8 12"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    fill="none"
                  />
                </svg>
              </div>
              <DialogTitle className="text-lg font-semibold text-center mb-1">
                Your new username is
              </DialogTitle>
              <div className="w-full bg-[#f7f7f7] rounded-xl px-4 py-3 text-center text-gray-700 font-normal text-sm mb-3 select-all">
                <span className="text-design-resume">{prefix}</span>
                <span className="text-black">{newUsername}</span>
              </div>
              <button className="w-full" onClick={handleCopy}>
                <ConfettiButton className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-normal rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  Copy my Link
                </ConfettiButton>
              </button>
              <div className="text-design-resume font-normal text-xs mt-3">
                The link is ready for your portfolio!
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Main Username Editor */}
      <div className="flex flex-col gap-4">
        {/* New Username Input */}
        <div className="flex flex-col gap-2">
          <div className="w-full overflow-hidden rounded-xl bg-[#f7f7f7] border-[0.5px] border-[#f7f7f7]">
            <div className="flex items-center">
              <span className="pl-3 pr-0.5 text-sm text-design-resume select-none">
                {prefix}
              </span>
              <input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                maxLength={MAX_USERNAME_LENGTH}
                className="flex-1 p-3 text-sm text-black border-none font-normal outline-none focus:ring-0 bg-transparent min-w-0"
                style={{ paddingLeft: 0 }}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    isValid &&
                    !checkUsernameMutation.isPending
                  ) {
                    handleSave();
                  }
                }}
              />
              <div className="pr-3">
                {isInitialUsername ? (
                  <></>
                ) : checkUsernameMutation.isPending ? (
                  <svg
                    height="16"
                    width="16"
                    className="styles_container__9hC7b"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                  >
                    <g transform="rotate(0 50 50)">
                      <rect
                        x="44"
                        y="0.5"
                        rx="6"
                        ry="6.29"
                        width="12"
                        height="37"
                        fill="currentColor"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="0.625s"
                          begin="-0.5208333333333333s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(60 50 50)">
                      <rect
                        x="44"
                        y="0.5"
                        rx="6"
                        ry="6.29"
                        width="12"
                        height="37"
                        fill="currentColor"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="0.625s"
                          begin="-0.41666666666666663s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(120 50 50)">
                      <rect
                        x="44"
                        y="0.5"
                        rx="6"
                        ry="6.29"
                        width="12"
                        height="37"
                        fill="currentColor"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="0.625s"
                          begin="-0.31249999999999994s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(180 50 50)">
                      <rect
                        x="44"
                        y="0.5"
                        rx="6"
                        ry="6.29"
                        width="12"
                        height="37"
                        fill="currentColor"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="0.625s"
                          begin="-0.20833333333333331s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(240 50 50)">
                      <rect
                        x="44"
                        y="0.5"
                        rx="6"
                        ry="6.29"
                        width="12"
                        height="37"
                        fill="currentColor"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="0.625s"
                          begin="-0.10416666666666666s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                    <g transform="rotate(300 50 50)">
                      <rect
                        x="44"
                        y="0.5"
                        rx="6"
                        ry="6.29"
                        width="12"
                        height="37"
                        fill="currentColor"
                      >
                        <animate
                          attributeName="opacity"
                          values="1;0"
                          keyTimes="0;1"
                          dur="0.625s"
                          begin="0s"
                          repeatCount="indefinite"
                        ></animate>
                      </rect>
                    </g>
                  </svg>
                ) : isValid ? (
                  <svg
                    viewBox="0 0 154 154"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                  >
                    <g fill="none" stroke="#4EDD76" stroke-width="2">
                      <circle
                        id="colored"
                        fill="#4EDD76"
                        cx="77"
                        cy="77"
                        r="72"
                        style={{
                          strokeDasharray: '480px, 480px',
                          strokeDashoffset: '960px',
                        }}
                      ></circle>
                      <polyline
                        className="st0"
                        stroke="#fff"
                        stroke-width="10"
                        points="43.5,77.8 63.7,97.9 112.2,49.4"
                        style={{
                          strokeDasharray: '100px, 100px',
                          strokeDashoffset: '200px',
                          animationDelay: '0s',
                        }}
                      ></polyline>
                    </g>
                  </svg>
                ) : newUsername ? (
                  <div className="cursor-pointer">
                    <X
                      className="w-5 h-5"
                      onClick={() => {
                        setNewUsername('');
                        if (checkUsernameMutation.reset) {
                          checkUsernameMutation.reset();
                        }
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div>
          {checkUsernameMutation.data &&
          checkUsernameMutation.data.available === false ? (
            <div className="w-full py-4 text-center text-red-600 font-normal text-sm">
              This username seems to be taken.
              <br />
              Maybe you have some other ideas?
            </div>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!isValid || updateUsernameMutation.isPending}
              className="w-full py-4"
            >
              {updateUsernameMutation.isPending ? (
                <svg
                  height="16"
                  width="16"
                  className="styles_container__9hC7b"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid"
                >
                  <g transform="rotate(0 50 50)">
                    <rect
                      x="44"
                      y="0.5"
                      rx="6"
                      ry="6.29"
                      width="12"
                      height="37"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="0.625s"
                        begin="-0.5208333333333333s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(60 50 50)">
                    <rect
                      x="44"
                      y="0.5"
                      rx="6"
                      ry="6.29"
                      width="12"
                      height="37"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="0.625s"
                        begin="-0.41666666666666663s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(120 50 50)">
                    <rect
                      x="44"
                      y="0.5"
                      rx="6"
                      ry="6.29"
                      width="12"
                      height="37"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="0.625s"
                        begin="-0.31249999999999994s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(180 50 50)">
                    <rect
                      x="44"
                      y="0.5"
                      rx="6"
                      ry="6.29"
                      width="12"
                      height="37"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="0.625s"
                        begin="-0.20833333333333331s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(240 50 50)">
                    <rect
                      x="44"
                      y="0.5"
                      rx="6"
                      ry="6.29"
                      width="12"
                      height="37"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="0.625s"
                        begin="-0.10416666666666666s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                  <g transform="rotate(300 50 50)">
                    <rect
                      x="44"
                      y="0.5"
                      rx="6"
                      ry="6.29"
                      width="12"
                      height="37"
                      fill="currentColor"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0"
                        keyTimes="0;1"
                        dur="0.625s"
                        begin="0s"
                        repeatCount="indefinite"
                      ></animate>
                    </rect>
                  </g>
                </svg>
              ) : (
                'Update My Username'
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default function UsernameEditorView({
  initialUsername,
  isOpen,
  onClose,
  prefix = 'portfoliofy.me/',
}: {
  initialUsername: string;
  isOpen: boolean;
  onClose: () => void;
  prefix?: string;
}) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
            <DialogDescription>
              Choose a new username for your Portfolio.
            </DialogDescription>
          </DialogHeader>
          <UsernameEditorContent
            initialUsername={initialUsername}
            onClose={onClose}
            prefix={prefix}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="p-3 pb-96">
        <DrawerHeader>
          <DrawerTitle>Change Username</DrawerTitle>
          <DrawerDescription>
            Choose a new username for your Portfolio
          </DrawerDescription>
        </DrawerHeader>
        <UsernameEditorContent
          initialUsername={initialUsername}
          onClose={onClose}
          prefix={prefix}
        />
      </DrawerContent>
    </Drawer>
  );
}
