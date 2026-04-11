'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useMediaQuery } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { goToOwnPage } from './go-to-own-page';
import SignUpAnimation from './sign-up-animation';
import {
  AnimatedCheck,
  BackArrowIcon,
  BentoButton,
  BentoInput,
  CrossIcon,
  FADE_EASE,
  GoogleIcon,
  PasswordInput,
  Spinner,
  fade,
} from './bento-ui';

type Step = 'handle' | 'account';
type Direction = 1 | -1;
type SigningUp = 'credentials' | 'google' | undefined;

const stepVariants = {
  initial: ({ dir, narrow }: { dir: Direction; narrow: boolean }) => ({
    opacity: 0,
    x: (narrow ? 16 : 40) * dir,
    pointerEvents: 'auto' as const,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { delay: 0, duration: 0.5, ease: FADE_EASE },
  },
  exit: ({ dir, narrow }: { dir: Direction; narrow: boolean }) => ({
    opacity: 0,
    x: (narrow ? -8 : -20) * dir,
    pointerEvents: 'none' as const,
    transition: { duration: 0.35, ease: FADE_EASE },
  }),
};

// One step of bento.me/signup's flow (their "bold-step").
function StepFrame({
  children,
  custom,
}: {
  children: ReactNode;
  custom: { dir: Direction; narrow: boolean };
}) {
  return (
    <motion.div
      custom={custom}
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 flex flex-col items-center justify-center [&_h1]:font-bold"
    >
      {children}
    </motion.div>
  );
}

const statusFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

function HandleStep({
  value,
  setValue,
  onNext,
}: {
  value: string;
  setValue: (value: string) => void;
  onNext: () => void;
}) {
  const handle = useDebounce(value, 400);
  const [checked, setChecked] = useState<{ handle: string; free: boolean }>();

  useEffect(() => {
    if (!handle) return;
    if (handle.length < 3) {
      setChecked({ handle, free: false });
      return;
    }
    let cancelled = false;
    fetch(`/api/check-username?username=${encodeURIComponent(handle)}`)
      .then((res) => (res.ok ? res.json() : { available: false }))
      .then((data) => {
        if (!cancelled) setChecked({ handle, free: !!data.available });
      })
      .catch(() => {
        if (!cancelled) setChecked({ handle, free: false });
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  // Still "loading" while the debounce or the request is in flight.
  const loading = value !== handle || checked?.handle !== handle;
  const free = !loading && !!checked?.free;
  const tooShort = !loading && value.length > 0 && value.length < 3;

  return (
    <>
      <div className="flex w-full flex-col">
        <h1 className="text-[32px] leading-10 text-black">
          First, claim your unique link
        </h1>
        <p className="mt-4 text-xl leading-9 text-[#6c6c6c]">
          The good ones are still available!
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (free) onNext();
          }}
        >
          <BentoInput
            autoFocus
            className="mt-20"
            placeholder="your-name"
            value={value}
            onChange={(e) =>
              setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))
            }
            addonLeft={
              <div className="-mr-2.5 whitespace-nowrap text-[#6c6c6c]">
                bento.me/
              </div>
            }
            addonRight={
              value ? (
                <AnimatePresence mode="wait">
                  {loading && (
                    <motion.span key="loading" {...statusFade}>
                      <Spinner size={12} />
                    </motion.span>
                  )}
                  {!loading && free && (
                    <motion.span key="free" {...statusFade}>
                      <AnimatedCheck size={16} />
                    </motion.span>
                  )}
                  {!loading && !free && (
                    <motion.button
                      key="taken"
                      type="button"
                      {...statusFade}
                      onClick={() => setValue('')}
                    >
                      <CrossIcon size={14} />
                    </motion.button>
                  )}
                </AnimatePresence>
              ) : undefined
            }
          />
          <div className="mt-4 h-[58px] sm:h-12">
            {value && (loading || free) && (
              <BentoButton className="h-full w-full" disabled={loading} type="submit">
                Grab my Link
              </BentoButton>
            )}
            {value && !loading && !free && (
              <div className="text-xs text-[#ff2222]">
                {tooShort
                  ? 'This username seems to be too short...'
                  : 'This username seems to be taken already...'}
                <br />
                {tooShort ? 'Try something longer.' : 'Try something similar.'}
              </div>
            )}
          </div>
        </form>
        <Link href="/login" className="mt-8 text-xs text-[#6c6c6c]">
          or log in
        </Link>
      </div>
    </>
  );
}

function AccountStep({
  handle,
  onBack,
}: {
  handle: string;
  onBack: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signingUp, setSigningUp] = useState<SigningUp>();
  const hasEmail = !!email;

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signingUp) return;
    setSigningUp('credentials');

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: handle } },
    });

    if (signUpError) {
      setError(
        signUpError.code === 'user_already_exists' || signUpError.code === 'email_exists'
          ? 'This email address is already taken. Try another one'
          : signUpError.message || 'Something went wrong. Try again later.'
      );
      setSigningUp(undefined);
      return;
    }

    const response = await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: handle, email, id: data.user?.id }),
    });

    if (!response.ok) {
      setError('Account created but syncing failed. Please try logging in.');
      setSigningUp(undefined);
      return;
    }
    router.push(`/${handle}`);
  };

  const handleGoogle = async () => {
    if (signingUp) return;
    setSigningUp('google');
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/${handle}&username=${handle}`,
      },
    });
    if (oauthError) {
      setError(oauthError.message || 'Something went wrong. Try again later.');
      setSigningUp(undefined);
    }
  };

  return (
    <>
      <div className="absolute left-0 top-0 sm:hidden">
        <button type="button" onClick={onBack} className="active:scale-90" aria-label="Back">
          <BackArrowIcon />
        </button>
      </div>
      <div className="relative flex w-full flex-col">
        <div className="absolute -top-10 left-0 hidden sm:block">
          <button type="button" onClick={onBack} className="active:scale-90" aria-label="Back">
            <BackArrowIcon />
          </button>
        </div>
        <div className="text-base leading-6 text-black">
          bento.me/{handle} is yours!
        </div>
        <h1 className="mt-2 text-[32px] leading-10 text-black">
          Now, create your account.
        </h1>
        <form className="flex flex-col" onSubmit={handleCredentials}>
          <div className="mt-20 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <BentoInput
              autoFocus
              className="flex-1"
              placeholder="Email address"
              type="email"
              error={error.startsWith('This email address is already taken')}
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <PasswordInput
              className="flex-1"
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="relative h-16">
            <AnimatePresence mode="wait">
              {!error && !hasEmail && (
                <motion.div key="or" {...fade} className="flex h-full items-center text-sm font-semibold">
                  OR
                </motion.div>
              )}
              {error && (
                <motion.div
                  key="error"
                  {...fade}
                  className="flex h-full items-center text-xs font-semibold text-[#ff2222]"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative h-[58px] sm:h-[45px]">
            <AnimatePresence mode="sync">
              {hasEmail && (
                <motion.div
                  key="withMail"
                  className="flex h-full w-full flex-col"
                  {...fade}
                  exit={{ opacity: 0, position: 'absolute' }}
                >
                  <BentoButton
                    className="h-full"
                    type="submit"
                    loading={signingUp === 'credentials'}
                    disabled={!!signingUp}
                  >
                    Create Account
                  </BentoButton>
                </motion.div>
              )}
              {!hasEmail && (
                <motion.div
                  key="withGoogle"
                  className="flex h-full w-full flex-col"
                  {...fade}
                  exit={{ opacity: 0, position: 'absolute' }}
                >
                  <BentoButton
                    icon={<GoogleIcon />}
                    variant="oauth"
                    className="h-full"
                    disabled={!!signingUp}
                    loading={signingUp === 'google'}
                    onClick={handleGoogle}
                  >
                    Sign up with Google
                  </BentoButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </>
  );
}

// bento.me/signup: claim a handle, then create the account. The widget cloud
// floats during the first step and snaps into its grid on the second.
export default function SignupContent({
  initialHandle = '',
}: {
  initialHandle?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(initialHandle ? 'account' : 'handle');
  const [dir, setDir] = useState<Direction>(1);
  const [handle, setHandle] = useState(initialHandle);
  const narrow = useMediaQuery('(max-width: 579px)');

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) goToOwnPage(router);
      });
  }, [router]);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <motion.div
        className="flex min-h-screen flex-col items-center will-change-transform"
        animate={{ opacity: 1, transition: { ease: [0.62, 0.03, 0.31, 0.99], duration: 1 } }}
      >
        <div className="flex min-h-screen w-full max-w-[1728px] flex-col p-7 sm:p-16 lg:flex-row">
          <div className="relative flex max-w-[675px] flex-1 flex-col items-center">
            <div className="absolute top-0 flex h-full w-full max-w-[448px] flex-col">
              <AnimatePresence mode="wait" initial={false} custom={{ dir, narrow }}>
                <StepFrame key={step} custom={{ dir, narrow }}>
                  {step === 'handle' ? (
                    <HandleStep
                      value={handle}
                      setValue={setHandle}
                      onNext={() => {
                        setDir(1);
                        setStep('account');
                      }}
                    />
                  ) : (
                    <AccountStep
                      handle={handle}
                      onBack={() => {
                        setDir(-1);
                        setStep('handle');
                      }}
                    />
                  )}
                </StepFrame>
              </AnimatePresence>
            </div>
          </div>
          <SignUpAnimation state={step === 'handle' ? 'gas' : 'solid'} />
        </div>
      </motion.div>
    </div>
  );
}
