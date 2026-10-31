'use client';

import {
  bentoBlurEase,
  bentoEase,
  bentoLoginEase,
  bentoScrollEase,
} from '@/lib';
import { useMediaQuery } from '@/hooks';
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Timings, offsets and curves mirror bento.me's landing page interactions
// ("New Hero Appear" on load, "New Hero Fade Out" and "NavBar Appear" on scroll).

const LOGO_SRC = '/icons/android-chrome-512x512.png';

// Function transforms keep opacity off framer's accelerated scroll timeline,
// which ignores the clamped/eased range we need here.
function scrollOpacity(
  p: number,
  start: number,
  end: number,
  from: number,
  to: number,
  ease: (t: number) => number = (t) => t
) {
  const t = Math.min(Math.max((p - start) / (end - start), 0), 1);
  return from + (to - from) * ease(t);
}

// The landing page fades this in on scroll; other pages (e.g. /jointheteam)
// show it from the start and link back home.
export function HomeNavbar({
  alwaysVisible = false,
  href = '#',
}: {
  alwaysVisible?: boolean;
  href?: string;
}) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, (p) =>
    scrollOpacity(p, 0.1, 0.24, 0, 1)
  );

  return (
    <motion.div
      style={alwaysVisible ? undefined : { opacity }}
      className="fixed top-0 z-[2] flex w-full p-8 max-[479px]:hidden"
    >
      <a href={href} className="block">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-design-primary">
          <Image
            src={LOGO_SRC}
            alt="Bento logo"
            width={64}
            height={64}
            className="h-5 w-auto"
          />
        </div>
      </a>
    </motion.div>
  );
}

const CARD_SHADOW =
  'shadow-[0_49px_74px_rgba(0,0,0,.02),0_32px_43px_rgba(0,0,0,.02),0_19px_24px_rgba(0,0,0,.02),0_10px_12px_rgba(0,0,0,.01),0_4px_6px_rgba(0,0,0,.01),0_1px_3px_rgba(0,0,0,.01)]';

interface HeroCard {
  src: string;
  width: number;
  height: number;
  position: string;
  // Rotation the card starts from on load and settles at.
  rotateFrom: number;
  rotate: number;
  delay: number;
  duration: number;
  // Where the card drifts to (and its extra rotation) by 12% page scroll.
  scrollX: number;
  scrollY: number;
  scrollRotate: number;
}

const HERO_CARDS: HeroCard[] = [
  {
    src: '/home/bento/hero-buymeacoffee.png',
    width: 175,
    height: 175,
    position: 'top-[60px] left-[-300px]',
    rotateFrom: 24,
    rotate: 3,
    delay: 1.4,
    duration: 1.2,
    scrollX: -130,
    scrollY: -170,
    scrollRotate: 20,
  },
  {
    src: '/home/bento/hero-verge.png',
    width: 390,
    height: 175,
    position: 'bottom-[350px] left-[-540px]',
    rotateFrom: -20,
    rotate: -2,
    delay: 1.5,
    duration: 1.4,
    scrollX: -90,
    scrollY: 0,
    scrollRotate: -10,
  },
  {
    src: '/home/bento/hero-youtube.png',
    width: 175,
    height: 175,
    position: 'bottom-[240px] left-[-380px]',
    rotateFrom: 30,
    rotate: 3,
    delay: 1.6,
    duration: 1.4,
    scrollX: -110,
    scrollY: 140,
    scrollRotate: 30,
  },
  {
    src: '/home/bento/hero-substack.png',
    width: 175,
    height: 390,
    position: 'top-[180px] right-[-440px]',
    rotateFrom: -30,
    rotate: -3,
    delay: 1.7,
    duration: 1.4,
    scrollX: 100,
    scrollY: -180,
    scrollRotate: -15,
  },
  {
    src: '/home/bento/hero-twitter.png',
    width: 175,
    height: 175,
    position: 'bottom-[200px] right-[-370px]',
    rotateFrom: 16,
    rotate: 3,
    delay: 1.8,
    duration: 1.4,
    scrollX: 150,
    scrollY: 130,
    scrollRotate: 10,
  },
];

