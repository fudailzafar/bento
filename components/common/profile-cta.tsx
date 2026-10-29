'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

// bento.me's profile page controls for visitors (not the page owner):
// signed out → "Create Your Bento", "Log In" and Explore; signed in →
// "My Bento" and Explore + Community. Desktop is a floating bar in the
// bottom-left corner; below xl it is a footer under the widgets.

export type ProfileViewer = { username: string; image?: string | null } | null;

const DISCORD_URL = 'https://discord.com';

const TRANSITION =
  '[transition:transform_.1s_cubic-bezier(.427,.073,.105,.997),color_.1s_cubic-bezier(.427,.073,.105,.997)]';
const TRANSPARENT = cn(
  'relative select-none overflow-hidden rounded-xl text-sm font-bold sm:rounded-lg hover:bg-black/[.04] active:scale-[.96] active:bg-black/10',
  TRANSITION
);
const ICON_BUTTON = cn(TRANSPARENT, 'flex !rounded-full h-8 w-8 items-center justify-center');

function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke="#8E8E8E" strokeWidth="2" />
      <path
        d="M6.22695 6.84827L5.68089 9.57858C5.59287 10.0187 5.98088 10.4067 6.42096 10.3187L9.15128 9.7726C9.4625 9.71035 9.70577 9.46708 9.76801 9.15587L10.3141 6.42555C10.4021 5.98546 10.0141 5.59746 9.574 5.68547L6.84368 6.23154C6.53246 6.29378 6.28919 6.53705 6.22695 6.84827Z"
        fill="#8E8E8E"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5535 3.03729C12.5178 2.55271 11.4104 2.20053 10.2526 2C10.1104 2.25707 9.94428 2.60284 9.82974 2.8779C8.599 2.69281 7.37956 2.69281 6.17144 2.8779C6.05693 2.60284 5.88704 2.25707 5.74358 2C4.58454 2.20053 3.47584 2.554 2.44013 3.03985C0.351096 6.19666 -0.215208 9.27505 0.0679444 12.3098C1.45351 13.3444 2.79627 13.973 4.11639 14.3843C4.44232 13.9357 4.73303 13.4588 4.98345 12.9563C4.5065 12.7751 4.04969 12.5514 3.61805 12.2918C3.73256 12.2069 3.84457 12.1182 3.95279 12.0269C6.58546 13.2583 9.44593 13.2583 12.0472 12.0269C12.1566 12.1182 12.2686 12.2069 12.3819 12.2918C11.949 12.5527 11.4909 12.7763 11.0139 12.9576C11.2644 13.4588 11.5539 13.937 11.881 14.3855C13.2024 13.9742 14.5464 13.3457 15.932 12.3098C16.2642 8.79176 15.3644 5.74164 13.5535 3.03729ZM5.34212 10.4434C4.55181 10.4434 3.9037 9.70562 3.9037 8.80718C3.9037 7.90872 4.53798 7.16966 5.34212 7.16966C6.14628 7.16966 6.79437 7.90743 6.78054 8.80718C6.78178 9.70562 6.14628 10.4434 5.34212 10.4434ZM10.6578 10.4434C9.86748 10.4434 9.21941 9.70562 9.21941 8.80718C9.21941 7.90872 9.85365 7.16966 10.6578 7.16966C11.4619 7.16966 12.1101 7.90743 12.0963 8.80718C12.0963 9.70562 11.4619 10.4434 10.6578 10.4434Z"
        fill="#969696"
      />
    </svg>
  );
}

function Avatar({ viewer }: { viewer: NonNullable<ProfileViewer> }) {
  return viewer.image ? (
    <img src={viewer.image} alt="" className="mr-2 h-5 w-5 rounded-full object-cover" />
  ) : (
    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#f2f2f2] text-[10px] font-semibold uppercase text-[#6c6c6c]">
      {viewer.username[0]}
    </div>
  );
}

// Blue button with bento's moving glare (a blurred white bar sweeping across every 4s).
function CreateButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Link
      href="/signup"
      className={cn(
        'relative flex select-none items-center overflow-hidden rounded-xl bg-[#768cff] px-2.5 py-2 font-bold text-white shadow-[0_3px_4px_rgba(0,0,0,.06)] hover:bg-[#6a80f6] active:scale-[.96] active:bg-[#667df5] active:shadow-none sm:rounded-lg',
        TRANSITION,
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-center">
        <img src="/icons/android-chrome-192x192.png" alt="" className="mr-2 h-5 w-5 rounded-[5px]" />
        {children}
      </div>
      <div className="bento-shine pointer-events-none absolute -top-5 h-[calc(100%+40px)] w-[50px] rotate-[20deg] bg-white/60 blur-[20px]" />
    </Link>
  );
}

