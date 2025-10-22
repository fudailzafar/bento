'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  buttonVariants,
} from '@/components/ui';
import { HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { DockIcon } from './dock';

export default function DockClient() {
  return (
    <DockIcon>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'size-12 rounded-full'
            )}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <HomeIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Home</p>
        </TooltipContent>
      </Tooltip>
    </DockIcon>
  );
}
