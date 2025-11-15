import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto w-full border-gray-200 px-6 py-28 sm:py-72">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-2">
        <Image
          src={'/icons/apple-touch-icon.png'}
          alt="portfoliofy logo"
          width={50}
          height={50}
          className="mb-1"
        />

        <div className="mb-20 text-xs font-normal leading-5 tracking-tighter text-design-gray sm:text-sm">
          Designed in Chennai. Built for Professionals.
        </div>

        <div className="flex flex-col items-center justify-center gap-9 text-center text-xs font-normal leading-5 tracking-tight text-design-gray sm:flex-row sm:text-sm">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="/login"
            className=""
          >
            <span className="hover:underline">Log In</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="/fudail"
            className=""
          >
            <span className="hover:underline">About</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="explore"
            className=""
          >
            <span className="hover:underline">Explore</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="/terms-of-service"
            className=""
          >
            <span className="hover:underline">Terms of Service</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="privacy-policy"
            className=""
          >
            <span className="hover:underline">Privacy Policy</span>
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://drive.google.com/file/d/1sAd1Cyi2ujw0d5DVAG6HTjUssr6NE9KY/view?usp=sharing"
            className=""
          >
            <span className="hover:underline">Download Brand Assets</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
