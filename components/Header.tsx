import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <>
      <header className="w-full py-4 md:px-0 px-6 flex justify-between items-center max-w-4xl mx-auto h-[67px]">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icons/portfolio-logo.png" alt="Brand Logo" className="h-[35px] w-auto" />
        </Link>

        <div>
          <SignedIn>
            {/* User is signed in */}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex flex-row gap-3">
              <Link href="/signup">
                <Button
                  variant="default"
                  className="text-sm font-medium py-2 px-4 bg-black hover:bg-black/65 cursor-pointer"
                >
                  Create Your Portfolio
                </Button>
              </Link>
              <Button variant={'ghost'}>
                <Link href={'/login'} className="text-design-gray">
                  Log In
                </Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      </header>
    </>
  );
}
