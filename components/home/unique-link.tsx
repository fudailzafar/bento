'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { MailIcon } from 'lucide-react';
import Image from 'next/image';

export function UniqueLink() {
  return (
    <section className="mb-24 flex flex-col items-center justify-center py-16">
      {/* Headline */}
      <h2 className="mb-2 text-center text-2xl font-semibold md:mb-[6px] md:text-[32px]">
        Your unique link.
      </h2>
      <p className="mb-6 text-center text-base font-light text-design-black md:mb-16">
        And btw, the good ones are still free.
      </p>

      {/* Link cloud with floating cards */}
      <div className="relative flex w-full items-center justify-center">
        <div className="relative mx-auto flex h-[200px] w-[330px] items-center justify-center overflow-hidden rounded-2xl bg-[#F8F8F8] sm:h-[496px] sm:w-[1100px] md:rounded-3xl md:border-2 md:border-[#F2F2F2] md:bg-[#FCFCFC]">
          {/* Username marquee and URL layout */}
          <div className="absolute left-0 top-1/2 flex h-full w-full -translate-y-1/2 flex-row items-center justify-center p-4 md:px-12">
            {/* portfoliofy.me/ on the left */}
            <div
              className="flex flex-col items-end justify-center pr-2"
              style={{ minWidth: '320px' }}
            >
              <div className="mb-2 whitespace-nowrap text-[28px] font-normal text-[#AAAAAA] md:text-5xl">
                portfoliofy.me/
              </div>
            </div>
            {/* Vertical marquee on the right, usernames close to slash */}
            <div
              className="relative flex flex-col items-start justify-center"
              style={{ minWidth: '220px' }}
            >
              <AnimatedText
                phrases={[
                  'dennis',
                  'michele',
                  'eike',
                  'may-li',
                  'clara',
                  'tito',
                  'selim',
                  'alex',
                  'jordan',
                  'sam',
                  'lisa',
                  'fudail',
                  'zafar',
                ]}
              />
            </div>
          </div>
        </div>
        {/* Floating Twitter card - top left, rotated, overlapping */}
        <Image
          src="/unique-link/twitter.png"
          alt="Twitter card"
          width={175}
          height={175}
          className="absolute -top-10 left-32 z-20 hidden rotate-[-5deg] rounded-3xl shadow-[0_18px_44px_0_rgba(0,0,0,0.06)] xl:block"
        />

        {/* Floating Substack card - top right, rotated, overlapping */}
        <Image
          src="/unique-link/substack.png"
          alt="Substack card"
          width={175}
          height={175}
          className="absolute right-36 top-20 z-20 hidden rotate-[4deg] rounded-3xl shadow-[0_18px_44px_0_rgba(0,0,0,0.06)] xl:block"
        />

        {/* Floating Spotify card - bottom left, rotated, overlapping */}
        <Image
          src="/unique-link/spotify.png"
          alt="Spotify card"
          width={396}
          height={189}
          className="absolute -bottom-20 left-72 z-20 hidden rotate-[2deg] rounded-3xl shadow-[0_18px_44px_0_rgba(0,0,0,0.06)] xl:block"
        />
      </div>
    </section>
  );
}

const ONE_SECOND = 1000;
const WAIT_TIME = ONE_SECOND * 1;

const AnimatedText = ({ phrases }: { phrases: string[] }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setActive((pv) => (pv + 1) % phrases.length);
    }, WAIT_TIME);

    return () => clearInterval(intervalRef);
  }, [phrases]);

  return (
    <div className="relative mb-14 mt-2 w-full md:-mt-[1px]">
      {phrases.map((phrase) => {
        const isActive = phrases[active] === phrase;
        return (
          <motion.div
            key={phrase}
            initial={false}
            animate={isActive ? 'active' : 'inactive'}
            style={{
              x: '-50%',
            }}
            variants={{
              active: {
                opacity: 1,
                scale: 1,
              },
              inactive: {
                opacity: 0,
                scale: 0,
              },
            }}
            className="absolute left-1/2 top-0 w-full text-[28px] font-normal text-black md:text-5xl"
          >
            {phrase}
          </motion.div>
        );
      })}
    </div>
  );
};
