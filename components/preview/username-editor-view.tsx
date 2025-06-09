'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useUserActions } from '@/hooks/use-user-actions';
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
  DrawerClose,
} from '@/components/ui/drawer';
import { ConfettiButton } from '../ui/confetti';
import { useIsMobile } from '@/hooks/use-mobile';
import { CheckmarkLarge, CheckmarkSmall, Cross, Loader } from '../icons';

interface UsernameEditorContentProps {
  initialUsername: string;
  onClose: () => void;
  prefix?: string;
  onSuccessChange?: (showSuccess: boolean) => void;
}

function UsernameEditorContent({
  initialUsername,
  onClose,
  prefix = 'portfoliofy.me/',
  onSuccessChange,
}: UsernameEditorContentProps) {
  const [newUsername, setNewUsername] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { updateUsernameMutation, checkUsernameMutation } = useUserActions();
  const isMobile = useIsMobile();

  // Notify parent component about success state changes
  useEffect(() => {
    if (onSuccessChange) {
      onSuccessChange(showSuccess);
    }
  }, [showSuccess, onSuccessChange]);

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

  // Success Modal/Drawer Content Component
  const SuccessContent = () => (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4">
        <span className="rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
          <CheckmarkLarge />
        </span>
      </div>
      <h3 className="text-lg font-semibold text-center mb-8">
        Your new username is
      </h3>
      <div className="w-full bg-[#f7f7f7] rounded-xl px-4 py-3 text-center text-gray-700 font-normal text-sm mb-4 select-all">
        <span className="text-design-resume">{prefix}</span>
        <span className="text-black">{newUsername}</span>
      </div>
      <button className="w-full" onClick={handleCopy}>
        <ConfettiButton className="w-full bg-design-success hover:bg-green-600 text-white text-sm font-bold rounded-xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          Copy my Link
        </ConfettiButton>
      </button>
      <div className="text-design-resume font-normal text-xs mt-3 text-center">
        The link is ready for your portfolio!
      </div>
    </div>
  );

  return (
    <>
      {/* Success Modal for Desktop */}
      {showSuccess && !isMobile && (
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
            <SuccessContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Success Drawer for Mobile - replaces the main drawer content */}
      {showSuccess && isMobile ? (
        <div className="flex flex-col gap-4 px-3">
          <div className="flex justify-end items-center mb-4">
            <DrawerClose asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="text-white text-lg p-6 rounded-xl bg-[#3dda69] hover:bg-[#3dda69] active:scale-95 transition-all font-bold"
              >
                Done
              </Button>
            </DrawerClose>
          </div>
          <SuccessContent />
        </div>
      ) : (
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
                    <Loader />
                  ) : isValid ? (
                    <CheckmarkSmall />
                  ) : newUsername ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setNewUsername('');
                        if (checkUsernameMutation.reset) {
                          checkUsernameMutation.reset();
                        }
                      }}
                    >
                      <Cross />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div>
            {checkUsernameMutation.data &&
            checkUsernameMutation.data.available === false ? (
              <p className="w-full py-1 text-start text-[#FF2222] font-normal text-xs">
                This username seems to be taken.
                <br />
                Maybe you have some other ideas?
              </p>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!isValid || updateUsernameMutation.isPending}
                className="w-full py-4 rounded-lg bg-design-primary hover:bg-design-primaryDark"
              >
                {updateUsernameMutation.isPending ? (
                  <Loader />
                ) : (
                  'Update My Username'
                )}
              </Button>
            )}
          </div>
        </div>
      )}
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
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
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
      <DrawerContent
        className={`p-3 rounded-t-[32px] ${showSuccess ? 'pb-7' : 'pb-72'}`}
      >
        <DrawerTitle className="hidden"></DrawerTitle>
        {!showSuccess && (
          <DrawerHeader className="text-left p-0">
            <div className="flex justify-end items-center mb-4">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSuccess(false);
                    onClose();
                  }}
                  className="text-white text-lg p-6 rounded-xl bg-[#3dda69] hover:bg-[#3dda69] active:scale-95 transition-all font-bold"
                >
                  Done
                </Button>
              </DrawerClose>
            </div>
            <DrawerTitle className="text-2xl font-semibold -mb-1">
              Change Username
            </DrawerTitle>
            <DrawerDescription className="mb-4">
              Choose a new username for your Portfolio.
            </DrawerDescription>
          </DrawerHeader>
        )}
        <UsernameEditorContent
          initialUsername={initialUsername}
          onClose={onClose}
          prefix={prefix}
          onSuccessChange={setShowSuccess}
        />
      </DrawerContent>
    </Drawer>
  );
}
