import ResetPasswordConfirmContent from '@/components/auth/reset-password-confirm';
import { Suspense } from 'react';

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordConfirmContent />
    </Suspense>
  );
}
