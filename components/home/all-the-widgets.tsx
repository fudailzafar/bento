'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LogoMarquee } from './logo-marquee';

// Layout, hover/press transforms and scroll offsets mirror bento.me's
// "all the widgets" section ("Widget Columns Appear" scroll interaction).

const W = '/home/bento';

const LINK_BASE =
  'relative block rounded-[28px] transition-all [transition-duration:240ms] [transition-timing-function:cubic-bezier(.31,.026,0,.997)]';

const LINK_VARIANTS = {
  // .link-block-1
  wide: 'w-[390px] cursor-pointer shadow-[0_2px_2px_rgba(0,0,0,.04)] hover:[transform:rotate(-2deg)] active:[transform:scale(.97)]',
  // .link-block-2
  tall: 'flex w-[175px] cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,.04)] hover:[transform:rotate(2deg)] active:[transform:scale(.97)]',
  // .link-block-3
  small:
    'w-[175px] cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,.04)] hover:[transform:rotate(3deg)] active:[transform:scale(.96)]',
  // .link-block-338
  wideShort:
    'w-[390px] shadow-[0_2px_4px_rgba(0,0,0,.04)] hover:[transform:rotate(-1deg)] active:[transform:scale(.96)]',
} as const;

type Variant = keyof typeof LINK_VARIANTS;

function Widget({
  href,
  src,
  width,
  height,
  variant,
  children,
}: {
  href: string;
  src: string;
  width: number;
  height: number;
  variant: Variant;
  children?: React.ReactNode;
}) {
  return (
    <a href={href} className={cn(LINK_BASE, LINK_VARIANTS[variant])}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        style={{ width, height }}
        className="block"
      />
      {children}
    </a>
  );
}

// Decorative grey placeholder tiles that pad the columns (.div-block-36-fake / -empty).
function Placeholder({ n, hidden }: { n: 1 | 2 | 3; hidden?: boolean }) {
  return (
    <div className={cn('w-[175px] rounded-[28px]', hidden && 'opacity-0')}>
      <Image
        src={`${W}/placeholderwidget${n}.png`}
        alt=""
        width={175}
        height={175}
        style={{ width: 175, height: 175 }}
        className="block"
      />
    </div>
  );
}

function SpotifyExtras() {
  return (
    <>
      <span className="bento-spotify-pulse absolute left-[34px] top-[34px] h-5 w-5 rounded-full bg-[#1ed760]" />
      <img src={`${W}/note.svg`} alt="" className="bento-note-1 absolute" />
      <img src={`${W}/note.svg`} alt="" className="bento-note-2 absolute" />
      <img src={`${W}/note.svg`} alt="" className="bento-note-3 absolute" />
      <img
        src={`${W}/spotifylogo.png`}
        alt=""
        className="absolute left-[13.7%] top-[6.1%] h-10 w-10 rounded-[10px]"
      />
    </>
  );
}

function LocationPin() {
  return (
    <>
      <span className="bento-location-pulse absolute left-1/2 top-1/2 h-[26px] w-[26px] cursor-pointer rounded-full bg-[#5871ff]" />
      <img
        src={`${W}/location.png`}
        alt=""
        width={26}
        className="absolute left-1/2 top-1/2 -translate-x-[13px] -translate-y-[13px] cursor-pointer rounded-full shadow-[0_4px_24px_rgba(0,0,0,.3)]"
      />
    </>
  );
}

function FigmaWidget({ mobile }: { mobile?: boolean }) {
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <>
      <a
        href="https://www.figma.com/community/file/1121065701252736567"
        onPointerEnter={(e) => {
          setPos({ x: e.clientX, y: e.clientY });
          setHovering(true);
        }}
        onPointerMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
        onPointerLeave={() => setHovering(false)}
        className={cn(
          'relative block h-[67px] w-[390px] cursor-none overflow-hidden rounded-3xl shadow-[0_2px_4px_rgba(0,0,0,.04)] transition-all [transition-duration:240ms] [transition-timing-function:cubic-bezier(.31,.026,0,.997)] hover:[transform:rotate(-2deg)] active:[transform:scale(.96)]',
          mobile &&
            'h-auto w-full overflow-visible rounded-[28px]'
        )}
      >
        <Image
          src={`${W}/figmawidget.png`}
          alt=""
          width={390}
          height={67}
          className={cn('block h-full w-full cursor-none', mobile && 'h-auto')}
        />
      </a>
      {hovering && <FigmaCursor x={pos.x} y={pos.y} />}
    </>
  );
}

