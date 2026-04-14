'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { BentoButton, BentoInput, FADE_EASE } from './bento-ui';
import { goToOwnPage } from './go-to-own-page';
import LogInAnimation from './log-in-animation';

// bento.me/reset-password: the email form, or "Check your Email" once the
// link is sent. "expired-token" is shown when a reset link has expired.
export type ResetState = 'expired-token';

const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const swap = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

function MailIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="reset-mail-mask" fill="currentColor">
        <rect y="3" width="26" height="20" rx="2" />
      </mask>
      <rect y="3" width="26" height="20" rx="2" stroke="currentColor" strokeWidth="6" mask="url(#reset-mail-mask)" />
      <path d="M2 6L12.3668 14.4819C12.7351 14.7833 13.2649 14.7833 13.6332 14.4819L24 6" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export default function ResetPasswordContent({
  initialEmail = '',
  state,
}: {
  initialEmail?: string;
  state?: ResetState;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  // True once the email was edited after the last attempt; hides the error.
  const [edited, setEdited] = useState(false);
  // Like bento, a signed-in visitor fades out and goes to their page.
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setLeaving(true);
          goToOwnPage(router);
        }
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(
      email.toLowerCase(),
      { redirectTo: `${window.location.origin}/reset-password/confirm` }
    );
    setSent(!resetError);
    setError(resetError?.message);
    setEdited(false);
    setLoading(false);
  };

  const showError = !edited && !!error;
  const showSent = !edited && sent;

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center"
      animate={{
        opacity: leaving ? 0 : 1,
        transition: { ease: FADE_EASE, duration: 0.5 },
      }}
    >
      <div className="flex min-h-screen w-full max-w-[1728px] flex-col p-7 sm:p-16 lg:flex-row">
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <AnimatePresence>
            {showSent ? (
              <motion.div
                key="sent"
                variants={swap}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex w-full max-w-[330px] flex-col items-center"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#768cff] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
                  <MailIcon size={26} className="text-white" />
                </div>
                <div className="mb-6 mt-3 text-center text-sm">
                  <h1 className="font-semibold text-black">Check your Email</h1>
                  <p className="text-[#6c6c6c]">
                    We sent a link to change your password to <br />
                    <span className="text-black">{email}</span>.
                  </p>
                </div>
                <div className="w-full space-y-3">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-md bg-[#f5f5f5] py-3 text-center text-sm font-semibold"
                    href="https://mail.google.com"
                  >
                    Open Gmail
                  </a>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-md bg-[#f5f5f5] py-3 text-center text-sm font-semibold"
                    href="https://outlook.office365.com/mail/inbox"
                  >
                    Open Outlook
                  </a>
                </div>
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
                <h1 className="mt-2 text-[32px] font-semibold leading-10 text-black">
                  {state === 'expired-token' ? (
                    <span>
                      This reset link expired.
                      <br /> Send a new one.
                    </span>
                  ) : (
                    'Reset your password'
                  )}
                </h1>
                <p className="mt-4 text-xl leading-9 text-[#6c6c6c]">
                  To which email should we send the reset link to?
                </p>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="mt-20 flex flex-col gap-4">
                    <BentoInput
                      className="flex-1"
                      placeholder="Email address"
                      type="email"
                      autoFocus
                      autoComplete="username"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEdited(true);
                      }}
                    />
                    {showError ? (
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
                          className="h-full !py-3"
                          type="submit"
                          loading={loading}
                          disabled={!EMAIL.test(email)}
                        >
                          Send Reset Link
                        </BentoButton>
                      </motion.div>
                    )}
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <LogInAnimation />
      </div>
    </motion.div>
  );
}
