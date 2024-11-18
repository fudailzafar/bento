'use client';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <SignIn path="/login" routing="path" afterSignInUrl="/preview" />
      </div>
    </>
  );
}
