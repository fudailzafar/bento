'use client';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginContent from '@/components/auth/log-in-content';
import { AuthAnimation } from '@/components/auth';

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
          router.push(
            usernameData.username ? `/${usernameData.username}` : '/upload'
          );
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
    <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 lg:gap-16 lg:px-32">
      {/* Login Content Component */}
      <LoginContent
        handleSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isLoading={isLoading}
        hasCredentials={hasCredentials}
        error={error}
      />

      {/* Animation Component */}
      <AuthAnimation />
    </div>
  );
}
