'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks';

// Mirrors bento.me/jointheteam: team avatars, the photo carousel with its
// speed toggle, the mission card and the "Join us" call to action.

const T = '/jointheteam';
const JOBS_URL =
  'https://bentocompany.notion.site/Get-a-seat-at-the-table-Join-Bento-795b3d1db2424f0bb098690a338313dd';

const team = [
  { name: "Sélim's Bento", href: 'http://bento.me/selim', avatar: `${T}/selim.png`, hoverAll: true },
  { name: "Mugeeb's Bento", href: 'http://bento.me/gumbee', avatar: `${T}/mugeeb.png` },
  { name: "Eike's Bento", href: 'http://bento.me/eike', avatar: `${T}/eike.png` },
  { name: "Valerie's Bento", href: 'http://bento.me/valerie', avatar: `${T}/valerie.png` },
];

type Slide =
  | { kind: 'image'; src: string; rotate: number }
  | { kind: 'video'; rotate: number };

const slides: Slide[] = [
  { kind: 'image', src: `${T}/team.webp`, rotate: -1 },
  { kind: 'image', src: `${T}/img-0027.webp`, rotate: 1 },
  { kind: 'image', src: `${T}/dscf1297.webp`, rotate: -7 },
  { kind: 'image', src: `${T}/img-9592.webp`, rotate: 4 },
  { kind: 'image', src: `${T}/img-8834.webp`, rotate: -6 },
  { kind: 'video', rotate: 4 },
  { kind: 'image', src: `${T}/dscf1281.webp`, rotate: 2 },
];

const FRAME =
  'h-full max-w-none rounded-xl border-8 border-white shadow-[0_6px_14px_rgba(0,0,0,.16)]';

const HEADING =
  'mx-auto mb-16 mt-12 flex w-[560px] max-w-full justify-center text-center text-[38px] font-bold leading-[48px] text-[#333] max-[767px]:px-10 max-[479px]:my-[30px] max-[479px]:px-6 max-[479px]:text-[30px] max-[479px]:leading-10';

function TeamAvatar({
  name,
  href,
  avatar,
  hoverAll,
}: (typeof team)[number]) {
  // bento only animates the first avatar's hover below 992px. Class names are
  // spelled out in full so Tailwind can find them.
  const fade =
    'opacity-0 transition-all [transition-duration:300ms] [transition-timing-function:cubic-bezier(.25,.1,.25,1)]';
  const overlayHover = hoverAll
    ? 'group-hover:opacity-[.48]'
    : 'min-[992px]:group-hover:opacity-[.48]';
  const arrowHover = hoverAll
    ? 'group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100'
    : 'min-[992px]:group-hover:translate-x-0 min-[992px]:group-hover:translate-y-0 min-[992px]:group-hover:opacity-100';
  const labelHover = hoverAll
    ? 'group-hover:opacity-100'
    : 'min-[992px]:group-hover:opacity-100';

  return (
    <a
      href={href}
      className="group relative flex h-16 w-16 flex-col items-center justify-center transition-all duration-200 active:scale-[.96] max-[479px]:h-10 max-[479px]:w-10"
    >
      <img
        src={avatar}
        alt=""
        width={64}
        className="h-full w-full max-w-none rounded-full"
      />
      <div className="absolute h-full w-full rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]" />
      <div
        className={cn(
          fade,
          'absolute h-16 w-16 rounded-full shadow-[inset_0_0_0_100px_#000] max-[479px]:h-10 max-[479px]:w-10',
          overlayHover
        )}
      />
      <img
        src="/home/bento/arrowwhite.svg"
        alt=""
        className={cn(
          fade,
          'absolute -translate-x-0.5 translate-y-0.5',
          arrowHover
        )}
      />
      <div
        className={cn(
          fade,
          'absolute bottom-[114%] mx-auto flex w-auto whitespace-nowrap rounded-full bg-design-primaryLight px-3.5 py-1.5 text-center text-[10px] font-medium leading-[14px] tracking-[.3px] text-white shadow-[0_3px_3px_rgba(0,0,0,.04),0_15px_10px_rgba(0,0,0,.06),0_40px_31px_rgba(0,0,0,.08)] max-[479px]:opacity-0',
          labelHover
        )}
      >
        {name}
      </div>
    </a>
  );
}

