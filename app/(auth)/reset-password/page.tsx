'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SignupAnimation } from '@/components/auth';
import { LoaderIcon } from '@/components/icons';

export default function ResetPasswordContentPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSentToEmail(email.toLowerCase());
        setEmailSent(true);
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Reset request error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
        <div className="flex w-full max-w-[660px] flex-col items-center space-y-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-design-primary">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 6L12 13L2 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h1 className="text-sm font-semibold text-design-black">
              Check your Email
            </h1>
            <p className="text-sm font-light text-design-resume">
              We sent a link to change your password to <br />
              <span className="text-sm text-design-black">{sentToEmail}</span>.
            </p>
          </div>

          <div className="flex max-w-[660px] flex-col gap-3">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#F5F5F5] px-28 py-3 text-sm font-medium text-design-black transition-all duration-300 ease-out active:scale-95 md:px-32"
            >
              Open Gmail
            </a>
            <a
              href="https://outlook.live.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#F5F5F5] px-28 py-3 text-sm font-medium text-design-black transition-all duration-300 ease-out active:scale-95 md:px-32"
            >
              Open Outlook
            </a>
          </div>
        </div>

        <div className="hidden max-w-[700px] flex-1 items-center justify-center md:flex">
          <SignupAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
      <div className="w-full max-w-[440px] space-y-8">
        <div className="text-left">
          <h1 className="mb-6 text-[29px] font-bold text-design-black md:mb-4 md:font-semibold lg:text-[32px]">
            Reset your password
          </h1>
          <h2 className="text-xl font-light text-design-resume sm:text-xl">
            To which email should we send the reset link to?
          </h2>
        </div>

        {/* Single Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-10">
          {/* Two Column Layout on Desktop */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-design-black px-6 py-3 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-design-black/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? <LoaderIcon /> : 'Send Reset Link'}
          </button>

          {message && (
            <p className="text-center text-sm text-green-600">{message}</p>
          )}
        </form>
      </div>

      <div className="hidden max-w-[700px] flex-1 items-center justify-center md:flex">
        <SignupAnimation />
      </div>
    </div>
  );
}
