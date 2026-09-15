'use client';

import { createPortal } from 'react-dom';
import { Block } from '@/lib';
import { cn } from '@/lib/utils';
import { sizesFor } from './widget-toolbar';

// bento's phone toolbar: a black bar at the bottom of the screen with the
// selected widget's sizes and a green Done button.
export function MobileBar({
  block,
  onResize,
  onDone,
}: {
  block: Block;
  onResize: (w: number, h: number) => void;
  onDone: () => void;
}) {
  if (typeof document === 'undefined') return null;
  const sizes = block.type === 'SECTION_TITLE' ? [] : sizesFor(block.type);
  return createPortal(
    <div
      data-keep-selection
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] px-4 pb-[max(16px,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto mx-auto flex max-w-[380px] items-center gap-1.5 rounded-[18px] bg-black p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,.2),0_9px_13px_rgba(0,0,0,.12),0_3.47px_4.14px_rgba(0,0,0,.08)]">
        {sizes.map((s) => {
          const on = block.w === s.w && block.h === s.h;
          return (
            <button
              key={s.label}
              type="button"
              aria-label={s.label}
              aria-pressed={on}
              onClick={() => onResize(s.w, s.h)}
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition-[transform,color] duration-100 active:scale-90',
                on ? 'bg-white text-black' : 'text-white'
              )}
            >
              <s.Icon size={20} />
            </button>
          );
        })}
        <button
          type="button"
          onClick={onDone}
          className="ml-auto h-10 min-w-[96px] flex-1 rounded-lg bg-[#4ED975] px-5 text-base font-semibold text-white outline-none transition-[transform,background-color] duration-100 active:scale-[.97] active:bg-[#32CA5C]"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}
