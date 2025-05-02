import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-28 sm:py-72 px-6  mt-auto border-gray-200 ">
      <div className="max-w-4xl justify-between items-center mx-auto w-full flex flex-col gap-2">
        <Image
          src={'/favicon.ico'}
          alt=""
          width={50}
          height={50}
          className="mb-1"
        />

        <div className="text-xs sm:text-sm text-design-gray font-normal mb-20 leading-5 tracking-tighter">
          Designed in Chennai. Built for Professionals.
        </div>

        <div className="flex flex-col sm:flex-row text-center leading-5 tracking-tight items-center justify-center font-normal text-xs sm:text-sm text-design-gray gap-9">
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
            href="/terms-of-service"
            className=""
          >
            <span className="hover:underline">Terms of Service</span>
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
            href="privacy-policy"
            className=""
          >
            <span className="hover:underline">Privacy Policy</span>
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
