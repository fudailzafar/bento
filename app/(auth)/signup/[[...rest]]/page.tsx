import { SignupAnimation, SignupContent } from '@/components/auth';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-[90vh] md:min-h-screen flex items-center justify-center px-7 sm:px-6 lg:px-48">
      <div className="w-full max-w-[440px] space-y-8 mx-auto">
        <SignupContent />

        <div className="text-left mt-6">
          <Link
            href="/login"
            className="text-design-resume font-normal text-xs transition-colors"
          >
            or log in
          </Link>
        </div>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center">
        <SignupAnimation />
      </div>
    </div>
  );
}
