import React from 'react';
import { Marquee } from '../ui';

const logos = [
  {
    img: '/home/logo-marquee/webflow.svg',
    alt: 'Webflow',
  },
  {
    img: '/home/logo-marquee/reddit.svg',
    alt: 'Reddit',
  },
  {
    img: '/home/logo-marquee/buymeacoffee.svg',
    alt: 'Buy Me a Coffee',
  },
  {
    img: '/home/logo-marquee/twitch.svg',
    alt: 'Twitch',
  },
  {
    img: '/home/logo-marquee/behance.svg',
    alt: 'Behance',
  },
  {
    img: '/home/logo-marquee/pinterest.svg',
    alt: 'Pinterest',
  },
  {
    img: '/home/logo-marquee/dev.svg',
    alt: 'DEV',
  },
  {
    img: '/home/logo-marquee/mastodon.svg',
    alt: 'Mastodon',
  },
  {
    img: '/home/logo-marquee/producthunt.svg',
    alt: 'Product Hunt',
  },
  {
    img: '/home/logo-marquee/discord.svg',
    alt: 'Discord',
  },
  {
    img: '/home/logo-marquee/medium.svg',
    alt: 'Medium',
  },
];

function LogoMarqueeHeading() {
  return (
    <>
      <div className="mx-auto mb-4 flex items-center justify-center">
        <h2 className="text-xl font-normal text-black">And many more</h2>
      </div>
    </>
  );
}

function LogoCard({ img, alt }: { img: string; alt: string }) {
  return (
    <div className="flex size-10 items-center justify-center transition-all">
      <img
        src={img}
        alt={alt}
        className="h-full w-full rounded-lg object-contain"
      />
    </div>
  );
}

export function LogoMarquee() {
  return (
    <>
      <div className="mb-28 md:mb-52">
        <LogoMarqueeHeading />
        <div className="relative mx-auto flex w-full max-w-80 flex-col items-center justify-center overflow-hidden sm:max-w-lg">
          <Marquee className="[--duration:20s] [--gap:0.5rem]">
            {logos.map((logo, index) => (
              <LogoCard key={index} {...logo} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </>
  );
}
