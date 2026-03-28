import Image from 'next/image';
import Link from 'next/link';

const links = [
  { label: 'Log In', href: '/login' },
  { label: 'About', href: '/fudail' },
  { label: 'Explore', href: '/explore' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  {
    label: 'Download Brand Assets',
    href: 'https://drive.google.com/file/d/1sAd1Cyi2ujw0d5DVAG6HTjUssr6NE9KY/view?usp=sharing',
  },
];

export function Footer() {
  return (
    <footer className="mx-auto flex w-[1680px] max-w-full flex-col items-center justify-start gap-6 pb-[280px] pt-[240px] text-sm leading-5 max-[479px]:py-[110px]">
      <Image
        src={'/icons/android-chrome-192x192.png'}
        alt="portfoliofy logo"
        width={44}
        height={44}
      />
      <div className="relative m-0 flex justify-center text-left text-sm font-normal leading-5 text-[#6f6f6f] max-[479px]:px-6 max-[479px]:text-xs">
        Designed in Berlin. Built for Creatives.
      </div>
      <div className="mt-[50px] flex items-center justify-center gap-8 max-[479px]:flex-col">
        {links.map((link) => (
          <Link
            key={link.label}
            target="_blank"
            rel="noopener noreferrer"
            href={link.href}
            className="text-[#6f6f6f] no-underline transition-all [transition-duration:240ms] [transition-timing-function:cubic-bezier(.409,.02,.25,1)] hover:underline active:scale-[.92] active:text-[#4b4b4b] max-[479px]:text-xs"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