function FloatingCard({
  card,
  progress,
  scrollEnabled,
}: {
  card: HeroCard;
  progress: MotionValue<number>;
  scrollEnabled: boolean;
}) {
  const x = useTransform(progress, [0, 0.12], [0, card.scrollX], {
    ease: bentoScrollEase,
  });
  const y = useTransform(progress, [0, 0.12], [0, card.scrollY], {
    ease: bentoScrollEase,
  });
  const rotate = useTransform(
    progress,
    [0, 0.12],
    [0, card.scrollRotate - card.rotate]
  );

  return (
    <motion.div
      aria-hidden
      style={scrollEnabled ? { x, y, rotate } : undefined}
      className={`pointer-events-none absolute max-[479px]:hidden ${card.position}`}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: card.rotateFrom }}
        animate={{ scale: 1, opacity: 1, rotate: card.rotate }}
        transition={{
          delay: card.delay,
          duration: card.duration,
          ease: bentoEase,
        }}
        className={`rounded-[28px] bg-white ${CARD_SHADOW}`}
      >
        <Image
          src={card.src}
          alt=""
          width={card.width}
          height={card.height}
          priority
          style={{ width: card.width, height: card.height }}
        />
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { scrollYProgress } = useScroll();
  // bento only runs the scroll fade-out on its "main" breakpoint (>= 992px).
  const scrollEnabled = useMediaQuery('(min-width: 992px)');

  const contentY = useTransform(scrollYProgress, [0, 0.12], [0, -70], {
    ease: bentoScrollEase,
  });
  const contentOpacity = useTransform(scrollYProgress, (p) =>
    scrollOpacity(p, 0, 0.12, 1, 0, bentoScrollEase)
  );
  const headingWeight = useTransform(
    scrollYProgress,
    [0, 0.12],
    [700, 900],
    { clamp: true }
  );
  const headingVariation = useTransform(
    headingWeight,
    (w) => `"wght" ${Math.round(w)}`
  );

  return (
    <div className="-mt-20 flex h-[200vh] min-h-[1900px] w-full flex-col items-center justify-start max-[479px]:mt-0 max-[479px]:h-screen max-[479px]:min-h-0">
      <motion.div
        style={
          scrollEnabled ? { y: contentY, opacity: contentOpacity } : undefined
        }
        className="sticky top-0 flex h-screen flex-col items-center justify-center max-[479px]:relative max-[479px]:mt-[60px] max-[479px]:h-auto max-[479px]:min-h-[600px]"
      >
        {HERO_CARDS.map((card) => (
          <FloatingCard
            key={card.src}
            card={card}
            progress={scrollYProgress}
            scrollEnabled={scrollEnabled}
          />
        ))}

        <motion.div
          initial={{ scale: 2, rotate: -40, opacity: 0, filter: 'blur(8px)' }}
          animate={{ scale: 1, rotate: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.8, duration: 2, ease: bentoEase }}
          className="flex h-20 w-20 items-center justify-center rounded-[22px] bg-design-primary max-[479px]:h-16 max-[479px]:w-16 max-[479px]:rounded-[18px]"
        >
          <Image
            src={LOGO_SRC}
            alt="Bento logo"
            width={128}
            height={128}
            priority
            className="h-10 w-auto max-[479px]:h-8"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, filter: 'blur(16px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.4, duration: 2, ease: bentoEase }}
          className="mb-2.5 mt-4 text-2xl font-semibold leading-8 text-black"
        >
          Bento
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 2,
            ease: bentoEase,
            filter: { duration: 2, ease: bentoBlurEase },
          }}
          style={{
            fontVariationSettings: scrollEnabled ? headingVariation : '"wght" 700',
          }}
          className="my-6 max-w-[760px] text-center text-[60px] font-bold leading-[72px] tracking-[-2px] text-black max-[479px]:px-6 max-[479px]:text-[37px] max-[479px]:leading-[48px] max-[479px]:tracking-normal"
        >
          A Link in Bio.
          <br />
          But Rich and Beautiful.
        </motion.h1>

        <motion.h3
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 2, ease: bentoEase }}
          className="flex text-center text-[22px] font-light leading-10 text-[#636363] max-[479px]:px-6 max-[479px]:text-xl max-[479px]:leading-7"
        >
          Your personal page to show everything you are and create.
        </motion.h3>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 2, ease: bentoEase }}
          className="mt-16 max-[479px]:w-screen max-[479px]:px-6"
        >
          <CreateYourBentoButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1.4, ease: bentoLoginEase }}
          className="mt-4"
        >
          <Link
            href="/login"
            className="block text-xs text-[#747474] transition-all duration-200 [transition-timing-function:cubic-bezier(.52,.02,.25,1)] hover:underline active:scale-90 active:text-[#5a5a5a] max-[479px]:text-sm"
          >
            Log In
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function CreateYourBentoButton() {
  return (
    <Link
      href="/signup"
      className="flex min-w-[300px] justify-center rounded-[14px] bg-design-primaryLight px-6 py-5 shadow-[0_2px_4px_rgba(0,0,0,.1)] transition-all duration-200 [transition-timing-function:cubic-bezier(.532,.003,.094,.997)] hover:bg-design-primaryDark active:scale-[.98] active:bg-[#576ddf] active:shadow-none max-[479px]:min-w-0"
    >
      <span className="text-lg font-semibold leading-[22px] text-white max-[479px]:leading-6">
        Create Your Bento
      </span>
    </Link>
  );
}
