'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { MailIcon } from 'lucide-react';

export function UniqueLink() {
  return (
    <section className="mb-24 flex flex-col items-center justify-center py-16">
      {/* Headline */}
      <h2 className="mb-2 text-center text-2xl font-semibold md:text-3xl">
        Your unique link.
      </h2>
      <p className="mb-6 text-center text-base font-light text-design-black md:mb-16">
        And btw, the good ones are still free.
      </p>

      {/* Link cloud with floating cards */}
      <div className="relative flex w-full items-center justify-center">
        <div className="relative mx-auto flex h-[200px] w-[330px] items-center justify-center overflow-hidden rounded-2xl bg-[#F6F6F6] sm:h-[480px] sm:w-[900px] md:border md:border-gray-100">
          {/* Username marquee and URL layout */}
          <div className="absolute left-0 top-1/2 flex h-full w-full -translate-y-1/2 flex-row items-center justify-center p-4 md:px-12">
            {/* portfoliofy.me/ on the left */}
            <div
              className="flex flex-col items-end justify-center pr-2"
              style={{ minWidth: '320px' }}
            >
              <div className="mb-2 whitespace-nowrap text-[28px] font-normal text-gray-400 md:text-5xl">
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
        <div className="absolute -top-12 left-48 z-20 hidden w-56 rotate-[-10deg] flex-col gap-2 rounded-2xl border border-gray-100 bg-[#F5FAFE] p-4 shadow-lg md:flex">
          <div className="flex items-center gap-2">
            <TwitterLogoIcon width={24} height={24} className="text-blue-500" />
            <span className="font-semibold">Twitter</span>
          </div>
          <span className="text-sm text-gray-500">@fudailzafar</span>
          <button className="mt-2 cursor-default rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
            Follow
          </button>
        </div>

        {/* Floating Substack card - top right, rotated, overlapping */}
        <div className="absolute right-40 top-16 z-20 hidden w-56 rotate-[10deg] flex-col gap-2 rounded-2xl border border-gray-100 bg-[#FFF6F2] p-4 shadow-lg md:flex">
          <div className="flex items-center gap-2">
            <MailIcon size={24} className="text-orange-500" />
            <span className="font-semibold">Email Subscription</span>
          </div>
          <button className="mt-2 cursor-default rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
            Subscribe
          </button>
        </div>

        {/* Floating Spotify card - bottom left, rotated, overlapping */}
        <div className="absolute -bottom-7 left-96 z-20 hidden w-72 rotate-[7deg] gap-2 rounded-2xl border border-gray-100 bg-[#F6FEF9] p-4 shadow-lg md:flex">
          <GitHubLogoIcon className="text-black" width={40} height={40} />
          <div>
            <div className="mb-1 text-sm font-medium">
              Fudail Zafar speaks about his solo career as a engineer
            </div>
          </div>
        </div>
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
