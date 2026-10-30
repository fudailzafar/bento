'use client';

import type { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

// bento's tooltip: a small white card above the control, 12px away, that
// rises and scales in after a short delay (see .bento-tooltip in globals.css).
export function BentoTooltip({
  content,
  children,
  side = 'top',
  disabled,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom';
  // Hides the tooltip, e.g. while the control's own popover is open.
  disabled?: boolean;
}) {
  if (disabled) return <>{children}</>;
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={300} disableHoverableContent>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={12}
            collisionPadding={32}
            className="bento-tooltip z-50 rounded-md bg-white p-1.5 text-xs text-black shadow-[0_11px_36px_rgba(0,0,0,.04),0_7.12963px_21.0833px_rgba(0,0,0,.03),0_4.23704px_11.4667px_rgba(0,0,0,.024),0_2.2px_5.85px_rgba(0,0,0,.02),0_.896296px_2.93333px_rgba(0,0,0,.016),0_.203704px_1.41667px_rgba(0,0,0,.01)]"
          >
            <div className="max-w-[114px] px-1 text-center text-[10px] leading-4 text-black/60">
              {content}
            </div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
