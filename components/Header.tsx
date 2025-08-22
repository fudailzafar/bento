import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <>
      <header className="w-full py-4 md:px-0 px-6 flex justify-between items-center max-w-4xl mx-auto h-[67px]">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Brand Logo" className="h-[30px] w-auto" />
        </Link>

        <div>
          <SignedIn>
            {/* User is signed in */}
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex flex-row gap-3 font-mono ">
              <a
                href="https://github.com/fudailzafar"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className=" flex flex-row gap-1.5 py-2 px-4 border-gray-300 text-design-gray text-sm font-medium cursor-pointer"
                >
                  <img
                    src="/github.svg"
                    alt="Github Logo"
                    className="size-[14px]"
                  />
                  <span>Github</span>
                </Button>
              </a>
              <Link href="/upload">
                <Button
                  variant="default"
                  className="text-sm font-medium py-2 px-4 bg-black hover:bg-black/65 cursor-pointer"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </SignedOut>
        </div>
      </header>
    </>
  );
}
