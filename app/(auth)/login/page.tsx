'use client';

import { GoogleIcon, LoaderIcon } from '@/components/icons';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { SignupAnimation } from '@/components/auth';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Check if user has started typing (credentials mode)
  const hasCredentials = email.length > 0 || password.length > 0;

  useEffect(() => {
    if (session?.user) {
      fetch('/api/username')
        .then((res) => res.json())
        .then((data) => {
          router.push(data.username ? `/${data.username}` : '/upload');
        });
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // If user has entered credentials, use credentials login
      if (hasCredentials && email && password) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else if (result?.ok) {
          const usernameRes = await fetch('/api/username');
          const usernameData = await usernameRes.json();
          router.push(usernameData.username ? `/${usernameData.username}` : '/upload');
        }
      } else {
        // Otherwise use Google OAuth
        await signIn('google');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-left">
          <h1 className="mb-6 text-[29px] font-bold text-design-black md:mb-4 md:font-semibold lg:text-[32px]">
            Log in to your Portfolio
          </h1>
          <h2 className="text-xl font-normal text-design-resume sm:text-xl">
            Good to have you back!
          </h2>
        </div>

        {/* Single Form */}
        <form onSubmit={handleSubmit} className="space-y-8 pt-10">
          {/* Two Column Layout on Desktop */}
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

          {/* OR Divider - only show when not in credentials mode */}
          {!hasCredentials ? (
            <div className="relative">
              <div className="flex justify-start text-sm font-semibold uppercase text-black">
                OR
              </div>
            </div>
          ) : (
            <>
              {error ? (
                <div className="text-xs text-design-secondary">{error}</div>
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
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-design-primary px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-design-primaryDark active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
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

        <div className="mt-6 text-left">
          <Link
            href="/signup"
            className="text-xs font-normal text-design-resume transition-colors"
          >
            or sign up
          </Link>
        </div>
      </div>

      <div className="hidden max-w-[700px] flex-1 items-center justify-center md:flex">
        <SignupAnimation />
      </div>
    </div>
  );
}
