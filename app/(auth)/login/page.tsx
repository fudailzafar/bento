'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogInAnimation, LoginContent, goToOwnPage } from '@/components/auth';
import type { LoginMethod } from '@/components/auth/log-in-content';
import { FADE_EASE } from '@/components/auth/bento-ui';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState<LoginMethod>();
  const [error, setError] = useState('');
  // bento fades the page out before redirecting a signed-in user.
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setLeaving(true);
        goToOwnPage(router);
      }
    });
  }, [router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn('credentials');

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.code === 'invalid_credentials'
          ? 'Your email or password seems to be incorrect.'
          : `Something went wrong. Try again later. (Code: ${signInError.code ?? signInError.status})`
      );
      setLoggingIn(undefined);
      return;
    }

    setLeaving(true);
    await goToOwnPage(router);
  };

  const handleGoogle = async () => {
    if (loggingIn) return;
    setLoggingIn('google');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // Back to the login page, which fades out into the signed-in profile.
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/login`,
      },
    });
    if (oauthError) {
      setError(`Something went wrong. Try again later. (Code: ${oauthError.code ?? oauthError.status})`);
      setLoggingIn(undefined);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center"
      animate={{
        opacity: leaving ? 0 : 1,
        transition: { ease: FADE_EASE, duration: 0.5 },
      }}
    >
      <div className="flex min-h-screen w-full max-w-[1728px] flex-col p-7 sm:p-16 lg:flex-row">
        <LoginContent
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          onGoogle={handleGoogle}
          loggingIn={loggingIn}
          error={error}
          clearError={() => setError('')}
        />
        <LogInAnimation />
      </div>
    </motion.div>
  );
}
