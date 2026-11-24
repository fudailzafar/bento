'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useMarquee } from '@/hooks/use-marquee';
import { cn } from '@/lib/utils';

// One line of text. When it is too wide for its room it scrolls like the
// handle on the claim-a-username page: it waits, glides to a second copy of
// itself, rests, and goes round again, with the edges faded. Each copy carries
// its own 24px of padding, so the loop has no seam and the text starts 24px in.
export function MarqueeText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { outer, inner, overflowing, moving, distance } = useMarquee();
  return (
    <div
      ref={outer}
      className={cn(
        'relative w-full overflow-hidden whitespace-nowrap',
        overflowing &&
          '[mask-image:linear-gradient(90deg,transparent,#000_24px,#000_calc(100%-24px),transparent)]',
        className
      )}
    >
      <div
        className={cn('flex w-max', moving && 'bento-title-marquee')}
        style={
          { '--distance': `${distance}px`, '--spacing': '0px' } as CSSProperties
        }
      >
        {(overflowing ? [0, 1] : [0]).map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? inner : undefined}
            aria-hidden={copy === 1 || undefined}
            className="shrink-0 px-6"
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
