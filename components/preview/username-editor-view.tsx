'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useUserActions, useIsMobile } from '@/hooks';
import { MAX_USERNAME_LENGTH } from '@/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  ConfettiButton,
} from '@/components/ui';
import {
  CheckmarkLargeIcon,
  CheckmarkSmallIcon,
  CrossIcon,
  LoaderIcon,
} from '@/components/icons';

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
    } catch {
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
    <div className="flex w-full flex-col items-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <span className="rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
          <CheckmarkLargeIcon />
        </span>
      </div>
      <h3 className="mb-8 text-center text-lg font-semibold">
        Your new username is
      </h3>
      <div className="mb-4 w-full select-all rounded-xl bg-[#f7f7f7] px-4 py-3 text-center text-sm font-normal text-gray-700">
        <span className="text-design-resume">{prefix}</span>
        <span className="text-black">{newUsername}</span>
      </div>
      <button className="w-full" onClick={handleCopy}>
        <ConfettiButton className="flex w-full items-center justify-center gap-2 rounded-xl bg-design-success py-3 text-sm font-bold text-white transition-transform hover:bg-green-600 active:scale-95">
          Copy my Link
        </ConfettiButton>
      </button>
      <div className="mt-3 text-center text-xs font-normal text-design-resume">
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
          <DialogContent className="flex max-w-xs flex-col items-center gap-4 rounded-2xl p-6">
            <SuccessContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Success Drawer for Mobile - replaces the main drawer content */}
      {showSuccess && isMobile ? (
        <div className="flex flex-col gap-4 px-3">
          <div className="mb-4 flex items-center justify-end">
            <DrawerClose asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="rounded-xl bg-[#3dda69] p-6 text-lg font-bold text-white transition-all hover:bg-[#3dda69] active:scale-95"
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
            <div className="w-full overflow-hidden rounded-xl border-[0.5px] border-[#f7f7f7] bg-[#f7f7f7]">
              <div className="flex items-center">
                <span className="select-none pl-3 pr-0.5 text-sm text-design-resume">
                  {prefix}
                </span>
                <input
                  id="new-username"
                  type="text"
                  value={newUsername}
                  onChange={handleUsernameChange}
                  maxLength={MAX_USERNAME_LENGTH}
                  className="min-w-0 flex-1 border-none bg-transparent p-3 text-sm font-normal text-black outline-none focus:ring-0"
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
                    <LoaderIcon />
                  ) : isValid ? (
                    <CheckmarkSmallIcon />
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
                      <CrossIcon />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div>
            {checkUsernameMutation.data &&
            checkUsernameMutation.data.available === false ? (
              <p className="w-full py-1 text-start text-xs font-normal text-[#FF2222]">
                This username seems to be taken.
                <br />
                Maybe you have some other ideas?
              </p>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!isValid || updateUsernameMutation.isPending}
                className="w-full rounded-lg bg-design-primary py-4 hover:bg-design-primaryDark"
              >
                {updateUsernameMutation.isPending ? (
                  <LoaderIcon />
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
        <DialogContent className="xl:max-w-[400px]">
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
        className={`rounded-t-[32px] p-3 ${showSuccess ? 'pb-7' : 'pb-72'}`}
      >
        <DrawerTitle className="hidden"></DrawerTitle>
        {!showSuccess && (
          <DrawerHeader className="p-0 text-left">
            <div className="mb-4 flex items-center justify-end">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSuccess(false);
                    onClose();
                  }}
                  className="rounded-xl bg-[#3dda69] p-6 text-lg font-bold text-white transition-all hover:bg-[#3dda69] active:scale-95"
                >
                  Done
                </Button>
              </DrawerClose>
            </div>
            <DrawerTitle className="-mb-1 text-2xl font-semibold">
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
