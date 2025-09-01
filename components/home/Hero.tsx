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
          className="w-full bg-design-primary hover:bg-design-primaryDark text-design-white text-center py-5 text-base font-light flex items-center justify-center"
        >
          Big news! Portfoliofy just launched!{' '}
          <ArrowRightIcon width={20} className="text-white" />
        </motion.div>
      </a>
      {/* Main hero section */}
      <Section id="hero" className="min-h-[100vh] w-full overflow-hidden">
        <main className="mx-auto pt-14 sm:pt-24 md:pt-32 text-center relative px-4">
          <div className="relative">
            <motion.div
              initial={{ scale: 4.5, height: '80vh' }}
              animate={{ scale: 1, height: '10vh' }}
              transition={{
                scale: { delay: 0, duration: 1.8, ease: easeInOutCubic },
                height: { delay: 0, duration: 1.8, ease: easeInOutCubic },
              }}
              className="mb-16 relative z-20"
              style={{ transformOrigin: 'top' }}
            >
              <div className="mt-3 sm:-mt-[72px] md:-mt-24 bg-design-primary text-white text-xl font-bold p-0 h-20 w-20 flex items-center justify-center rounded-3xl mx-auto shadow-md">
                <Image
                  src={'/icons/android-chrome-512x512.png'}
                  alt=""
                  width={1}
                  height={1}
                  className="w-auto h-[40px] rounded-xl"
                />
              </div>
            </motion.div>

            {/* Left floating cards */}
            <div className="pointer-events-none hidden lg:block fixed left-0 top-0 w-full h-full">
              {/* ambient glow behind left cluster */}
              <motion.div
                className="absolute left-[1rem] 2xl:left-[3rem] top-[20rem] w-96 h-64 rounded-[50px] -z-20"
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
                className="absolute left-[1.5rem] 2xl:left-[4rem] top-[9rem]"
                style={{ zIndex: 8, y: leftParallax[0], opacity: cardOpacity }}
              >
                <div className="w-56 rounded-3xl bg-white dark:bg-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-6 border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center text-2xl flex-shrink-0">
                      ☕
                    </div>
                    <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
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
                className="absolute left-[0.5rem] 2xl:left-[2rem] top-[18rem]"
                style={{ zIndex: 7, y: leftParallax[1], opacity: cardOpacity }}
              >
                <div className="w-64 rounded-3xl bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-6 border border-white/60 dark:border-neutral-700">
                  <div className="mb-4 rounded-2xl overflow-hidden bg-white/80 h-32 flex items-center justify-center">
                    <Image
                      src="/image.png"
                      alt="preview"
                      width={200}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center text-white text-base flex-shrink-0">
                      ▶
                    </div>
                    <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                      Gadget Reviews
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-red-600 text-white text-xs font-semibold rounded-full hover:bg-red-700 transition-colors">
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
                className="absolute left-[1rem] 2xl:left-[3rem] top-[36rem]"
                style={{ zIndex: 6, y: leftParallax[2], opacity: cardOpacity }}
              >
                <div className="w-52 rounded-3xl bg-white dark:bg-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-6 border border-neutral-100 dark:border-neutral-800">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Computer Museum is partnering
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute inset-0 top-20 z-10 font-semibold text-2xl mt-3"
            >
              Portfoliofy
            </motion.div>
          </div>

          <div className="max-w-5xl mx-auto mt-24">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: easeInOutCubic }}
              className="text-4xl sm:text-6xl font-bold mb-4 tracking-tighter"
            >
              <div className="flex flex-col gap-y-2 sm:gap-y-4">
                <div>A Portfolio.</div>
                <div>But Rich and Beautiful.</div>
              </div>

              {/* Right floating cards - Bento style (spread to screen edges) */}
              <div className="pointer-events-none hidden lg:block fixed right-0 top-0 w-full h-full">
                {/* ambient glow behind right cluster */}
                <motion.div
                  className="absolute right-[1rem] 2xl:right-[3rem] top-[18rem] w-96 h-72 rounded-[50px] -z-20"
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
                  className="absolute right-[0.5rem] 2xl:right-[2rem] top-[21rem]"
                  style={{
                    zIndex: 7,
                    y: rightParallax[1],
                    opacity: cardOpacity,
                  }}
                >
                  <div className="w-64 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] p-5 border border-white/60 dark:border-neutral-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-sky-400 flex items-center justify-center text-white text-xl flex-shrink-0">
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
                    <button className="px-4 py-2 bg-sky-500 text-white text-xs font-semibold rounded-full">
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
                  className="absolute right-[1rem] 2xl:right-[3rem] top-[32rem]"
                  style={{
                    zIndex: 6,
                    y: rightParallax[2],
                    opacity: cardOpacity,
                  }}
                >
                  <div className="w-56 h-40 rounded-3xl bg-white dark:bg-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden border border-neutral-100 dark:border-neutral-800">
                    <Image
                      src="/map.png"
                      alt="preview"
                      width={224}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: easeInOutCubic }}
              className="text-design-gray max-w-2xl mx-auto text-xl sm:text-[22px] mb-8 font-light text-balance mt-7 tracking-tight"
            >
              Your personal page to show your work, skills, and story.
            </motion.p>
          </div>

          <div className="flex flex-col gap-3 mt-16">
            <Link href="/signup">
              <Button
                variant="default"
                className="text-lg rounded-xl shadow-md active:scale-95 transition-all font-semibold py-8 px-20 sm:py-8 sm:px-14 bg-design-primary hover:bg-design-primaryDark cursor-pointer mb-2"
              >
                Create Your Portfolio
              </Button>
            </Link>
            <Link
              href={'/login'}
              className="text-design-gray text-sm sm:text-xs hover:underline"
            >
              Log In
            </Link>
          </div>
        </main>
      </Section>
    </>
  );
}
