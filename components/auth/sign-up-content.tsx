'use client';

import {
  ArrowLeftIcon,
  CheckmarkSmallIcon,
  CrossIcon,
  GoogleIcon,
  LoaderIcon,
} from '@/components/icons';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function SignupContent({
  onStepChange,
}: { onStepChange?: (step: 'username' | 'auth') => void } = {}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [step, setStep] = useState<'username' | 'auth'>('username');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const debouncedUsername = useDebounce(username, 600);
  const hasCredentials = email.length > 0 || password.length > 0;

  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  useEffect(() => {
    if (session?.user) {
      router.push('/upload');
    }
  }, [session, router]);

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setCheckingUsername(true);
      try {
        const response = await fetch(
          `/api/check-username?username=${debouncedUsername}`
        );

        if (!response.ok) {
          console.error('Username check failed:', response.status);
          setUsernameAvailable(null);
          return;
        }

        const data = await response.json();
        console.log('Username check response:', data);
        setUsernameAvailable(data.available);
      } catch (error) {
        console.error('Username check error:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    setUsername(sanitized);
  };

  const handleContinueWithUsername = () => {
    if (username.length >= 3 && usernameAvailable) {
      setDirection('forward');
      setStep('auth');
    }
  };

  const handleBackToUsername = () => {
    setDirection('backward');
    setStep('username');
  };

  const handleGoogleSignup = async () => {
    if (!username || !usernameAvailable) {
      setError('Please select a valid username first');
      return;
    }

    setIsLoading(true);
    await signIn('google', {
      callbackUrl: `/signup/callback?username=${username}`,
    });
  };

  const handleCredentialsSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!usernameAvailable) {
        setError('Please choose an available username');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but login failed. Please try logging in.');
      } else if (result?.ok) {
        router.push('/upload');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {step === 'username' ? (
            <motion.div
              key="username"
              custom={direction}
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: -20,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="space-y-4"
            >
              <div className="text-left">
                <h1 className="mb-4 text-[32px] font-bold text-design-black">
                  First, claim your unique link
                </h1>
                <h2 className="mb-20 text-xl font-light text-design-resume sm:text-xl">
                  The good ones are still available!
                </h2>
              </div>

              <div className="relative w-full">
                <div className="pointer-events-none absolute left-0 top-0 flex h-12 items-center pl-4 text-base text-design-gray">
                  portfoliofy.me/
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="your-name"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] pl-[130px] pr-12 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checkingUsername ? (
                      <LoaderIcon className="h-4 w-4" />
                    ) : usernameAvailable ? (
                      <CheckmarkSmallIcon />
                    ) : (
                      <button onClick={() => handleUsernameChange('')}>
                        <CrossIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Show error messages or button based on username state */}
              {username.length > 0 && username.length < 3 ? (
                <div className="flex w-full items-center justify-start rounded-lg py-3.5 text-xs font-light text-red-600">
                  This username seems to be too short... <br /> Try something
                  longer.
                </div>
              ) : username.length >= 3 &&
                !usernameAvailable &&
                !checkingUsername ? (
                <div className="flex w-full items-center justify-start rounded-lg py-3.5 text-xs font-light text-red-600">
                  This username seems to be taken already... <br /> Try
                  something similar.
                </div>
              ) : username.length > 0 ? (
                <button
                  type="button"
                  onClick={handleContinueWithUsername}
                  disabled={
                    !username || username.length < 3 || !usernameAvailable
                  }
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-black px-6 py-3.5 text-sm font-medium tracking-tight text-white transition-all duration-300 ease-out hover:bg-black/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Grab my Link
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleContinueWithUsername}
                  disabled={
                    !username || username.length < 3 || !usernameAvailable
                  }
                  className="invisible flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-black px-6 py-3.5 text-sm font-bold tracking-tight text-white transition-all duration-300 ease-out hover:bg-black/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Grab my Link
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              custom={direction}
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 20,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="space-y-6"
            >
              <div className="space-y-2 text-left">
                <div className="mb-6">
                  <button type="button" onClick={handleBackToUsername}>
                    <ArrowLeftIcon />
                  </button>
                </div>
                <p className="text-base font-normal text-design-black">
                  portfoliofy.me/{username} is yours!
                </p>
                <h2 className="text-[32px] font-bold leading-tight text-design-black md:text-[48px] lg:text-[32px]">
                  Now, create your account.
                </h2>
              </div>

              <form
                onSubmit={handleCredentialsSignup}
                className="space-y-6 pt-8"
              >
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />

                  <div className="relative w-full">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 pr-[76px] text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 flex h-8 w-[60px] -translate-y-1/2 items-center justify-center rounded bg-white text-xs font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:bg-gray-50 active:scale-95"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}

                <div
                  className={clsx(
                    'relative py-2 transition-opacity duration-200',
                    hasCredentials
                      ? 'invisible opacity-0'
                      : 'visible opacity-100'
                  )}
                >
                  <div className="flex justify-start text-base font-bold text-black">
                    OR
                  </div>
                </div>

                <button
                  type={hasCredentials ? 'submit' : 'button'}
                  onClick={hasCredentials ? undefined : handleGoogleSignup}
                  disabled={
                    hasCredentials
                      ? isLoading || !email || !password || password.length < 6
                      : isLoading
                  }
                  className={clsx(
                    'flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ease-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-70',
                    hasCredentials
                      ? 'bg-black hover:bg-black/80'
                      : 'bg-design-primary hover:bg-design-primaryDark'
                  )}
                >
                  {isLoading ? (
                    <LoaderIcon />
                  ) : hasCredentials ? (
                    'Create Account'
                  ) : (
                    <>
                      <GoogleIcon />
                      Sign up with Google
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