function FigmaCursor({ x, y }: { x: number; y: number }) {
  // Portaled so the transformed widget columns don't trap `position: fixed`.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed left-0 top-0 z-[1000] block max-[767px]:hidden"
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
    >
      <img src={`${W}/figma-cursor.png`} alt="" width={28} className="relative block" />
      <motion.img
        src={`${W}/figma-cursor-chat.png`}
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5, ease: [0.368, 0.009, 0.117, 0.997] }}
        className="absolute -bottom-[34px] -right-[46px] h-[38px] w-auto max-w-none"
      />
    </div>,
    document.body
  );
}

function WidgetsHeading() {
  return (
    <div className="flex max-w-[64%] flex-col items-center gap-6 max-[991px]:max-w-none max-[991px]:px-6 max-[479px]:w-full max-[479px]:gap-2 max-[479px]:px-0">
      <div className="relative">
        <h2 className="m-0 flex w-[930px] justify-center text-center text-[60px] font-bold leading-[68px] text-black max-[479px]:w-full max-[479px]:text-[40px] max-[479px]:leading-[48px]">
          Your Videos. Podcasts. Newsletters. Photos. Paid&nbsp;Products.
          Streams. Calendar.
          <br />
        </h2>
        <div className="absolute -bottom-[3%] left-0 right-0 h-full bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,.82)_64%,#fff_90%,#fff)]" />
      </div>
      <p className="mb-2.5 mt-5 w-[780px] text-center text-[30px] font-light leading-[46px] text-[#333] max-[991px]:w-full max-[479px]:mt-0 max-[479px]:text-[26px] max-[479px]:leading-10">
        All your content integrated into your personal page.
        <br />
        No more hiding your content behind links.
      </p>
    </div>
  );
}

function DesktopColumns() {
  const { scrollYProgress } = useScroll();
  const col1 = useTransform(scrollYProgress, [0, 0.46], [300, 0]);
  const col2 = useTransform(scrollYProgress, [0, 0.46], [30, 0]);
  const col3 = useTransform(scrollYProgress, [0, 0.46], [700, 0]);
  const col4 = useTransform(scrollYProgress, [0, 0.46], [270, 0]);

  const column = 'relative flex flex-col gap-10 max-[479px]:hidden';

  return (
    <div className="flex gap-10 max-[479px]:w-full">
      <motion.div style={{ y: col1 }} className={column}>
        <Widget
          href="https://jannabarrett.medium.com"
          src={`${W}/tallmediumwidget.png`}
          width={175}
          height={390}
          variant="tall"
        />
        <Placeholder n={2} />
        <Widget
          href="https://open.spotify.com/episode/776Sr5qTjunPv2dNkQoODq"
          src={`${W}/tallspotifywidget.png`}
          width={175}
          height={390}
          variant="tall"
        >
          <SpotifyExtras />
        </Widget>
      </motion.div>

      <motion.div style={{ y: col2 }} className={column}>
        <div className="flex justify-end">
          <Placeholder n={1} />
        </div>
        <Widget
          href="#"
          src={`${W}/bigtextwidget.png`}
          width={390}
          height={390}
          variant="wide"
        />
        <Widget
          href="#"
          src={`${W}/bigcalendlywidget.png`}
          width={390}
          height={390}
          variant="wide"
        />
        <Widget
          href="/home/mugeeb"
          src={`${W}/mediumphotowidget.png`}
          width={390}
          height={175}
          variant="wideShort"
        />
        <div className="flex justify-end">
          <Widget
            href="https://apps.apple.com/de/app/camcord-vlog-your-story/id6443458187"
            src={`${W}/appstorewidget.png`}
            width={175}
            height={175}
            variant="small"
          />
        </div>
      </motion.div>

      <motion.div style={{ y: col3 }} className={column}>
        <Widget
          href="https://www.youtube.com/@Oliur/videos"
          src={`${W}/bigyoutubewidget.png`}
          width={390}
          height={390}
          variant="wide"
        />
        <Widget
          href="https://github.com/CompVis/stable-diffusion"
          src={`${W}/githubwidget.png`}
          width={390}
          height={175}
          variant="wideShort"
        />
        <Widget
          href="https://www.theverge.com/23298275/apple-severance-ben-stiller-ratings-viewers-emmys"
          src={`${W}/biglinkpreviewwidget.png`}
          width={390}
          height={390}
          variant="wide"
        />
        <Widget
          href="https://www.google.com/maps/place/Berlin"
          src={`${W}/mapswidget.png`}
          width={390}
          height={390}
          variant="wide"
        >
          <LocationPin />
        </Widget>
        <FigmaWidget />
      </motion.div>

      <motion.div style={{ y: col4 }} className={column}>
        <Placeholder n={3} />
        <Placeholder n={3} hidden />
        <Widget
          href="https://www.instagram.com/rogie/"
          src={`${W}/instagramwidget.png`}
          width={175}
          height={390}
          variant="tall"
        />
        <Placeholder n={3} hidden />
        <Widget
          href="https://www.producthunt.com/posts/bento-7"
          src={`${W}/producthuntwidget.png`}
          width={175}
          height={175}
          variant="small"
        />
      </motion.div>

      <MobileColumn />
    </div>
  );
}

