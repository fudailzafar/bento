'use client';

import { useState } from 'react';
import { AuthAnimation } from '@/components/auth';
import ResetPasswordContent from '@/components/auth/reset-password-content';

export default function ResetPasswordPage() {
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
        <div className="flex w-full max-w-[440px] flex-col items-center space-y-3 text-center">
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

          <div className="flex w-full max-w-[440px] flex-col gap-3">
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

        <div className="hidden max-w-[700px] flex-1 items-center justify-center lg:flex">
          <AuthAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh] items-center justify-between gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
      <ResetPasswordContent
        handleSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        isLoading={isLoading}
        message={message}
      />

      <AuthAnimation />
    </div>
  );
}
