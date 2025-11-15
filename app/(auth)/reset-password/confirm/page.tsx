import { Suspense } from 'react';
import { ConfirmResetPasswordContent } from '@/components/auth/confirm-reset-password-content';

export default function ConfirmResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmResetPasswordContent />
    </Suspense>
  );
}
