'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BentoButton,
  BentoInput,
  GoogleIcon,
  PasswordInput,
  fade,
} from './bento-ui';

export type LoginMethod = 'credentials' | 'google';

interface LoginContentProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogle: () => void;
  loggingIn?: LoginMethod;
  error?: string;
  clearError: () => void;
}

// Left column of bento.me/login. Typing an email swaps "OR" + Google for the
// black "Log in" button, exactly like bento.
export default function LoginContent({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onGoogle,
  loggingIn,
  error,
  clearError,
}: LoginContentProps) {
  const hasEmail = !!email;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center">
      <div className="flex w-full max-w-[448px] flex-col">
        <h1 className="mt-2 text-[32px] font-semibold leading-10 text-black">
          Log in to your Bento
        </h1>
        <p className="mt-4 text-xl leading-9 text-[#6c6c6c]">
          Good to have you back!
        </p>

        <form className="flex flex-col" onSubmit={onSubmit}>
          <div className="mt-20 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <BentoInput
              className="flex-1"
              autoFocus
              placeholder="Email address"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
            />
            <PasswordInput
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
            />
          </div>

          <div className="ml-0.5 mt-2">
            <Link
              href={`/reset-password?email=${encodeURIComponent(email)}`}
              className="text-xs text-design-primaryLight underline"
            >
              Reset Password
            </Link>
          </div>

          <div className="relative ml-0.5 flex h-16">
            <AnimatePresence mode="wait">
              {!error && !hasEmail && (
                <motion.div
                  key="or"
                  {...fade}
                  className="flex h-full items-center text-sm font-semibold"
                >
                  OR
                </motion.div>
              )}
              {error && (
                <motion.div
                  key="error"
                  {...fade}
                  className="flex h-full flex-col items-start justify-center"
                >
                  <p className="text-xs text-[#ff2222]">{error}</p>
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
                    loading={loggingIn === 'credentials'}
                    disabled={!!loggingIn}
                  >
                    Log in
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
                    loading={loggingIn === 'google'}
                    disabled={!!loggingIn}
                    onClick={onGoogle}
                  >
                    Sign in with Google
                  </BentoButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <Link href="/signup" className="ml-0.5 mt-8 text-xs text-[#6c6c6c]">
          or sign up
        </Link>
      </div>
    </div>
  );
}
