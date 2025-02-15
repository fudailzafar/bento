'use client';

import { Button } from '@/components/ui/button';
import { cn, getDomainUrl } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import UsernameEditorView from './username-editor-view';

export type PublishStatuses = 'draft' | 'live';

export default function PreviewActionbar({
  initialUsername = '',
  prefix = 'portfoliofy.me/',
  status,
  onStatusChange,
  isChangingStatus,
}: {
  initialUsername: string;
  prefix?: string;
  status?: PublishStatuses;
  onStatusChange?: (newStatus: PublishStatuses) => Promise<void>;
  isChangingStatus?: boolean;
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
      <div className="w-full rounded-lg bg-[#fcfcfc] border-[0.5px] border-neutral-300 flex items-center justify-between py-3 px-5  sm:px-4 sm:py-2.5  flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-4">
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
