import React from 'react';
import { Input } from '../ui';
import { LoaderIcon } from '../icons';

interface ResetPasswordContentProps {
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  message: string;
}

export default function ResetPasswordContent({
  handleSubmit,
  email,
  setEmail,
  isLoading,
  message,
}: ResetPasswordContentProps) {
  return (
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
  );
}