function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={300} disableHoverableContent>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={12}
            collisionPadding={32}
            className="bento-tooltip z-50 rounded-md bg-white p-1.5 text-xs text-black shadow-[0_11px_36px_rgba(0,0,0,.04),0_7.12963px_21.0833px_rgba(0,0,0,.03),0_4.23704px_11.4667px_rgba(0,0,0,.024),0_2.2px_5.85px_rgba(0,0,0,.02),0_.896296px_2.93333px_rgba(0,0,0,.016),0_.203704px_1.41667px_rgba(0,0,0,.01)]"
          >
            <div className="max-w-[114px] px-1 text-center text-[10px] leading-4 text-black/60">
              {content}
            </div>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

function ProfileCtaDesktop({ viewer }: { viewer: ProfileViewer }) {
  // bento mounts "Create Your Bento" and turns the bar white half a second in.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: [0.42, 0, 0.25, 1], delay: 0.4 }}
      className={cn(
        'fixed bottom-[52px] left-16 z-50 -m-1 hidden items-center space-x-1 rounded-[12px] p-1 transition-colors delay-500 [transition-duration:400ms] xl:flex 2xl:space-x-2',
        ready ? 'bg-white' : 'bg-transparent'
      )}
    >
      {viewer && (
        <>
          <Link href={`/${viewer.username}`} className={cn(TRANSPARENT, 'flex items-center px-2.5 py-2')}>
            <Avatar viewer={viewer} />
            <div className="text-xs font-normal text-[#6c6c6c]">My Bento</div>
          </Link>
          <div className="px-2">
            <div className="h-[14px] w-[2px] rounded-[2px] bg-[#ebebeb]" />
          </div>
        </>
      )}
      {ready && !viewer && (
        <>
          <CreateButton className="mr-3">
            <div className="text-xs font-semibold text-white">Create Your Bento</div>
          </CreateButton>
          <Link href="/login" className={cn(TRANSPARENT, 'px-2.5 py-2')}>
            <div className="text-xs font-normal text-[#6c6c6c]">Log In</div>
          </Link>
        </>
      )}
      <Tooltip content="Explore">
        <Link href="/explore" target="_blank" className={ICON_BUTTON}>
          <CompassIcon />
        </Link>
      </Tooltip>
      {viewer && (
        <Tooltip content="Community">
          <Link href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={ICON_BUTTON}>
            <DiscordIcon />
          </Link>
        </Tooltip>
      )}
    </motion.div>
  );
}

function ProfileCtaMobile({ viewer }: { viewer: ProfileViewer }) {
  return (
    // bento uses py-10; the extra bottom space keeps the row clear of our floating dock.
    <div className="flex w-full flex-col items-center bg-[#fbfbfb] pb-[120px] pt-10 xl:hidden">
      {viewer ? (
        <Link
          href={`/${viewer.username}`}
          className={cn(
            'flex items-center rounded-lg border border-black/[.08] bg-white px-3 py-2.5 font-medium text-black shadow-[0_2px_3px_rgba(0,0,0,.03)] active:scale-[.98]',
            TRANSITION
          )}
        >
          <Avatar viewer={viewer} />
          <div>My Bento</div>
        </Link>
      ) : (
        <CreateButton className="!rounded-lg">
          <div>Create Your Bento</div>
        </CreateButton>
      )}
      <div className="mt-6 flex w-[428px] max-w-full items-center justify-center px-6">
        <div className="flex items-center space-x-2">
          <Link href="/explore" target="_blank" className={ICON_BUTTON}>
            <CompassIcon />
          </Link>
          {viewer && (
            <Link href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className={ICON_BUTTON}>
              <DiscordIcon />
            </Link>
          )}
          {!viewer && (
            <Link href="/login" className={cn(TRANSPARENT, 'px-2.5 py-2')}>
              <div className="text-xs font-normal text-[#6c6c6c]">Log In</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfileCta({ viewer }: { viewer: ProfileViewer }) {
  return (
    <>
      <ProfileCtaDesktop viewer={viewer} />
      <ProfileCtaMobile viewer={viewer} />
    </>
  );
}
