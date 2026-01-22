'use client';

import { useState } from 'react';
import { SignUpAnimation, SignupContent } from '@/components/auth';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<'username' | 'auth'>(
    'username'
  );

  return (
    <div className="flex min-h-[90vh] items-center justify-center gap-12 px-7 sm:px-6 md:min-h-screen lg:gap-16 lg:px-32">
      <div className="w-full max-w-[440px] space-y-8">
        <SignupContent onStepChange={setCurrentStep} />
      </div>
      <SignUpAnimation isActive={currentStep === 'username'} />
    </div>
  );
}
