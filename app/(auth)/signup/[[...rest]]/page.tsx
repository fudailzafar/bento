'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthAnimation, SignupContent } from '@/components/auth';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<'username' | 'auth'>(
    'username'
  );

  return (
    <div className="flex min-h-[90vh] items-center justify-center gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
      <div className="w-full max-w-[440px] space-y-8">
        <SignupContent onStepChange={setCurrentStep} />

        <div className="mt-6 text-left">
          <Link
            href="/login"
            className="text-xs font-normal text-design-resume transition-colors"
          >
            or log in
          </Link>
        </div>
      </div>

      <AuthAnimation isActive={currentStep === 'username'} />
    </div>
  );
}
