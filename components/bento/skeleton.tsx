import { cn } from '@/lib/utils';

// bento's skeleton: a soft grey block with a light shimmer sweeping across.
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bento-skeleton', className)} aria-hidden="true" />;
}
