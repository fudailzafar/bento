'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks';
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
  Input,
} from '@/components/ui';
import { CheckmarkLargeIcon, LoaderIcon } from '@/components/icons';

interface PasswordEditorContentProps {
  onClose: () => void;
}

function PasswordEditorContent({ onClose }: PasswordEditorContentProps) {
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isMobile = useIsMobile();

  const isValid = newPassword.length >= 6;

  const handleSave = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to update password');
        setIsLoading(false);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to update password');
      setIsLoading(false);
    }
  };

  // Success Modal Content
  const SuccessContent = () => (
    <div className="flex w-full flex-col items-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <span className="rounded-full shadow-[0px_1px_2px_rgba(0,0,0,0.12)]">
          <CheckmarkLargeIcon />
        </span>
      </div>
      <h3 className="mb-4 text-center text-lg font-semibold">
        Your password was updated
      </h3>
    </div>
  );

  return (
    <>
      {/* Success Modal for Desktop */}
      {showSuccess && !isMobile && (
        <Dialog open={showSuccess} onOpenChange={() => {}}>
          <DialogContent className="flex max-w-xs flex-col items-center gap-4 rounded-2xl p-6">
            <SuccessContent />
          </DialogContent>
        </Dialog>
      )}

      {/* Success Drawer for Mobile */}
      {showSuccess && isMobile ? (
        <div className="flex flex-col gap-4 px-3">
          <SuccessContent />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* New Password Input */}
          <div className="flex flex-col gap-2">
            <div className="relative w-full">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 pr-[76px] text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValid && !isLoading) {
                    handleSave();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 flex h-8 w-[60px] -translate-y-1/2 items-center justify-center rounded bg-white text-xs font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:bg-gray-50 active:scale-95 active:bg-gray-200 active:shadow-none"
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-xs text-red-600">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={!isValid || isLoading}
            className="w-full rounded-lg bg-design-primary py-4 hover:bg-design-primaryDark"
          >
            {isLoading ? <LoaderIcon /> : 'Save Password'}
          </Button>
        </div>
      )}
    </>
  );
}

export default function PasswordEditorView({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Change the password you use to log in to Portfolio.
            </DialogDescription>
          </DialogHeader>
          <PasswordEditorContent onClose={onClose} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="rounded-t-[32px] p-3 pb-72">
        <DrawerTitle className="hidden"></DrawerTitle>
        <DrawerHeader className="p-0 text-left">
          <div className="mb-4 flex items-center justify-end">
            <DrawerClose asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl bg-[#3dda69] p-6 text-lg font-bold text-white transition-all hover:bg-[#3dda69] active:scale-95"
              >
                Done
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <h2 className="mb-2 text-xl font-semibold">Change Password</h2>
          <DrawerDescription className="mb-4">
            Enter a new password for your account.
          </DrawerDescription>
          <PasswordEditorContent onClose={onClose} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
