'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AuthAnimation, ResetPasswordConfirmContent } from '@/components/auth';
import { CheckmarkLargeIcon } from '@/components/icons';

function ResetPasswordConfirmContent_Internal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  useEffect(() => {
    // Fetch user email from the reset token
    const fetchUserEmail = async () => {
      if (!token) return;

      try {
        const response = await fetch('/api/auth/get-reset-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (data.email) {
          setUserEmail(data.email);
        }
      } catch (error) {
        console.error('Failed to fetch email:', error);
      }
    };
    fetchUserEmail();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/confirm-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Sign in and redirect after a short delay
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
        <div className="flex w-full max-w-[440px] flex-col items-center justify-center space-y-5 text-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-6 text-[29px] font-bold text-design-black md:mb-4 md:font-semibold lg:text-[32px]">
              <CheckmarkLargeIcon />
            </h1>
            <p className="text-sm font-semibold text-design-black">
              Your password was updated
            </p>
          </div>
          <button
            onClick={async () => {
              try {
                // Sign in with the new password
                if (userEmail && password) {
                  const result = await signIn('credentials', {
                    email: userEmail,
                    password: password,
                    redirect: false,
                  });

                  if (result?.ok) {
                    // Get username after signing in
                    const usernameRes = await fetch('/api/username');
                    const usernameData = await usernameRes.json();
                    if (usernameData.username) {
                      router.push(`/${usernameData.username}`);
                    } else {
                      router.push('/upload');
                    }
                  } else {
                    router.push('/login');
                  }
                } else {
                  router.push('/login');
                }
              } catch {
                router.push('/login');
              }
            }}
            className="mb-2 cursor-pointer rounded-md bg-design-primary px-20 py-3 text-sm font-semibold text-design-white shadow-md transition-all hover:bg-design-primaryDark active:scale-95 sm:px-24"
          >
            Go to my Portfolio
          </button>
        </div>
        <div className="hidden max-w-[700px] flex-1 items-center justify-center md:flex">
          <AuthAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
      <ResetPasswordConfirmContent
        userEmail={userEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isLoading={isLoading}
        error={error}
        token={token}
        handleSubmit={handleSubmit}
      />

      <AuthAnimation />
    </div>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordConfirmContent_Internal />
    </Suspense>
  );
}
