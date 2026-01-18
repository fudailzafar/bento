'use client';

import { useState } from 'react';
import { AuthAnimation, FloatingWidgetsGrid } from '@/components/auth';
import ResetPasswordContent from '@/components/auth/reset-password-content';
import { MailIcon } from '@/components/icons';

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
      <div className="flex min-h-[90vh] items-center justify-center gap-12 px-7 lg:min-h-screen lg:justify-between lg:gap-16 lg:px-32">
        <div className="flex w-full max-w-[440px] flex-col items-center space-y-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-design-primary">
            <MailIcon />
          </div>

          <div className="space-y-1">
            <h1 className="text-sm font-semibold text-design-black">
              Check your Email
            </h1>
            <p className="text-sm font-light text-design-resume/95">
              We sent a link to change your password to <br />
              <span className="text-sm text-black">{sentToEmail}</span>.
            </p>
          </div>

          <div className="flex w-full max-w-[330px] flex-col gap-3">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#F5F5F5] px-28 py-3 text-sm font-medium text-design-black transition-all duration-300 ease-out active:scale-95"
            >
              Open Gmail
            </a>
            <a
              href="https://outlook.live.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-[#F5F5F5] px-28 py-3 text-sm font-medium text-design-black transition-all duration-300 ease-out active:scale-95"
            >
              Open Outlook
            </a>
          </div>
        </div>

        <div className="hidden max-w-[700px] flex-1 items-center justify-center lg:flex">
          <FloatingWidgetsGrid isActive={true} />
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

      <FloatingWidgetsGrid isActive={true} />
    </div>
  );
}
