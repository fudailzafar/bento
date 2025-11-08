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

export default function SignupContent() {
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

  const debouncedUsername = useDebounce(username, 500);
  const hasCredentials = email.length > 0 || password.length > 0;

  useEffect(() => {
    if (session?.user) {
      router.push('/preview');
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
        router.push('/preview');
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
                x: direction === 'forward' ? 0 : -300,
                opacity: direction === 'forward' ? 1 : 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: direction === 'forward' ? -300 : 0,
                opacity: direction === 'forward' ? 0 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                mass: 0.8,
              }}
              className="space-y-4"
            >
              <div className="text-left">
                <h1 className="text-[32px] md:text-[29px] lg:text-[32px] font-extrabold text-design-black mb-4">
                  First, claim your unique link
                </h1>
                <h2 className="text-design-resume font-normal text-xl sm:text-xl mb-20">
                  The good ones are still available!
                </h2>
              </div>

              <div className="relative w-full">
                <div className="absolute left-0 top-0 h-12 flex items-center pl-4 text-design-gray text-base pointer-events-none">
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
                  className="w-full h-12 pl-[130px] pr-12 bg-[#F5F5F5] border-0 rounded-lg text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
                />
                {username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checkingUsername ? (
                      <LoaderIcon className="w-4 h-4" />
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

              {/* Fixed height container to prevent layout shift */}
              <div className="min-h-[32px]">
                {username.length >= 3 && !usernameAvailable && (
                  <div className="text-xs text-red-600">
                    This username seems to be taken already... <br /> Try
                    something similar.
                  </div>
                )}
                {username.length < 3 && username.length > 0 && (
                  <div className="text-xs text-red-600">
                    This username seems to be too short... <br /> Try something
                    longer.
                  </div>
                )}
              </div>

              {username.length > 0 ? (
                <button
                  type="button"
                  onClick={handleContinueWithUsername}
                  disabled={
                    !username || username.length < 3 || !usernameAvailable
                  }
                  className="w-full cursor-pointer flex items-center active:scale-95 transition-all duration-300 ease-out justify-center gap-3 px-6 py-5 bg-black hover:bg-black/80 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold tracking-tight text-sm rounded-xl"
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
                  className="invisible w-full cursor-pointer flex items-center active:scale-95 transition-all duration-300 ease-out justify-center gap-3 px-6 py-5 bg-black hover:bg-black/80 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold tracking-tight text-sm rounded-lg"
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
                x: direction === 'forward' ? 300 : 0,
                opacity: direction === 'forward' ? 0 : 1,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: direction === 'forward' ? 0 : 300,
                opacity: direction === 'forward' ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 20,
                mass: 0.8,
              }}
              className="space-y-4"
            >
              <div className="text-left">
                <div>
                  <button type="button" onClick={handleBackToUsername}>
                    <ArrowLeftIcon />
                  </button>
                </div>
                <span className="font-normal text-base">
                  portfoliofy.me/{username} is yours!
                </span>
                <h2 className="text-[29px] lg:text-[32px] font-bold md:font-extrabold text-design-black mb-6 md:mb-4">
                  Now, create your account.
                </h2>
              </div>

              <form onSubmit={handleCredentialsSignup} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full h-12 px-4 bg-[#F5F5F5] border-0 rounded-lg text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
                  />

                  <div className="relative w-full">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full h-12 px-4 pr-[76px] bg-[#F5F5F5] border-0 rounded-lg text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-[60px] flex items-center justify-center bg-white hover:bg-gray-50 text-black text-xs font-semibold rounded shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all active:scale-95"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {hasCredentials && (
                  <>
                    {error && (
                      <div className="text-xs text-red-600">{error}</div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        isLoading || !email || !password || password.length < 6
                      }
                      className="w-full cursor-pointer flex items-center active:scale-95 transition-all duration-300 ease-out justify-center gap-3 px-6 py-3 bg-black hover:bg-black/80 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold tracking-tight text-sm rounded-lg"
                    >
                      {isLoading ? <LoaderIcon /> : 'Create Account'}
                    </button>
                  </>
                )}
              </form>

              <div className="relative">
                <div className="flex justify-start text-sm uppercase text-black font-semibold">
                  OR
                </div>
              </div>

              {!hasCredentials ? (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full flex items-center active:scale-95 transition-all duration-300 ease-out justify-center gap-3 px-6 py-3 bg-design-primary hover:bg-design-primaryDark disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold tracking-tight text-sm rounded-lg"
                  >
                    {isLoading ? (
                      <LoaderIcon />
                    ) : (
                      <>
                        <GoogleIcon />
                        Sign up with Google
                      </>
                    )}
                  </button>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
