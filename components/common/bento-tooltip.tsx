'use client';

import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

// bento's shared tooltip, with its props and defaults: a Radix tooltip that
// opens after 50ms, stays open while it is hovered, sits 12px from the
// control and keeps 32px from the screen's edge. With no `tooltip` it renders
// only its child. Styles are .bento-tooltip in globals.css.
//
//   informational  a white card with a soft shadow (the default)
//   interactive    the same with a hairline border and a deeper shadow
//   plain          no styling or animation: the caller styles it
export type BentoTooltipVariant = 'informational' | 'interactive' | 'plain';

// One provider for the whole app, so moving from one control to the next
// opens the next tooltip at once.
export function BentoTooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipPrimitive.Provider>{children}</TooltipPrimitive.Provider>;
}

type ContentProps = Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  'content' | 'className'
>;

export function BentoTooltip({
  children,
  tooltip,
  variant = 'informational',
  delayDuration = 50,
  disableHoverableContent = false,
  asChild = true,
  className,
  tooltipClassName,
  bodyClassName,
  closeOnClick = true,
  collisionPadding = 32,
  open,
  onOpenChange,
  ...content
}: ContentProps & {
  children: ReactNode;
  tooltip?: ReactNode;
  variant?: BentoTooltipVariant;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  asChild?: boolean;
  // On the trigger, and on the tooltip itself.
  className?: string;
  tooltipClassName?: string;
  // On the text inside an informational or interactive tooltip.
  bodyClassName?: string;
  // false: a click on the control does not close the tooltip.
  closeOnClick?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  if (!tooltip) return <>{children}</>;

  return (
    <TooltipPrimitive.Root
      delayDuration={delayDuration}
      open={open}
      onOpenChange={onOpenChange}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipPrimitive.Trigger
        ref={setTrigger}
        asChild={asChild}
        className={className}
        // Radix closes on both the press and the click; cancelling the
        // events here keeps it open.
        onPointerDown={closeOnClick ? undefined : (e) => e.preventDefault()}
        onClick={closeOnClick ? undefined : (e) => e.preventDefault()}
      >
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal container={trigger?.ownerDocument.body}>
        <TooltipPrimitive.Content
          onPointerDownOutside={(event) => {
            if (closeOnClick) return;
            // Pressing the control itself leaves the tooltip open.
            if (trigger && trigger.contains(event.target as Node))
              event.preventDefault();
          }}
          sideOffset={12}
          collisionPadding={collisionPadding}
          {...content}
          className={cn(
            // Above every tile, toolbar, popover and drawer in the editor
            // (the highest of them is 100), whatever is selected or pressed.
            'bento-tooltip z-[200]',
            `bento-tooltip--${variant}`,
            tooltipClassName
          )}
        >
          {variant === 'plain' ? (
            tooltip
          ) : (
            <div
              className={cn(
                'max-w-[114px] px-1 text-center text-[10px] leading-4 text-black/60',
                bodyClassName
              )}
            >
              {tooltip}
            </div>
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
