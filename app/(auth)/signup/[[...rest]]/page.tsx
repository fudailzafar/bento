'use client';
import { SignUp } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export default function SignUpPage() {
  const pathname = usePathname();
  const clerkPath = pathname === '/signup' ? '/signup' : '/signup/sso-callback';

  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp path={clerkPath} routing="path" afterSignUpUrl="/upload" />
    </div>
  );
}
