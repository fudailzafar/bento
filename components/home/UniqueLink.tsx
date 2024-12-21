'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { MailIcon } from 'lucide-react';

export default function UniqueLink() {
  return (
    <section className="flex flex-col items-center justify-center py-16 mb-24">
      {/* Headline */}
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2">
        Your unique link.
      </h2>
      <p className="text-center text-design-black font-light text-base mb-6 md:mb-16">
        And btw, the good ones are still free.
      </p>

      {/* Link cloud with floating cards */}
      <div className="relative w-full flex justify-center items-center">
        <div className="relative bg-[#F6F6F6] rounded-2xl shadow-lg w-[300px] sm:w-[900px] h-[200px] sm:h-[480px] flex items-center justify-center mx-auto overflow-hidden">
          {/* Username marquee and URL layout */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-row w-full h-full items-center justify-center p-4 md:px-12">
            {/* portfoliofy.me/ on the left */}
            <div
              className="flex flex-col items-end justify-center pr-2"
              style={{ minWidth: '320px' }}
            >
              <div className="text-2xl md:text-5xl font-normal text-gray-400 mb-2 whitespace-nowrap">
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
        <div className="hidden absolute -top-12 left-48 bg-[#F5FAFE] rounded-2xl shadow-lg p-4 w-56 md:flex flex-col gap-2 border border-gray-100 rotate-[-10deg] z-20">
          <div className="flex items-center gap-2">
            <TwitterLogoIcon width={24} height={24} className="text-blue-500" />
            <span className="font-semibold">Twitter</span>
          </div>
          <span className="text-gray-500 text-sm">@fudailzafar</span>
          <button className="bg-blue-500 cursor-default text-white rounded-full px-3 py-1 text-xs font-semibold mt-2">
            Follow
          </button>
        </div>

        {/* Floating Substack card - top right, rotated, overlapping */}
        <div className="hidden md:flex absolute top-16 right-40 bg-[#FFF6F2] rounded-2xl shadow-lg p-4 w-56 flex-col gap-2 border border-gray-100 rotate-[10deg] z-20">
          <div className="flex items-center gap-2">
            <MailIcon size={24} className="text-orange-500" />
            <span className="font-semibold">Email Subscription</span>
          </div>
          <button className="bg-orange-500 cursor-default text-white rounded-full px-3 py-1 text-xs font-semibold mt-2">
            Subscribe
          </button>
        </div>

        {/* Floating Spotify card - bottom left, rotated, overlapping */}
        <div className="hidden absolute -bottom-7 left-96 bg-[#F6FEF9] rounded-2xl shadow-lg p-4 w-72 md:flex gap-2 border border-gray-100 rotate-[7deg] z-20">
          <GitHubLogoIcon className='text-black' width={40} height={40}/>
          <div>
            <div className="text-sm font-medium mb-1">
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
    <div className="relative mb-14 mt-4 md:-mt-[1px] w-full">
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
            className="absolute font-normal text-2xl md:text-5xl left-1/2 top-0 w-full text-black"
          >
            {phrase}
          </motion.div>
        );
      })}
    </div>
  );
};
