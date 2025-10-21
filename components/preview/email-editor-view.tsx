'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';
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

interface EmailEditorContentProps {
  initialEmail: string;
  onClose: () => void;
}

function EmailEditorContent({
  initialEmail,
  onClose,
}: EmailEditorContentProps) {
  const [newEmail, setNewEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isMobile = useIsMobile();

  const isValid = newEmail.includes('@') && newEmail !== initialEmail;

  const handleSave = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to Update My Email');
        setIsLoading(false);
        return;
      }

      setShowSuccess(true);
      // Sign out after 2 seconds to re-authenticate with new email
      setTimeout(() => {
        signOut({ callbackUrl: '/login' });
      }, 2000);
    } catch (error) {
      toast.error('Failed to Update My Email');
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
        Email Updated Successfully
      </h3>
      <p className="mb-4 text-center text-sm text-gray-600">
        Your email has been updated to{' '}
        <span className="font-semibold">{newEmail}</span>
      </p>
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
          {/* New Email Input */}
          <div className="flex flex-col gap-2">
            <Input
              id="new-email"
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isLoading}
              className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isValid && !isLoading) {
                  handleSave();
                }
              }}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!isValid || isLoading}
            className="w-full rounded-lg bg-design-primary py-4 hover:bg-design-primaryDark"
          >
            {isLoading ? <LoaderIcon /> : 'Update My Email'}
          </Button>
        </div>
      )}
    </>
  );
}

export default function EmailEditorView({
  initialEmail,
  isOpen,
  onClose,
}: {
  initialEmail: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>
              Change the email you use to log in to Portfolio.
            </DialogDescription>
          </DialogHeader>
          <EmailEditorContent initialEmail={initialEmail} onClose={onClose} />
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
          <h2 className="mb-2 text-xl font-semibold">Change Email</h2>
          <DrawerDescription className="mb-4">
            Change the email you use to log in to Portfolio.
          </DrawerDescription>
          <EmailEditorContent initialEmail={initialEmail} onClose={onClose} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
