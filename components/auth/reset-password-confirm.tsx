'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { AnimatedCheck, BentoButton, FADE_EASE, PasswordInput } from './bento-ui';
import { goToOwnPage } from './go-to-own-page';
import SignUpAnimation from './sign-up-animation';

// bento.me/set-password, where a reset link lands: the account's email,
// "Choose a new password", then a check, confetti and "Go to my Bento".

const swap = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export default function ResetPasswordConfirmContent() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();
  // True once the password was edited after the last attempt.
  const [edited, setEdited] = useState(false);
  const goButton = useRef<HTMLButtonElement>(null);
  const empty = password === '';

  useEffect(() => {
    // An expired or used link comes back with an error instead of a session.
    const params = new URLSearchParams(
      window.location.hash.slice(1) || window.location.search
    );
    if (params.get('error_code') === 'otp_expired' || params.get('error')) {
      router.replace('/reset-password?state=expired-token');
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUserEmail(user?.email));
    const { data } = supabase.auth.onAuthStateChange((_, session) =>
      setUserEmail(session?.user.email)
    );
    return () => data.subscription.unsubscribe();
  }, [router]);

  const showSaved = !edited && saved;

  // bento fires a small burst of confetti up from "Go to my Bento".
  useEffect(() => {
    if (!showSaved || !goButton.current) return;
    const rect = goButton.current.getBoundingClientRect();
    confetti({
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height) / window.innerHeight,
      },
      startVelocity: 40,
      particleCount: 30,
      spread: 30,
      angle: 90,
    });
  }, [showSaved]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    setSaved(!updateError);
    setError(updateError?.message);
    setEdited(false);
    setLoading(false);
  };

  return (
    <motion.div className="flex min-h-screen flex-col items-center">
      <div className="flex min-h-screen w-full max-w-[1728px] flex-col gap-5 p-7 sm:p-16 lg:flex-row">
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <AnimatePresence>
            {showSaved ? (
              <motion.div
                key="saved"
                variants={swap}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex w-full flex-col items-center gap-3"
              >
                <span className="rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
                  <AnimatedCheck size={48} delayed />
                </span>
                <p className="mb-3 text-sm font-semibold text-black">Your password was updated</p>
                <BentoButton
                  ref={goButton}
                  variant="blue"
                  className="block w-[330px] !py-3"
                  onClick={() => goToOwnPage(router)}
                >
                  Go to my Bento
                </BentoButton>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={swap}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex w-full max-w-[448px] flex-col"
              >
                <p className="text-black">{userEmail}</p>
                <h1 className="mt-2 text-[32px] font-semibold leading-10 text-black">
                  Choose a new password
                </h1>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="mt-20 flex flex-col gap-4">
                    <PasswordInput
                      autoComplete="new-password"
                      autoFocus
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setEdited(true);
                      }}
                    />
                    {!edited && error ? (
                      <p className="text-xs text-[#ff2222]">{error}</p>
                    ) : (
                      <motion.div
                        key="withMail"
                        className="flex h-full w-full flex-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, position: 'absolute' }}
                        transition={{ duration: 0.25, ease: FADE_EASE }}
                      >
                        <BentoButton
                          className={cn('h-full !py-3', empty && 'opacity-40')}
                          type="submit"
                          loading={loading}
                          disabled={loading || empty}
                        >
                          Save Password
                        </BentoButton>
                      </motion.div>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <SignUpAnimation state="gas" />
      </div>
    </motion.div>
  );
}
