import Image from 'next/image';
import Link from 'next/link';
import SignupContent from './SignupContent';

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
            Already have an account? Log in
          </Link>
        </div>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center">
        <Image
          src="/home/cv-home.png"
          width={450}
          height={450}
          alt="Portfolio Home Illustration"
          className="max-w-[430px] w-full h-auto object-contain rounded-2xl"
        />
      </div>
    </div>
  );
}
