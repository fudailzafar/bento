'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/client';

export default function SignupCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [session, setSession] = useState<any>(null);
  const username = searchParams.get('username');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setStatus(data.session ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  useEffect(() => {
    const claimUsername = async () => {
      if (status === 'loading') return;

      if (!session?.user) {
        // Not authenticated, redirect to signup
        router.push('/signup');
        return;
      }

      if (!username) {
        // No username provided, redirect to upload (will generate random username)
        router.push('/upload');
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

        // Redirect to upload regardless of success (preview handles missing mapping)
        router.push('/upload');
      } catch (error) {
        console.error('Error claiming username:', error);
        router.push('/upload');
      }
    };

    claimUsername();
  }, [session, status, username, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <LoaderIcon className="mx-auto h-8 w-8" />
      </div>
    </div>
  );
}
