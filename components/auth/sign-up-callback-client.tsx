'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoaderIcon } from '@/components/icons';

export default function SignupCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const username = searchParams.get('username');

  useEffect(() => {
    const claimUsername = async () => {
      if (status === 'loading') return;

      if (!session?.user) {
        // Not authenticated, redirect to signup
        router.push('/signup');
        return;
      }

      if (!username) {
        // No username provided, redirect to preview (will generate random username)
        router.push('/preview');
        return;
      }

      try {
        // Claim the username
        const response = await fetch('/api/auth/claim-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        // Redirect to preview regardless of success (preview handles missing mapping)
        router.push('/preview');
      } catch (error) {
        console.error('Error claiming username:', error);
        router.push('/preview');
      }
    };

    claimUsername();
  }, [session, status, username, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoaderIcon className="w-8 h-8 mx-auto" />
      </div>
    </div>
  );
}
