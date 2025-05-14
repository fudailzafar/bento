'use client';

import { Button } from '@/components/ui/button';
import { getDomainUrl } from '@/lib/utils';
import { useState } from 'react';
import UsernameEditorView from './username-editor-view';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Edit, Eye, Save, X } from 'lucide-react';

export type PublishStatuses = 'draft' | 'live';

export default function PreviewActionbar({
  initialUsername = '',
  prefix = 'portfoliofy.me/',
  status,
  onStatusChange,
  isChangingStatus,
  isEditMode,
  onEditModeChange,
  hasUnsavedChanges,
  onSaveChanges,
  onDiscardChanges,
  isSaving,
}: {
  initialUsername: string;
  prefix?: string;
  status?: PublishStatuses;
  onStatusChange?: (newStatus: PublishStatuses) => Promise<void>;
  isChangingStatus?: boolean;
  isEditMode?: boolean;
  onEditModeChange?: (isEdit: boolean) => void;
  hasUnsavedChanges?: boolean;
  onSaveChanges?: () => void;
  onDiscardChanges?: () => void;
  isSaving?: boolean;
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleStatusChange = async () => {
    if (onStatusChange) {
      // Toggle the status
      const newStatus = status === 'draft' ? 'live' : 'draft';
      await onStatusChange(newStatus);
    }
  };

  return (
    <>
      <div className="w-full rounded-lg bg-[#fcfcfc] border-[0.5px] border-neutral-300 py-3 px-5 sm:px-4 sm:py-2.5">
        <div className="flex flex-col sm:flex-row items-center w-full gap-4 sm:gap-0">
          {/* Mobile order: Status → Toggle → Actions */}
          {/* Desktop order: Toggle → Actions → Status */}

          {/* Status and Publish controls - 1st on mobile, 3rd on desktop */}
          <div className="flex-1 flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto order-1 sm:order-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {status === 'live' ? (
                  <button
                    onClick={() =>
                      window.open(getDomainUrl(initialUsername), '_blank')
                    }
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="size-1.5 rounded-full relative"
                      style={{
                        backgroundColor: '#009505',
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-[#009505] animate-ping opacity-50" />
                    </div>
                    <p className="text-[10px] font-bold uppercase text-[#009505]">
                      {status}
                    </p>
                  </button>
                ) : (
                  <>
                    <div
                      className="size-1.5 rounded-full"
                      style={{
                        backgroundColor: '#B98900',
                      }}
                    />
                    <p className="text-[10px] font-bold uppercase text-[#B98900]">
                      {status}
                    </p>
                  </>
                )}
              </div>

              <Button
                key={status}
                variant={'default'}
                disabled={isChangingStatus}
                onClick={handleStatusChange}
                className={`flex items-center min-w-[100px] min-h-8 gap-1.5 px-3 py-1.5 h-auto ${
                  status === 'draft'
                    ? 'bg-design-black hover:bg-[#333333] text-[#fcfcfc]'
                    : 'bg-design-white text-design-black hover:bg-gray-100'
                }`}
              >
                {isChangingStatus ? (
                  <>
                    <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  </>
                ) : (
                  <span className="text-sm">
                    {status === 'draft' ? 'Publish' : 'Unpublish'}
                  </span>
                )}
              </Button>

              {status === 'live' && (
                <Button className="flex items-center min-w-[100px] min-h-8 gap-1.5 px-3 py-1.5 h-auto">
                  <a
                    href={`${getDomainUrl(initialUsername)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit Site
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Edit Mode Toggle - 2nd on mobile, 1st on desktop */}
          <div className="flex items-center justify-center w-full sm:w-auto order-2 sm:order-1">
            <ToggleGroup
              type="single"
              value={isEditMode ? 'edit' : 'preview'}
              onValueChange={(value) => onEditModeChange?.(value === 'edit')}
              aria-label="View mode"
            >
              <ToggleGroupItem
                value="preview"
                aria-label="Preview mode"
                className="px-4 py-2"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span>Preview</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="edit"
                aria-label="Edit mode"
                className="px-4 py-2"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex-1 flex items-center justify-center sm:justify-center gap-2 w-full sm:w-auto order-3 sm:order-2">
            {isEditMode && (
              <>
                <Button
                  variant="outline"
                  onClick={onDiscardChanges}
                  className="flex items-center gap-1"
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  <X className="h-4 w-4" />
                  <span>Discard</span>
                </Button>
                <Button
                  onClick={onSaveChanges}
                  className="flex items-center gap-1 min-w-[80px]"
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-50 border-t-primary animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </Button>
              </>
            )}
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
