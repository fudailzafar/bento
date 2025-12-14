import React from 'react';
import { Marquee } from '../ui';

export const Logo = () => {
  return (
    <>
      <div className="mb-28 md:mb-52">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <h2 className="text-xl font-normal text-black">And many more</h2>
        </div>
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
};

const logos = [
  {
    img: '/logo/webflow.svg',
    alt: 'Webflow',
  },
  {
    img: '/logo/reddit.svg',
    alt: 'Reddit',
  },
  {
    img: '/logo/buymeacoffee.svg',
    alt: 'Buy Me a Coffee',
  },
  {
    img: '/logo/twitch.svg',
    alt: 'Twitch',
  },
  {
    img: '/logo/behance.svg',
    alt: 'Behance',
  },
  {
    img: '/logo/pinterest.svg',
    alt: 'Pinterest',
  },
  {
    img: '/logo/dev.svg',
    alt: 'DEV',
  },
  {
    img: '/logo/mastodon.svg',
    alt: 'Mastodon',
  },
  {
    img: '/logo/producthunt.svg',
    alt: 'Product Hunt',
  },
  {
    img: '/logo/discord.svg',
    alt: 'Discord',
  },
  {
    img: '/logo/medium.svg',
    alt: 'Medium',
  },
];

const LogoCard = ({ img, alt }: { img: string; alt: string }) => {
  return (
    <div className="flex size-10 items-center justify-center transition-all">
      <img
        src={img}
        alt={alt}
        className="h-full w-full rounded-lg object-contain"
      />
    </div>
  );
};
