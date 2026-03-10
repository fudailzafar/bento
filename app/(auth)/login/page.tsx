'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogInAnimation, LoginContent } from '@/components/auth';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Check if user has started typing (credentials mode)
  const hasCredentials = email.length > 0 || password.length > 0;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetch('/api/username')
          .then((res) => res.json())
          .then((data) => {
            router.push(data.username ? `/${data.username}` : '/upload');
          });
      }
    });
  }, [router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (hasCredentials && email && password) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError('Invalid email or password');
        } else {
          const usernameRes = await fetch('/api/username');
          const usernameData = await usernameRes.json();
          router.push(
            usernameData.username ? `/${usernameData.username}` : '/upload'
          );
        }
      } else {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 lg:min-h-[100vh] lg:gap-48 lg:px-32">
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
      <LogInAnimation isActive={true} />
    </div>
  );
}
