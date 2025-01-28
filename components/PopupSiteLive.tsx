'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Copy, Check, SquareArrowOutUpRight, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import Image from 'next/image';

export const PopupSiteLive = ({
  isOpen,
  onClose,
  websiteUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  websiteUrl: string;
}) => {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  const mainContent = useMemo(() => {
    return (
      <div className="relative bg-white rounded-lg shadow-lg">
        <div className="p-6 flex flex-col items-center justify-center h-full gap-5">
          {/* Site live icon */}
          <Image
            src="/user/site-live.svg"
            alt="Site Live Icon"
            className="h-[41px] w-[52px]"
          />

          <h3 className="text-2xl font-medium text-design-black mb-1 font-sans">
            Your website is now live!
          </h3>

          <div className="flex w-full flex-col gap-4 md:gap-2">
            <div className="flex-grow bg-gray-100 rounded-md border border-gray-300 p-2 px-3 text-sm text-gray-700 min-h-10">
              {websiteUrl}
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-2 ">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(websiteUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="bg-design-black rounded-md hover:bg-gray-800 p-2 text-white flex flex-row gap-2 items-center justify-center transition-colors duration-300"
                title={copied ? 'Copied!' : 'Copy URL'}
                disabled={copied}
              >
                <span className="transition-all duration-300 flex items-center">
                  {copied ? (
                    <Check className="h-5 w-5 text-green-400 transition-all duration-300" />
                  ) : (
                    <Copy className="h-5 w-5 transition-all duration-300" />
                  )}
                </span>
                <span
                  className={`text-white transition-all duration-300 ${
                    copied ? 'text-green-400' : ''
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy URL'}
                </span>
              </button>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-design-black hover:bg-gray-800 p-2 text-white rounded-md flex flex-row gap-2 items-center justify-center"
              >
                <SquareArrowOutUpRight className="h-5 w-5" />
                <span className="text-white">Visit Site</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }, [websiteUrl, copied]);

  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogTitle asChild>
          <span className="sr-only">Site Live</span>
        </DialogTitle>
        <DialogContent className="sm:max-w-md p-0 gap-0 border-none h-[280px] md:w-[500px]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
          {mainContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerTitle asChild>
        <span className="sr-only">Site Live</span>
      </DrawerTitle>
      <DrawerContent>{mainContent}</DrawerContent>
    </Drawer>
  );
};
