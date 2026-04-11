'use client';

import { cn } from '@/lib/utils';
import { RealisticCloud, type CloudState } from './widget-cloud';

// Right-hand side of bento.me/signup: widgets float while you pick a handle
// and snap into place once you reach the account step.
export default function SignUpAnimation({ state }: { state: CloudState }) {
  return (
    <div
      className={cn(
        'hidden flex-1 items-center justify-center transition-all duration-1000 lg:flex'
      )}
    >
      <RealisticCloud state={state} />
    </div>
  );
}
