'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// bento.me's page for an unclaimed handle (/[handle] with no profile):
// logo, the bento.me/<handle> pill with an "Available!" badge, a short pitch,
// "Claim Handle Now" and the illustration. Animations are from bento's CSS.

// Scrolls the handle like a marquee when it is too long for the pill.
function HandleMarquee({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (outer.current && inner.current) {
      setDistance(inner.current.clientWidth);
      setOverflowing(inner.current.clientWidth > outer.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    if (!overflowing) return;
    const timeout = setTimeout(() => setMoving(true), 3000);
    return () => clearTimeout(timeout);
  }, [overflowing]);

  return (
    <div className={cn('relative', className)} ref={outer}>
      <div className="scrollbar-hide">
        <div
          className={cn(
            'flex items-center space-x-[50px]',
            moving && 'bento-claim-marquee'
          )}
          style={
            {
              '--distance': `${distance}px`,
              '--spacing': '50px',
            } as React.CSSProperties
          }
        >
          {(overflowing ? [0, 1] : [0]).map((i) => (
            <div
              key={i}
              ref={i === 0 ? inner : undefined}
              className="flex items-center"
            >
              {children}
            </div>
          ))}
        </div>
      </div>
      {overflowing && (
        <>
          <div className="absolute -left-0.5 bottom-0 top-0 w-[50px] bg-[linear-gradient(90deg,#fafafa,hsla(0,0%,98%,.98)_11.97%,hsla(0,0%,98%,.926)_21.3%,hsla(0,0%,98%,.844)_28.56%,hsla(0,0%,98%,.741)_34.37%,hsla(0,0%,98%,.624)_39.32%,hsla(0,0%,98%,.5)_44%,hsla(0,0%,98%,.376)_49.02%,hsla(0,0%,98%,.259)_54.96%,hsla(0,0%,98%,.156)_62.44%,hsla(0,0%,98%,.074)_72.04%,hsla(0,0%,98%,.02)_84.36%,hsla(0,0%,98%,0))]" />
          <div className="absolute -right-0.5 bottom-0 top-0 z-10 w-[60px] rounded-[20px] bg-[linear-gradient(270deg,#fafafa,hsla(0,0%,98%,.98)_11.97%,hsla(0,0%,98%,.926)_21.3%,hsla(0,0%,98%,.844)_28.56%,hsla(0,0%,98%,.741)_34.37%,hsla(0,0%,98%,.624)_39.32%,hsla(0,0%,98%,.5)_44%,hsla(0,0%,98%,.376)_49.02%,hsla(0,0%,98%,.259)_54.96%,hsla(0,0%,98%,.156)_62.44%,hsla(0,0%,98%,.074)_72.04%,hsla(0,0%,98%,.02)_84.36%,hsla(0,0%,98%,0))]" />
        </>
      )}
    </div>
  );
}

export default function ClaimUsername({
  username,
  unavailable = false,
}: {
  username: string;
  // Reserved or invalid handles: bento's red "Unavailable" badge, no claim button.
  unavailable?: boolean;
}) {
  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-hidden bg-white">
      <div className="flex-1" />
      <div className="flex flex-col items-center pt-[100px]">
        <div className="bento-claim-peripheral flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-design-primaryLight shadow-[0_13px_9px_rgba(0,0,0,.03),0_8.42593px_5.27083px_rgba(0,0,0,.023),0_5.00741px_2.86667px_rgba(0,0,0,.018),0_2.6px_1.4625px_rgba(0,0,0,.015),0_1.05926px_.733333px_rgba(0,0,0,.012),0_.240741px_.354167px_rgba(0,0,0,.007)]">
          <Image
            src="/icons/android-chrome-192x192.png"
            alt="Bento logo"
            width={42}
            height={42}
            className="h-[42px] w-[42px]"
          />
        </div>

        <div className="bento-claim-url relative mt-10 rounded-2xl border border-black/[.02] bg-[#fafafa]">
          <HandleMarquee className="max-w-[min(85vw,500px)] overflow-hidden whitespace-nowrap">
            <div className="relative flex items-center px-7 py-4 text-2xl font-semibold sm:text-[40px] sm:leading-[52px]">
              <span className="text-[#7d7878]">bento.me/</span>
              <div className="relative overflow-hidden text-black">
                {username}
                <div className="bento-claim-glare absolute -left-[200px] bottom-0 top-0 w-10 rotate-12 bg-white blur-[14px]" />
              </div>
            </div>
          </HandleMarquee>
          <div
            className={`bento-claim-badge absolute right-0 top-0 z-20 -translate-y-1/2 translate-x-6 rotate-2 rounded-md border border-black/[.08] ${unavailable ? 'bg-[#ff2222]' : 'bg-[#4edd76]'} px-3 py-[7px] text-base font-semibold leading-[1.2] text-white shadow-[0_22px_42px_rgba(0,0,0,.05),0_14.2593px_24.5972px_rgba(0,0,0,.038),0_8.47407px_13.3778px_rgba(0,0,0,.03),0_4.4px_6.825px_rgba(0,0,0,.025),0_1.79259px_3.42222px_rgba(0,0,0,.02),0_.407407px_1.65278px_rgba(0,0,0,.012)]`}
          >
            {unavailable ? 'Unavailable' : 'Available!'}
          </div>
        </div>

        <div className="bento-claim-peripheral mt-4 max-w-[288px] text-center text-base leading-6 text-[#7d7878]">
          Bento is the most beautiful link in bio. And it’s all free.{' '}
          <a
            href="/"
            className="text-design-primaryLight underline underline-offset-[3px]"
          >
            Learn more
          </a>
        </div>

        {!unavailable && (
          <a
            href={`/signup?handle=${encodeURIComponent(username)}`}
            className="bento-claim-peripheral relative mt-8 flex h-[54px] select-none items-center overflow-hidden rounded-[10px] bg-design-primaryLight px-2.5 py-2 font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,.06)] [transition:transform_.1s_cubic-bezier(.427,.073,.105,.997),color_.1s_cubic-bezier(.427,.073,.105,.997)] hover:bg-[#6a80f6] active:scale-[.96] active:bg-[#667df5] active:shadow-none"
          >
            <span className="px-2 text-lg">Claim Handle Now</span>
          </a>
        )}
      </div>
      <div className="flex-1" />
      <img
        src="/home/claim-username-desktop.png"
        alt=""
        className="bento-claim-illustration -mb-3 mt-20 hidden max-w-[75%] -rotate-1 lg:block"
      />
      <img
        src="/home/claim-username-mobile.png"
        alt=""
        className="bento-claim-illustration -mb-3 mt-20 max-w-[min(95%,400px)] -rotate-1 lg:hidden"
      />
    </div>
  );
}
