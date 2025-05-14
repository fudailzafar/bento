'use client';

import { Button } from '@/components/ui/button';
import { getDomainUrl } from '@/lib/utils';
import { useState, useRef } from 'react';
import UsernameEditorView from './username-editor-view';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Edit, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Loader } from '../icons/loader';

export type PublishStatuses = 'draft' | 'live';

export default function PreviewActionbar({
  initialUsername = '',
  prefix = 'portfoliofy.me/',
  status,
  isEditMode,
  onEditModeChange,
  isSaving,
}: {
  initialUsername: string;
  prefix?: string;
  status?: PublishStatuses;
  isEditMode?: boolean;
  onEditModeChange?: (isEdit: boolean) => void;
  isSaving?: boolean;
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { toast } = useToast();
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

      toast({
        title: 'Link copied!',
        description: 'Your portfolio link has been copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="md:w-[52%] rounded-2xl bg-white/95 backdrop-blur-sm border border-neutral-200 shadow-lg py-3 px-5 sm:px-4 sm:py-2.5">
        <div className="flex flex-row items-center w-full gap-x-4">
          {/* Left side: Copy my Link button */}
          <div className="flex items-center">
            {status === 'live' && (
              <Button
                ref={copyButtonRef}
                onClick={handleCopyLink}
                disabled={isSaving}
                className="flex bg-[#3dda69] transition-transform active:scale-95 hover:bg-[#3dda69] font-bold items-center rounded-lg min-w-[100px] min-h-8 gap-1.5 px-4 py-2 h-auto relative group"
              >
                {isSaving ? (
                  <>
                    <Loader />
                    <span className="ml-1">Saving...</span>
                  </>
                ) : (
                  'Copy my Link'
                )}
                {/* Tooltip */}
                {!isSaving && (
                  <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-max">
                    Share your Portfolio
                  </div>
                )}
              </Button>
            )}
          </div>
          {/* Divider */}
          <div className="h-5 w-[2px] bg-neutral-300"></div>
          {/* Right side: Toggle */}
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={isEditMode ? 'edit' : 'preview'}
              onValueChange={(value) => onEditModeChange?.(value === 'edit')}
              aria-label="View mode"
            >
              <ToggleGroupItem
                value="edit"
                aria-label="Edit mode"
                className="px-3 sm:px-4 py-2 active:scale-95 transition-transform data-[state=on]:bg-black data-[state=on]:text-white rounded-md relative group"
              >
                <Edit className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
                {/* Tooltip - Edit */}
                <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-max">
                  <div>Edit your</div>
                  <div>Portfolio</div>
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="preview"
                aria-label="Preview mode"
                className="px-3 sm:px-4 py-2 active:scale-95 transition-transform data-[state=on]:bg-black data-[state=on]:text-white rounded-md relative group"
              >
                <Eye className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
                {/* Tooltip - Preview */}
                <div className="hidden sm:block absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white font-normal text-design-resume text-[10px] leading-tight px-2 py-1 rounded-md shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-max">
                  <div>Check how your</div>
                  <div>Portfolio looks</div>
                </div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
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
