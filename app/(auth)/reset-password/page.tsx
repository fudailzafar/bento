import { ResetPasswordContent } from '@/components/auth';

// Like bento, /reset-password?email=… prefills the email (login's "Reset
// Password" link passes it) and ?state=expired-token follows an expired link.
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[]; state?: string | string[] }>;
}) {
  const { email, state } = await searchParams;
  const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  return (
    <ResetPasswordContent
      initialEmail={first(email) ?? ''}
      state={first(state) === 'expired-token' ? 'expired-token' : undefined}
    />
  );
}
