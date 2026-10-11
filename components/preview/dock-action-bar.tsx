'use client';

import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { getDomainUrl } from '@/lib';
import { LaptopIcon, LoaderIcon, MobileIcon } from '@/components/icons';
import {
  SectionActionBar,
  UsernameEditorView,
  ViewMode,
} from '@/components/preview';
import { BentoTooltip } from '@/components/common/bento-tooltip';

interface DockActionBarProps {
  initialUsername: string;
  prefix?: string;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  isSaving?: boolean;
  onAddLink?: (url: string) => void;
  onAddImage?: () => void;
  onAddText?: () => void;
  onAddMap?: () => void;
  onAddSectionTitle?: () => void;
}

export default function DockActionBar({
  initialUsername = '',
  prefix = 'bento.me/',
  viewMode = 'desktop',
  onViewModeChange,
  isSaving,
  onAddLink,
  onAddImage,
  onAddText,
  onAddMap,
  onAddSectionTitle,
}: DockActionBarProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const handleCopyLink = async () => {
    const link = getDomainUrl(initialUsername);
    try {
      await navigator.clipboard.writeText(link);

      // Get button position for confetti origin
      if (copyButtonRef.current) {
        const rect = copyButtonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        // Trigger confetti from button position
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x, y },
          angle: 90,
          startVelocity: 45,
          gravity: 1,
          colors: [
            '#FF6B6B',
            '#4ECDC4',
            '#45B7D1',
            '#FFA07A',
            '#98D8C8',
            '#F7DC6F',
            '#BB8FCE',
          ],
        });
      }
    } catch {
      toast.error('Failed to copy', {
        description: 'Please try again.',
      });
    }
  };

  return (
    <>
      <div className="relative flex items-center gap-5 px-4 py-3 xl:w-[500px] xl:gap-0 xl:rounded-2xl xl:bg-white/70 xl:px-[13px] xl:shadow-[0_0_0_1px_rgba(0,0,0,.04),0_27px_54px_rgba(0,0,0,.04),0_17.5px_31.625px_rgba(0,0,0,.03),0_10.4px_17.2px_rgba(0,0,0,.024),0_5.4px_8.775px_rgba(0,0,0,.02),0_2.2px_4.4px_rgba(0,0,0,.016),0_.5px_2.125px_rgba(0,0,0,.01)] xl:backdrop-blur-xl xl:backdrop-saturate-150">
        {/* Copy Link Button */}
        <BentoTooltip content="Copy your link" disabled={isSaving}>
          <Button
            ref={copyButtonRef}
            onClick={handleCopyLink}
            disabled={isSaving}
            className="group relative hidden h-[33px] w-[33px] flex-shrink-0 !rounded-md bg-design-success !p-0 px-0 text-sm font-medium !shadow-[0px_2px_3px_rgba(0,0,0,0.06)] transition-all hover:bg-[#3dda69] active:scale-95 xl:inline xl:w-[125px] xl:px-0"
          >
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md">
              {isSaving ? (
                <>
                  <LoaderIcon className="size-4" />
                  <span className="ml-1.5 hidden xl:inline">Saving...</span>
                </>
              ) : (
                <>
                  <span className="hidden font-semibold xl:inline">
                    Copy my Link
                  </span>
                </>
              )}
              {/* bento's glare: a blurred white bar sweeping across every 4s */}
              <div className="bento-shine pointer-events-none absolute -top-5 h-[calc(100%+40px)] w-[50px] rotate-[20deg] bg-white/60 blur-[20px]" />
            </div>
          </Button>
        </BentoTooltip>

        {/* Divider */}
        <div className="hidden h-4 w-[2px] flex-shrink-0 rounded-lg bg-black/[0.08] xl:ml-4 xl:inline" />

        <div className="block xl:ml-[19.5px]">
          <SectionActionBar
            mobile={viewMode === 'mobile'}
            onAddLink={onAddLink}
            onAddImage={onAddImage}
            onAddText={onAddText}
            onAddMap={onAddMap}
            onAddSectionTitle={onAddSectionTitle}
          />
        </div>

        {/* Divider */}
        <div className="hidden h-4 w-[2px] flex-shrink-0 rounded-lg bg-black/[0.08] xl:ml-[19.5px] xl:block" />

        {/* Desktop/Mobile Toggle */}
        <div className="hidden flex-shrink-0 items-center space-x-1 xl:ml-[16.5px] xl:flex">
          <BentoTooltip content="Edit how your Bento looks on computers">
            <button
              onClick={() => onViewModeChange?.('desktop')}
              className={`group relative h-[33px] w-[50px] !rounded-md transition-all active:scale-95 ${
                viewMode === 'desktop'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              <div className="flex h-full items-center justify-center overflow-hidden rounded-md">
                <LaptopIcon className="size-4" />
                {/* Shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </button>
          </BentoTooltip>

          <BentoTooltip content="Edit how your Bento looks on phones">
            <button
              onClick={() => onViewModeChange?.('mobile')}
              className={`group relative h-[33px] w-[50px] !rounded-md transition-all active:scale-95 ${
                viewMode === 'mobile'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-black hover:bg-black/5'
              }`}
            >
              <div className="flex h-full items-center justify-center overflow-hidden rounded-md">
                <MobileIcon className="size-4" />
                {/* Shine effect */}
                <div className="absolute inset-0 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </button>
          </BentoTooltip>
        </div>
      </div>

      <UsernameEditorView
        initialUsername={initialUsername}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        prefix={prefix}
      />
    </>
  );
}
