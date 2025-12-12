import React from 'react';
import { Input } from '../ui';
import Link from 'next/link';
import { GoogleIcon, LoaderIcon } from '../icons';

interface LogInPageProps {
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  hasCredentials: boolean;
  error: string;
}

export default function LoginContent({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  hasCredentials,
  error,
}: LogInPageProps) {
  return (
    <div className="w-full max-w-[440px] space-y-8 mx-auto">
      {/* Header for Login */}
      <div className="text-left">
        <h1 className="my-6 text-[28px] font-semibold text-design-black sm:mb-4 lg:text-[32px]">
          Log in to your Portfolio
        </h1>
        <h2 className="text-xl font-normal text-design-resume sm:text-xl">
          Good to have you back!
        </h2>
      </div>

      {/* Authentication Form */}
      <form onSubmit={handleSubmit} className="pt-10">
        {/* Input Fields */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border-0 bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:rounded-lg"
          />

          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 w-full rounded-xl border-0 bg-[#F5F5F5] px-4 pr-[76px] text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 flex h-8 w-[60px] -translate-y-1/2 items-center justify-center rounded bg-white text-xs font-semibold text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-all hover:bg-gray-50 active:scale-95 active:bg-gray-200 active:shadow-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Reset Password Link */}
        <div className="ml-0.5 mt-2">
          <Link
            href="/reset-password"
            className="text-xs font-normal text-design-primaryLight underline"
          >
            Reset Password
          </Link>
        </div>

        {/* OR Divider - only show when not in credentials mode */}
        {!hasCredentials ? (
          <div className="relative">
            <div className="ml-0.5 flex h-[64px] items-center text-sm font-semibold uppercase text-black">
              OR
            </div>
          </div>
        ) : (
          <>
            {error ? (
              <div className="text-xs text-[#ed3a51]">{error}</div>
            ) : (
              <div className="invisible flex justify-start text-left text-sm font-semibold uppercase text-black">
                <Link
                  href="/reset-password"
                  className="text-sm font-normal text-[#5B68F4] hover:underline"
                >
                  Reset Password
                </Link>
              </div>
            )}
          </>
        )}

        {/* Conditional Buttons */}
        {hasCredentials ? (
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-black px-6 py-3 text-sm font-semibold tracking-tight text-white transition-all duration-300 ease-out hover:bg-black/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <LoaderIcon />
              </>
            ) : (
              'Log in'
            )}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1d9bf0] px-6 py-5 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-[#1a96eb] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:py-3 xl:rounded-lg"
          >
            {isLoading ? (
              <>
                <LoaderIcon />
              </>
            ) : (
              <>
                <GoogleIcon />
                Sign in with Google
              </>
            )}
          </button>
        )}
      </form>

      {/* Redirect to Sign Up */}
      <div className="mt-6 text-left">
        <Link
          href="/signup"
          className="text-xs font-normal text-design-resume transition-colors"
        >
          or sign up
        </Link>
      </div>
    </div>
  );
}
