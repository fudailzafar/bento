'use client';

import { easeInOutCubic } from '@/lib';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Section } from '@/components/ui';
import { ArrowRightIcon } from '@/components/icons';

function HeroBanner() {
  return (
    <>
      <a
        href="https://portfoliofy.me/fudail"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: easeInOutCubic }}
          className="flex w-full items-center justify-center bg-design-primary py-5 text-center text-base font-light text-design-white hover:bg-design-primaryDark"
        >
          Big news! Portfoliofy just launched!{' '}
          <ArrowRightIcon width={20} className="text-white" />
        </motion.div>
      </a>
    </>
  );
}

function HeroLogo() {
  return (
    <>
      <div className="relative">
        <motion.div
          initial={{ scale: 4.5, height: '80vh' }}
          animate={{ scale: 1, height: '10vh' }}
          transition={{
            scale: { delay: 0, duration: 1.8, ease: easeInOutCubic },
            height: { delay: 0, duration: 1.8, ease: easeInOutCubic },
          }}
          className="relative z-20 mb-16"
          style={{ transformOrigin: 'top' }}
        >
          <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-design-primary p-0 text-xl font-bold text-white shadow-md sm:-mt-[72px] md:mt-0 md:p-4">
            <Image
              src={'/icons/android-chrome-512x512.png'}
              alt="Portfoliofy logo"
              width={1}
              height={1}
              className="h-[40px] w-auto rounded-xl"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute inset-0 top-20 z-10 mt-3 text-2xl font-semibold md:top-24 md:mt-0 md:text-xl"
        >
          Bento
        </motion.div>
      </div>
    </>
  );
}

function HeroSubHeading() {
  return (
    <>
      <div className="mx-auto mt-24 max-w-5xl md:mt-0">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: easeInOutCubic }}
          className="mb-4 text-4xl font-bold tracking-tighter md:space-y-3 md:py-6 md:text-6xl md:leading-none md:tracking-tight"
        >
          {/* Mobile layout: 3 lines */}
          <div className="flex flex-col gap-y-2 tracking-normal md:hidden">
            <div>A Link in Bio.</div>
            <div>But Rich and </div>
            <div>Beautiful. </div>
          </div>
          {/* Desktop layout: 2 lines */}
          <div className="hidden md:block">
            <div>A Link in Bio.</div>
            <div>But Rich and Beautiful.</div>
          </div>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: easeInOutCubic }}
          className="mx-auto mb-8 mt-7 max-w-2xl text-balance text-xl font-light tracking-[-0.5px] text-design-gray sm:text-[22px] md:mt-0 md:text-design-resume"
        >
          Your personal page to show everything you are and create.
        </motion.p>
      </div>
    </>
  );
}

function HeroButtons() {
  return (
    <>
      <div className="mt-16 flex flex-col gap-3 md:pb-14">
        <Link href="/signup">
          <Button
            variant="default"
            className="mb-2 w-[327px] cursor-pointer rounded-xl bg-design-primary px-20 py-8 text-lg font-semibold shadow-md transition-all hover:bg-design-primaryDark active:scale-95 sm:px-20 sm:py-8 md:w-auto md:rounded-[14px] md:px-14 lg:h-[62px] lg:w-[300px]"
          >
            Create Your Bento
          </Button>
        </Link>
        <Link
          href={'/login'}
          className="text-sm text-design-gray hover:underline sm:text-xs"
        >
          Log In
        </Link>
      </div>
    </>
  );
}

function HeroAnimationMobile() {
  const { scrollY } = useScroll({
    offset: ['start start', 'end start'],
  });
  const y1 = useTransform(scrollY, [0, 300], [100, 0]);
  const y2 = useTransform(scrollY, [0, 300], [50, 0]);
  const y3 = useTransform(scrollY, [0, 300], [0, 0]);
  const y4 = useTransform(scrollY, [0, 300], [50, 0]);
  const y5 = useTransform(scrollY, [0, 300], [100, 0]);
  return (
    <>
      <div className="hidden h-auto select-none flex-nowrap items-center justify-center gap-4 sm:h-[500px] sm:gap-1 md:flex">
        <motion.img
          src="/home/Device-1.png"
          alt="iPhone showcase 1"
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ y: y1 }}
          transition={{ duration: 1, delay: 1 }}
          className="h-[333px] w-40 flex-shrink-0 sm:h-[500px] sm:w-72"
        />
        <motion.img
          src="/home/Device-2.png"
          alt="iPhone showcase 2"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ y: y2 }}
          transition={{ duration: 1, delay: 1 }}
          className="h-[333px] w-40 flex-shrink-0 sm:h-[500px] sm:w-72"
        />
        <motion.img
          src="/home/Device-3.png"
          alt="iPhone showcase 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ y: y3 }}
          transition={{ duration: 1, delay: 1 }}
          className="h-[333px] w-40 flex-shrink-0 sm:h-[500px] sm:w-72"
        />
        <motion.img
          src="/home/Device-4.png"
          alt="iPhone showcase 4"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ y: y4 }}
          transition={{ duration: 1, delay: 1 }}
          className="h-[333px] w-40 flex-shrink-0 sm:h-[500px] sm:w-72"
        />
        <motion.img
          src="/home/Device-5.png"
          alt="iPhone showcase 5"
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ y: y5 }}
          transition={{ duration: 1, delay: 1 }}
          className="h-[333px] w-40 flex-shrink-0 sm:h-[500px] sm:w-72"
        />
      </div>
    </>
  );
}

