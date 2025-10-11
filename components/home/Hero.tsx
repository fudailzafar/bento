'use client';

import { useEffect, useState } from 'react';
import { easeInOutCubic } from '@/lib';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Section } from '@/components/ui';
import { ArrowRightIcon } from '@/components/icons';

export function Hero() {
  const { scrollY } = useScroll({
    offset: ['start start', 'end start'],
  });
  const y1 = useTransform(scrollY, [0, 300], [100, 0]);
  const y2 = useTransform(scrollY, [0, 300], [50, 0]);
  const y3 = useTransform(scrollY, [0, 300], [0, 0]);
  const y4 = useTransform(scrollY, [0, 300], [50, 0]);
  const y5 = useTransform(scrollY, [0, 300], [100, 0]);

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

  // play animation only on first visit per user (localStorage flag)
  const [playAnim, setPlayAnim] = useState(false);
  useEffect(() => {
    try {
      const seen = localStorage.getItem('heroAnimated');
      if (!seen) {
        setPlayAnim(true);
        localStorage.setItem('heroAnimated', '1');
      }
    } catch (e) {
      // ignore (SSR safety)
      setPlayAnim(true);
    }
  }, []);

  return (
    <>
      {/* Top banner section */}
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
      {/* Main hero section */}
      <Section id="hero" className="min-h-[100vh] w-full overflow-hidden">
        <main className="relative mx-auto px-4 pt-14 text-center sm:pt-24 md:pt-32">
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
              <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-design-primary p-0 text-xl font-bold text-white shadow-md sm:-mt-[72px] md:-mt-24">
                <Image
                  src={'/icons/android-chrome-512x512.png'}
                  alt=""
                  width={1}
                  height={1}
                  className="h-[40px] w-auto rounded-xl"
                />
              </div>
            </motion.div>

            {/* Left floating cards */}
            <div className="pointer-events-none fixed left-0 top-0 hidden h-full w-full lg:block">
              {/* ambient glow behind left cluster */}
              <motion.div
                className="absolute left-[1rem] top-[20rem] -z-20 h-64 w-96 rounded-[50px] 2xl:left-[3rem]"
                style={{
                  background:
                    'radial-gradient(closest-side, rgba(253,224,235,0.3), rgba(255,255,255,0) 70%)',
                  filter: 'blur(50px)',
                  opacity: cardOpacity,
                }}
              />

              {/* Top card - "Support my art" style */}
              <motion.div
                initial={
                  playAnim
                    ? { x: -350, y: -80, rotate: -15, opacity: 0 }
                    : { x: 0, y: 0, rotate: -8, opacity: 1 }
                }
                animate={{ x: 0, y: 0, rotate: -8, opacity: 1 }}
                transition={
                  playAnim
                    ? {
                        delay: 0.35,
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        mass: 0.8,
                      }
                    : { duration: 0 }
                }
                className="absolute left-[1.5rem] top-[9rem] 2xl:left-[4rem]"
                style={{ zIndex: 8, y: leftParallax[0], opacity: cardOpacity }}
              >
                <div className="w-56 rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl">
                      ☕
                    </div>
                    <div className="text-base font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                      Support my designs
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Middle card - "Gadget Reviews" with image */}
              <motion.div
                initial={
                  playAnim
                    ? { x: -350, y: 20, rotate: -12, opacity: 0 }
                    : { x: 0, y: 0, rotate: -4, opacity: 1 }
                }
                animate={{ x: 0, y: 0, rotate: -4, opacity: 1 }}
                transition={
                  playAnim
                    ? {
                        delay: 0.47,
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        mass: 0.8,
                      }
                    : { duration: 0 }
                }
                className="absolute left-[0.5rem] top-[18rem] 2xl:left-[2rem]"
                style={{ zIndex: 7, y: leftParallax[1], opacity: cardOpacity }}
              >
                <div className="w-64 rounded-3xl border border-white/60 bg-gradient-to-br from-pink-100 to-pink-50 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:border-neutral-700 dark:from-pink-900/30 dark:to-pink-800/20">
                  <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-white/80">
                    <Image
                      src="/image.png"
                      alt="preview"
                      width={200}
                      height={120}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-600 text-base text-white">
                      ▶
                    </div>
                    <div className="text-base font-semibold leading-tight text-neutral-900 dark:text-neutral-100">
                      Gadget Reviews
                    </div>
                  </div>
                  <button className="rounded-full bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-700">
                    Subscribe 304k
                  </button>
                </div>
              </motion.div>

              {/* Bottom card - simple text card */}
              <motion.div
                initial={
                  playAnim
                    ? { x: -350, y: 120, rotate: -8, opacity: 0 }
                    : { x: 0, y: 0, rotate: -2, opacity: 1 }
                }
                animate={{ x: 0, y: 0, rotate: -2, opacity: 1 }}
                transition={
                  playAnim
                    ? {
                        delay: 0.59,
                        type: 'spring',
                        stiffness: 100,
                        damping: 20,
                        mass: 0.8,
                      }
                    : { duration: 0 }
                }
                className="absolute left-[1rem] top-[36rem] 2xl:left-[3rem]"
                style={{ zIndex: 6, y: leftParallax[2], opacity: cardOpacity }}
              >
                <div className="w-52 rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Computer Museum is partnering
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute inset-0 top-20 z-10 mt-3 text-2xl font-semibold"
            >
              Portfoliofy
            </motion.div>
          </div>

          <div className="mx-auto mt-24 max-w-5xl">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: easeInOutCubic }}
              className="mb-4 text-4xl font-bold tracking-tighter sm:text-6xl"
            >
              <div className="flex flex-col gap-y-2 sm:gap-y-4">
                <div>A Portfolio.</div>
                <div>But Rich and Beautiful.</div>
              </div>

              {/* Right floating cards - Bento style (spread to screen edges) */}
              <div className="pointer-events-none fixed right-0 top-0 hidden h-full w-full lg:block">
                {/* ambient glow behind right cluster */}
                <motion.div
                  className="absolute right-[1rem] top-[18rem] -z-20 h-72 w-96 rounded-[50px] 2xl:right-[3rem]"
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(219,234,254,0.3), rgba(255,255,255,0) 70%)',
                    filter: 'blur(50px)',
                    opacity: cardOpacity,
                  }}
                />

                {/* Middle card - "My Tweets" */}
                <motion.div
                  initial={
                    playAnim
                      ? { x: 350, y: 0, rotate: 12, opacity: 0 }
                      : { x: 0, y: 0, rotate: 4, opacity: 1 }
                  }
                  animate={{ x: 0, y: 0, rotate: 4, opacity: 1 }}
                  transition={
                    playAnim
                      ? {
                          delay: 0.57,
                          type: 'spring',
                          stiffness: 100,
                          damping: 20,
                          mass: 0.8,
                        }
                      : { duration: 0 }
                  }
                  className="absolute right-[0.5rem] top-[21rem] 2xl:right-[2rem]"
                  style={{
                    zIndex: 7,
                    y: rightParallax[1],
                    opacity: cardOpacity,
                  }}
                >
                  <div className="w-64 rounded-3xl border border-white/60 bg-gradient-to-br from-blue-100 to-blue-50 p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:border-neutral-700 dark:from-blue-900/30 dark:to-blue-800/20">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-400 text-xl text-white">
                        🐦
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          My Tweets
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          @chloez
                        </div>
                      </div>
                    </div>
                    <button className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-white">
                      Follow 12k
                    </button>
                  </div>
                </motion.div>

                {/* Bottom card - Image card */}
                <motion.div
                  initial={
                    playAnim
                      ? { x: 350, y: 100, rotate: 8, opacity: 0 }
                      : { x: 0, y: 0, rotate: 2, opacity: 1 }
                  }
                  animate={{ x: 0, y: 0, rotate: 2, opacity: 1 }}
                  transition={
                    playAnim
                      ? {
                          delay: 0.69,
                          type: 'spring',
                          stiffness: 100,
                          damping: 20,
                          mass: 0.8,
                        }
                      : { duration: 0 }
                  }
                  className="absolute right-[1rem] top-[32rem] 2xl:right-[3rem]"
                  style={{
                    zIndex: 6,
                    y: rightParallax[2],
                    opacity: cardOpacity,
                  }}
                >
                  <div className="h-40 w-56 overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] dark:border-neutral-800 dark:bg-neutral-900">
                    <Image
                      src="/map.png"
                      alt="preview"
                      width={224}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: easeInOutCubic }}
              className="mx-auto mb-8 mt-7 max-w-2xl text-balance text-xl font-light tracking-tight text-design-gray sm:text-[22px]"
            >
              Your personal page to show your work, skills, and story.
            </motion.p>
          </div>

          <div className="mt-16 flex flex-col gap-3">
            <Link href="/signup">
              <Button
                variant="default"
                className="mb-2 cursor-pointer rounded-xl bg-design-primary px-20 py-8 text-lg font-semibold shadow-md transition-all hover:bg-design-primaryDark active:scale-95 sm:px-14 sm:py-8"
              >
                Create Your Portfolio
              </Button>
            </Link>
            <Link
              href={'/login'}
              className="text-sm text-design-gray hover:underline sm:text-xs"
            >
              Log In
            </Link>
          </div>
        </main>
      </Section>
    </>
  );
}
