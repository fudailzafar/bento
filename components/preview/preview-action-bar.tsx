'use client';

import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { getDomainUrl } from '@/lib';
import {
  LaptopIcon,
  LoaderIcon,
  MobileIcon,
  CheckmarkSmallIcon,
} from '@/components/icons';
import {
  UsernameEditorView,
  HamburgerMenu,
  PublishStatuses,
  ViewMode,
} from '@/components/preview';
import { Copy } from 'lucide-react';

export default function PreviewActionbar({
  initialUsername = '',
  prefix = 'portfoliofy.me/',
  status,
  viewMode = 'desktop',
  onViewModeChange,
  isSaving,
  onAddWorkExperience,
  onAddEducation,
  onAddSkill,
  onAddProject,
  onAddSocialLink,
}: {
  initialUsername: string;
  prefix?: string;
  status?: PublishStatuses;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  isSaving?: boolean;
  onAddWorkExperience?: () => void;
  onAddEducation?: () => void;
  onAddSkill?: () => void;
  onAddProject?: () => void;
  onAddSocialLink?: () => void;
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const handleCopyLink = async () => {
    const link = getDomainUrl(initialUsername);
    try {
      await navigator.clipboard.writeText(link);

      // Set copied state
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

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
      <div className="relative md:w-[60%] rounded-2xl bg-white/95 backdrop-blur-sm border border-neutral-200 shadow-lg p-2.5 flex items-center gap-5">
        {/* Share Button */}
        {status === 'live' && (
          <Button
            ref={copyButtonRef}
            onClick={handleCopyLink}
            disabled={isSaving}
            className="relative h-[33px] w-[33px] sm:w-[127px] !rounded-md !p-0 px-0 sm:px-0 !shadow-[0px_2px_3px_rgba(0,0,0,0.06)] bg-design-success hover:bg-[#3dda69] font-medium text-sm transition-all active:scale-95 flex-shrink-0 group"
          >
            <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-md">
              {isSaving ? (
                <>
                  <LoaderIcon className="size-4" />
                  <span className="ml-1.5 hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  {isCopied ? (
                    <>
                      <CheckmarkSmallIcon className="size-4 sm:hidden" />
                      <span className="hidden sm:inline font-semibold">
                        Copy my Link
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4 sm:hidden" />
                      <span className="hidden sm:inline font-semibold">
                        Copy my Link
                      </span>
                    </>
                  )}
                </>
              )}
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite]" />
            </div>
            {/* Tooltip */}
            {!isSaving && (
              <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
                Share your Portfolio
              </div>
            )}
          </Button>
        )}

        {/* Divider */}
        <div className="h-4 w-[2px] rounded-lg bg-black/[0.08] flex-shrink-0" />

        <div className="block">
          <HamburgerMenu
            onAddWorkExperience={onAddWorkExperience}
            onAddEducation={onAddEducation}
            onAddSkill={onAddSkill}
            onAddProject={onAddProject}
            onAddSocialLink={onAddSocialLink}
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-4 w-[2px] rounded-lg bg-black/[0.08] flex-shrink-0" />

        {/* Desktop/Mobile Toggle */}
        <div className="hidden sm:flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={() => onViewModeChange?.('desktop')}
            className={`relative h-[33px] w-[50px] !rounded-md transition-all active:scale-95 group ${
              viewMode === 'desktop'
                ? 'bg-black text-white'
                : 'bg-transparent text-black hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-center h-full overflow-hidden rounded-md">
              <LaptopIcon className="size-4" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite]" />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
              <div>Edit how your Portfolio</div>
              <div>looks on computers</div>
            </div>
          </button>

          <button
            onClick={() => onViewModeChange?.('mobile')}
            className={`relative h-[33px] w-[50px] !rounded-md transition-all active:scale-95 group ${
              viewMode === 'mobile'
                ? 'bg-black text-white'
                : 'bg-transparent text-black hover:bg-black/5'
            }`}
          >
            <div className="flex items-center justify-center h-full overflow-hidden rounded-md">
              <MobileIcon className="size-4" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite]" />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-700 pointer-events-none z-50 min-w-max">
              <div>Edit how your Portfolio</div>
              <div>looks on phones</div>
            </div>
          </button>
        </div>

        {/* Container highlight effect
        <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-b from-white/10 to-transparent opacity-50" /> */}
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