interface HeroCard {
  id: string;
  src: string;
  width: number;
  height: number;
}

const LEFT_CARDS: HeroCard[] = [
  { id: 'support', src: '/home/all-the-widgets/buymeacoffee-mobile.png', width: 500, height: 500 },
  { id: 'verge', src: '/home/all-the-widgets/theverge.png', width: 1170, height: 1170 },
  { id: 'youtube', src: '/home/all-the-widgets/youtube-mobile.png', width: 500, height: 500 },
];

const RIGHT_CARDS: HeroCard[] = [
  { id: 'medium', src: '/home/all-the-widgets/medium-mobile.png', width: 500, height: 1114 },
  { id: 'spotify', src: '/home/all-the-widgets/spotify.png', width: 525, height: 1170 },
  { id: 'calendly', src: '/home/all-the-widgets/calendly-mobile.png', width: 500, height: 500 },
];

function FloatingCard({
  card,
  y,
  opacity,
  className,
}: {
  card: HeroCard;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  className: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1, ease: easeInOutCubic }}
      style={{ y, opacity }}
      className={`pointer-events-none absolute w-32 overflow-hidden rounded-2xl shadow-xl sm:w-44 lg:w-56 ${className}`}
    >
      <Image
        src={card.src}
        alt=""
        width={card.width}
        height={card.height}
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}

function FloatingCards() {
  const { scrollY } = useScroll({
    offset: ['start start', 'end start'],
  });
  // Parallax transforms for floating cards (layered depth)
  const leftParallax = [
    useTransform(scrollY, [0, 500], [0, -130]), // top card moves fastest
    useTransform(scrollY, [0, 500], [0, -90]), // middle card
    useTransform(scrollY, [0, 500], [0, -50]), // bottom card slowest
  ];
  const rightParallax = [
    useTransform(scrollY, [0, 600], [0, -100]),
    useTransform(scrollY, [0, 600], [0, -70]),
    useTransform(scrollY, [0, 600], [0, -35]),
  ];

  // Fade out cards as user scrolls down (disappear when leaving hero)
  const cardOpacity = useTransform(scrollY, [0, 300, 500], [1, 0.5, 0]);

  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      {/* Left: one card top, two overlapping lower */}
      <FloatingCard
        card={LEFT_CARDS[0]}
        y={leftParallax[0]}
        opacity={cardOpacity}
        className="-left-10 top-12 -rotate-6 sm:left-2 sm:top-16 lg:left-10"
      />
      <FloatingCard
        card={LEFT_CARDS[1]}
        y={leftParallax[1]}
        opacity={cardOpacity}
        className="-left-20 top-[22rem] rotate-2 sm:-left-6 sm:top-[26rem] lg:left-2"
      />
      <FloatingCard
        card={LEFT_CARDS[2]}
        y={leftParallax[2]}
        opacity={cardOpacity}
        className="-left-6 top-[30rem] -rotate-3 sm:left-16 sm:top-[34rem] lg:left-24"
      />
      {/* Right: one tall card top, two overlapping lower */}
      <FloatingCard
        card={RIGHT_CARDS[0]}
        y={rightParallax[0]}
        opacity={cardOpacity}
        className="-right-10 top-8 rotate-6 sm:right-2 sm:top-10 lg:right-10"
      />
      <FloatingCard
        card={RIGHT_CARDS[1]}
        y={rightParallax[1]}
        opacity={cardOpacity}
        className="-right-24 top-[26rem] -rotate-3 sm:-right-8 sm:top-[30rem] lg:right-0"
      />
      <FloatingCard
        card={RIGHT_CARDS[2]}
        y={rightParallax[2]}
        opacity={cardOpacity}
        className="-right-4 top-[34rem] rotate-3 sm:right-16 sm:top-[38rem] lg:right-24"
      />
    </div>
  );
}

export function Hero() {
  return (
    <>
      {/* Top banner section */}
      <HeroBanner />
      {/* Main hero section - Unified responsive */}
      <Section
        id="hero"
        className="min-h-[100vh] w-full overflow-hidden md:pb-32"
      >
        <main className="relative mx-auto px-4 pt-14 text-center sm:pt-24 md:pt-16">
          <FloatingCards />
          <HeroLogo />
          <HeroSubHeading />
          <HeroButtons />
          <HeroAnimationMobile />
        </main>
      </Section>
    </>
  );
}