function TeamAvatars() {
  return (
    <div className="mx-auto mt-[220px] inline-block max-[479px]:mt-[130px]">
      <div className="relative flex flex-nowrap justify-center gap-4 overflow-visible max-[479px]:gap-3">
        {team.map((member) => (
          <TeamAvatar key={member.href} {...member} />
        ))}
        <img
          src={`${T}/emptyavatar.svg`}
          alt=""
          className="h-16 w-16 opacity-0 max-[479px]:h-10 max-[479px]:w-10"
        />
        <a
          href={JOBS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute -right-[22%] -top-[46%] transition-all [transition-duration:320ms] [transition-timing-function:cubic-bezier(.38,.003,.25,1)] hover:origin-[50px_50px] hover:[transform:rotate(-4deg)] active:[transform:scale(.96)_rotate(-4deg)] max-[479px]:hover:origin-[40px_72px]"
        >
          <img
            src={`${T}/emptyavatardrawing.svg`}
            alt="You?"
            className="relative max-[479px]:w-[92px]"
          />
        </a>
      </div>
    </div>
  );
}

function SlideFrame({ slide }: { slide: Slide }) {
  if (slide.kind === 'video') {
    return (
      <div
        className={cn(
          FRAME,
          'relative w-[480px] shrink-0 overflow-hidden text-white max-[479px]:w-80'
        )}
        style={{ transform: `rotate(${slide.rotate}deg)` }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={`${T}/walk-poster.jpg`}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`${T}/walk.mp4`} type="video/mp4" />
        </video>
      </div>
    );
  }
  return (
    <img
      src={slide.src}
      alt=""
      className={cn(FRAME, 'w-auto shrink-0')}
      style={{ transform: `rotate(${slide.rotate}deg)` }}
    />
  );
}

function PhotoCarousel() {
  const [fast, setFast] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Starts false, so desktop never gets a stale inline opacity from the first render.
  const compact = useMediaQuery('(max-width: 991px)');

  // Below 992px bento shows the speed toggle only while the carousel passes
  // the middle of the viewport ("Fast Button Appear/Hide").
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const toggleOpacity = useTransform(scrollYProgress, (p) =>
    p < 0.46 || p > 0.54 ? 0 : p < 0.48 ? (p - 0.46) / 0.02 : p > 0.52 ? (0.54 - p) / 0.02 : 1
  );

  return (
    <div
      ref={ref}
      className="group relative mx-auto mb-10 flex h-[540px] w-screen max-w-[2000px] flex-col items-start justify-start overflow-hidden py-10 max-[991px]:h-[480px] max-[479px]:mb-6 max-[479px]:h-[330px]"
    >
      <div
        key={fast ? 'fast' : 'slow'}
        className={cn(
          'relative flex h-full w-auto flex-row gap-[30px] overflow-visible pl-[30px]',
          fast ? 'bento-team-carousel-fast' : 'bento-team-carousel'
        )}
      >
        {[...slides, ...slides].map((slide, i) => (
          <SlideFrame key={i} slide={slide} />
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 block w-[400px] bg-[linear-gradient(90deg,#fff,rgba(255,255,255,.94)_12%,rgba(255,255,255,.85)_22%,rgba(255,255,255,.07)_81%,rgba(255,255,255,.03)_91%,rgba(255,255,255,0)_100%,#fff)] max-[479px]:hidden" />
      <div className="absolute inset-y-0 right-0 block w-[400px] rotate-180 bg-[linear-gradient(90deg,#fff,rgba(255,255,255,.94)_12%,rgba(255,255,255,.85)_22%,rgba(255,255,255,0)_100%,#fff)] max-[479px]:hidden" />

      <motion.div
        style={compact ? { opacity: toggleOpacity } : undefined}
        className="absolute right-[6%] top-1/2 flex -translate-y-1/2 flex-col rounded-full opacity-0 shadow-[0_0_0_1px_rgba(0,0,0,.08),0_8px_16px_rgba(0,0,0,.12)] transition-opacity [transition-duration:400ms] [transition-timing-function:cubic-bezier(.292,.015,.38,.997)] min-[992px]:group-hover:opacity-100 max-[479px]:w-14"
      >
        <button
          type="button"
          onClick={() => setFast((f) => !f)}
          aria-label={fast ? 'Slow down the carousel' : 'Speed up the carousel'}
          className="relative mx-auto flex h-14 w-14 max-w-full items-center justify-center rounded-full bg-white p-1.5 text-xl font-medium leading-7 text-black transition-all [transition-duration:240ms] hover:bg-[#e0e0e0] active:scale-[.99] active:bg-[#c2c2c2] max-[479px]:mx-0 max-[479px]:py-2"
        >
          {fast ? '😵‍💫' : '💨'}
        </button>
      </motion.div>
    </div>
  );
}

const CARD = 'absolute cursor-pointer rounded-[28px] shadow-[0_18px_44px_rgba(0,0,0,.06)]';

function MissionCard() {
  return (
    <div className="relative mx-auto mb-2.5 mt-60 flex w-[800px] max-w-full flex-col items-start justify-start gap-5 rounded-[28px] bg-[#fafafa] p-[120px] max-[991px]:w-full max-[991px]:bg-[#fcfcfc] max-[479px]:-mb-[100px] max-[479px]:mt-40 max-[479px]:gap-4 max-[479px]:rounded-[60px] max-[479px]:bg-[#f8f8f8] max-[479px]:px-10 max-[479px]:pb-[72px] max-[479px]:pt-[70px]">
      {[
        'Our mission at Bento is to help bring more creator-led businesses, projects, and creativity to the world.',
        'We believe to be at the cusp of a huge creative revolution - creators should now focus on creating something they care about. We help them focus on their audience and ensure that making a living online becomes easier and more delightful.',
        'Our vision is simple: we believe that the inspiration and collaboration from people sharing their work will lead to greater ideas and creations that will help the world move forward. A Bento is a place for inspiration, engagement, and meaningfully connecting with peers. It’s a place that helps bring the right minds together and spark innovation!',
        'Wanna help the mission? Join the ride!',
      ].map((text) => (
        <p
          key={text}
          className="m-0 flex text-left text-2xl font-light leading-9 text-black max-[479px]:text-[26px] max-[479px]:leading-10"
        >
          {text}
        </p>
      ))}

      <a
        href="#"
        className={`${CARD} -bottom-[7%] -right-[6%] -rotate-[4deg] max-[991px]:-bottom-[12%] max-[991px]:left-[40%] max-[991px]:right-auto max-[767px]:-bottom-[6%] max-[479px]:hidden`}
      >
        <img src={`${T}/githubmediumwidget.png`} alt="" width={390} className="block w-[390px] cursor-default" />
      </a>
      <a
        href="#"
        className={`${CARD} -left-[13%] top-[20%] -rotate-[5deg] max-[991px]:-left-[1%] max-[991px]:-top-[9%] max-[479px]:hidden`}
      >
        <img src={`${T}/twitterwidget2.png`} alt="" width={175} className="block w-[175px] cursor-default" />
      </a>
      <a
        href="#"
        className={`${CARD} -right-[10%] -top-[4%] rotate-[4deg] max-[991px]:-right-[6%] max-[479px]:hidden`}
      >
        <img src={`${T}/substackwidget.png`} alt="" width={175} className="block w-[175px] cursor-default" />
      </a>
    </div>
  );
}

export function JoinTheTeam() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.275, 0.009, 0.322, 0.997] }}
      className="flex w-full flex-col items-center text-sm leading-5 text-[#333]"
    >
      <TeamAvatars />
      <h1 className={HEADING}>The 4 people building Bento. Be number 5.</h1>
      <PhotoCarousel />
      <MissionCard />

      <div className="mx-auto mb-[210px] mt-[140px] flex w-[800px] justify-center max-[991px]:max-w-full max-[991px]:items-center max-[479px]:mb-[130px] max-[479px]:max-w-[100vw] max-[479px]:px-6">
        <a
          href="http://bento.me/2022"
          className="flex gap-2 rounded-lg bg-white px-3 py-1.5 text-xl font-light leading-8 text-[#536ae2] no-underline transition-all [transition-duration:300ms] [transition-timing-function:cubic-bezier(.345,.003,.25,1)] hover:bg-[#fafafa] active:scale-[.97] active:bg-[#f0f0f0] max-[479px]:items-center"
        >
          <span className="max-[479px]:text-lg">Our Founding Story</span>
          <img src={`${T}/chevron.svg`} alt="" />
        </a>
      </div>

      <h2 className={HEADING}>Are you our number 5?</h2>

      <div className="w-full max-[991px]:max-w-[100vw] max-[991px]:px-10 max-[479px]:mb-10 max-[479px]:w-[800px] max-[479px]:max-w-full max-[479px]:px-6">
        <a
          href={JOBS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mx-auto flex w-[800px] max-w-full justify-center rounded-2xl bg-design-primaryLight p-4 text-[28px] font-semibold leading-10 text-white no-underline shadow-[0_3px_6px_rgba(0,0,0,.08)] transition-all [transition-duration:240ms] hover:bg-[#2787db] active:scale-[.99] active:bg-[#1b79ca] active:shadow-[0_1px_2px_rgba(0,0,0,.24)] max-[479px]:mx-0 max-[479px]:w-auto max-[479px]:py-6"
        >
          Join us
        </a>
      </div>
    </motion.div>
  );
}
