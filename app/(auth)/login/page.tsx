'use client';

import { GoogleIcon, LoaderIcon } from '@/components/icons';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

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
      router.push('/preview');
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
          router.push('/preview');
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
    <div className="min-h-[90vh] md:min-h-screen flex items-center justify-center px-7 sm:px-6 lg:px-48">
      <div className="w-full max-w-[440px] space-y-8 mx-auto">
        <div className="text-left">
          <h1 className="text-[29px] lg:text-[32px] font-bold md:font-semibold text-design-black mb-6 md:mb-4">
            Log in to your Portfolio
          </h1>
          <h2 className="text-design-resume font-normal text-xl sm:text-xl">
            Good to have you back!
          </h2>
        </div>

        {/* Single Form */}
        <form onSubmit={handleSubmit} className="pt-10  space-y-8">
          {/* Two Column Layout on Desktop */}
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

          {/* OR Divider - only show when not in credentials mode */}
          {!hasCredentials ? (
            <div className="relative">
              <div className="flex justify-start text-sm uppercase text-black font-semibold">
                OR
              </div>
            </div>
          ) : (
            <>
              {error ? (
                <div className="text-xs text-design-secondary">{error}</div>
              ) : (
                <div className="invisible flex justify-start text-sm uppercase text-black font-semibold text-left">
                  <Link
                    href="/reset-password"
                    className="text-[#5B68F4] text-sm font-normal hover:underline"
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
              className="w-full cursor-pointer flex items-center active:scale-95 transition-all duration-300 ease-out justify-center gap-3 px-6 py-3 bg-black hover:bg-black/80 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold tracking-tight text-sm rounded-lg"
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
              className="w-full flex items-center active:scale-95 transition-all duration-300 ease-out justify-center gap-3 px-6 py-3 bg-design-primary hover:bg-design-primaryDark disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold tracking-tight text-sm rounded-lg"
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

        <div className="text-left mt-6">
          <Link
            href="/signup"
            className="text-design-resume font-normal text-xs transition-colors"
          >
            or sign up
          </Link>
        </div>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center">
        <Image
          src="/home/cv-home.png"
          width={450}
          height={450}
          alt="Portfolio Home Illustration"
          className="max-w-[430px] w-full h-auto object-contain rounded-2xl"
        />
      </div>
    </div>
  );
}
