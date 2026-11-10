'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LogInAnimation, LoginContent, goToOwnPage } from '@/components/auth';
import type { LoginMethod } from '@/components/auth/log-in-content';
import { FADE_EASE } from '@/components/auth/bento-ui';
import { signIn, useSession } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState<LoginMethod>();
  const [error, setError] = useState('');
  // bento fades the page out before redirecting a signed-in user.
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setLeaving(true);
      goToOwnPage(router).catch(() => setLeaving(false));
    }
  }, [router, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn('credentials');

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(
          res.error.message || 'Your email or password seems to be incorrect.'
        );
        setLoggingIn(undefined);
        return;
      }

      setLeaving(true);
      await goToOwnPage(router);
    } catch {
      setLeaving(false);
      setLoggingIn(undefined);
      setError('Signed in, but we could not set up your page. Please try again.');
    }
  };

  const handleGoogle = async () => {
    if (loggingIn) return;
    setLoggingIn('google');

    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/login',
      });
    } catch {
      setError('Something went wrong with Google sign-in. Try again later.');
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
