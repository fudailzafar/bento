'use server';

import { SignupCallbackClient } from '@/components/auth';
import React, { Suspense } from 'react';

export default async function SignupCallbackPage() {
  return (
    <Suspense>
      <SignupCallbackClient />
    </Suspense>
  );
}
