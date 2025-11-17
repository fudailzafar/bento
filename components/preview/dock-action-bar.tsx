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

interface DockActionBarProps {
  initialUsername: string;
  prefix?: string;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  isSaving?: boolean;
  onAddWorkExperience?: () => void;
  onAddEducation?: () => void;
  onAddSkill?: () => void;
  onAddProject?: () => void;
  onAddSocialLink?: () => void;
  onAddSectionTitle?: () => void;
}

export default function DockActionBar({
  initialUsername = '',
  prefix = 'portfoliofy.me/',
  viewMode = 'desktop',
  onViewModeChange,
  isSaving,
  onAddWorkExperience,
  onAddEducation,
  onAddSkill,
  onAddProject,
  onAddSocialLink,
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
      <div className="relative flex items-center gap-5 rounded-2xl border border-white/20 bg-white/70 px-4 py-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-xl backdrop-saturate-150 md:w-[66%] md:px-3.5 md:py-3">
        {/* Share Button */}
        <Button
          ref={copyButtonRef}
          onClick={handleCopyLink}
          disabled={isSaving}
          className="group relative hidden h-[33px] w-[33px] flex-shrink-0 !rounded-md bg-design-success !p-0 px-0 text-sm font-medium !shadow-[0px_2px_3px_rgba(0,0,0,0.06)] transition-all hover:bg-[#3dda69] active:scale-95 sm:inline sm:w-[127px] sm:px-0"
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md">
            {isSaving ? (
              <>
                <LoaderIcon className="size-4" />
                <span className="ml-1.5 hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <span className="hidden font-semibold sm:inline">
                  Copy my Link
                </span>
              </>
            )}
            {/* Shine effect */}
            <div className="absolute inset-0 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          {/* Tooltip */}
          {!isSaving && (
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100 sm:block">
              Share your Portfolio
            </div>
          )}
        </Button>

        {/* Divider */}
        <div className="hidden h-4 w-[2px] flex-shrink-0 rounded-lg bg-black/[0.08] sm:inline" />

        <div className="block">
          <SectionActionBar
            onAddWorkExperience={onAddWorkExperience}
            onAddEducation={onAddEducation}
            onAddSkill={onAddSkill}
            onAddProject={onAddProject}
            onAddSocialLink={onAddSocialLink}
            onAddSectionTitle={onAddSectionTitle}
          />
        </div>

        {/* Divider */}
        <div className="hidden h-4 w-[2px] flex-shrink-0 rounded-lg bg-black/[0.08] sm:block" />

        {/* Desktop/Mobile Toggle */}
        <div className="hidden flex-shrink-0 items-center space-x-1 sm:flex">
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
            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100">
              <div>Edit how your Portfolio</div>
              <div>looks on computers</div>
            </div>
          </button>

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
            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 min-w-max -translate-x-1/2 transform rounded-md border border-slate-100 bg-white px-2 py-1 text-[10px] font-normal leading-tight text-design-resume opacity-0 shadow-md transition-opacity delay-700 duration-200 group-hover:opacity-100">
              <div>Edit how your Portfolio</div>
              <div>looks on phones</div>
            </div>
          </button>
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
