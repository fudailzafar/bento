'use client';

import { GoogleIcon, LoaderIcon } from '@/components/icons';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.push('/preview');
    }
  }, [session, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] md:min-h-screen flex items-center justify-center px-7 sm:px-6 lg:px-48">
      <div className="w-full space-y-8">
        <div className="text-left">
          <h1 className="text-[29px] lg:text-[32px] font-bold md:font-semibold text-design-black mb-6 md:mb-4">
            Log in to your Portfolio
          </h1>
          <h2 className="text-design-resume font-normal text-xl sm:text-xl">
            Good to have you back!
          </h2>
        </div>

        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full max-w-[440px] flex items-center active:scale-95 transition-all duration-300 ease-out justify-center gap-3 my-10 shadow-lg px-6 sm:px-10 py-5 md:py-3.5 bg-[#1A96EB] hover:bg-[#2a96df] disabled:opacity-70 disabled:cursor-not-allowed text-[#ececec] font-bold tracking-normal text-sm rounded-xl"
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

        <div className="text-left mt-6">
          <Link
            href="/signup"
            className="text-design-resume font-normal text-xs transition-colors"
          >
            or sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