function MobileTile({
  href,
  src,
  width,
  height,
  wide,
}: {
  href: string;
  src: string;
  width: number;
  height: number;
  wide?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn(
        'relative block w-full rounded-[28px]',
        wide
          ? 'shadow-[0_2px_2px_rgba(0,0,0,.04)]'
          : 'shadow-[0_2px_4px_rgba(0,0,0,.04)]'
      )}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className="block h-auto w-full"
      />
    </a>
  );
}

// .column-5: the stacked layout bento shows below 480px.
function MobileColumn() {
  return (
    <div className="hidden w-full flex-col gap-6 max-[479px]:flex">
      <MobileTile
        href="https://www.youtube.com/watch?v=I1qsF0WQy8c"
        src={`${W}/bigyoutubewidget-mobile.png`}
        width={390}
        height={390}
        wide
      />
      <div className="flex w-full gap-6">
        <div className="flex flex-1 flex-col gap-6">
          <MobileTile
            href="https://twitter.com/sdw/status/1544742309077684230"
            src={`${W}/tallmediumwidget-mobile.png`}
            width={175}
            height={390}
          />
          <MobileTile
            href="https://www.patreon.com/KevinNaughtonJr"
            src={`${W}/hero-buymeacoffee.png`}
            width={175}
            height={175}
          />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <MobileTile
            href="https://dribbble.com/Gavin"
            src={`${W}/dribbblewidget.png`}
            width={175}
            height={175}
          />
          <MobileTile
            href="https://open.spotify.com/show/47jQcyRcrM1EoV0sU39N9F"
            src={`${W}/tallspotifywidget.png`}
            width={175}
            height={390}
          />
        </div>
      </div>
      <MobileTile
        href="#"
        src={`${W}/bigcalendlywidget.png`}
        width={390}
        height={390}
        wide
      />
      <MobileTile
        href="/home/mugeeb"
        src={`${W}/mediumphotowidget.png`}
        width={390}
        height={175}
      />
      <FigmaWidget mobile />
    </div>
  );
}

export function AllTheWidgets() {
  return (
    <section
      className="relative mx-auto mt-[180px] flex w-[1680px] max-w-full flex-col items-center justify-center gap-[100px] max-[991px]:w-full max-[991px]:overflow-hidden max-[479px]:mt-[210px] max-[479px]:px-6"
    >
      <WidgetsHeading />
      <DesktopColumns />
      <LogoMarquee />
    </section>
  );
}
