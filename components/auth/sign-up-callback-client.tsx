'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderIcon } from '@/components/icons';
import { useSession } from '@/lib/auth-client';
import { goToOwnPage } from './go-to-own-page';

export default function SignupCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [claimed, setClaimed] = useState(false);
  const username = searchParams.get('username') || (typeof window !== 'undefined' ? localStorage.getItem('bento_pending_handle') : null);

  useEffect(() => {
    if (isPending || claimed) return;

    if (!session?.user) {
      router.push('/signup');
      return;
    }

    setClaimed(true);
    const claimUsername = async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bento_pending_handle');
      }

      if (username) {
        try {
          await fetch('/api/auth/claim-username', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          });
        } catch (error) {
          console.error('Error claiming username:', error);
        }
      }

      await goToOwnPage(router);
    };

    claimUsername();
  }, [session, isPending, username, router, claimed]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <LoaderIcon className="mx-auto h-8 w-8" />
      </div>
    </div>
  );
}
