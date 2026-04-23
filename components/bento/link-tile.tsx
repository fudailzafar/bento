'use client';

import { cn } from '@/lib/utils';
import { findPlatform, handleFrom, hostOf } from '@/lib/platforms';
import { PLATFORM_ICONS } from '@/lib/platform-icons';

// bento.me's link widget. Small: icon, title, handle, button stacked. Wide and
// large: button moves to the top-right and a preview fills the rest. Tall:
// preview under the text. Post previews and og images aren't fetched, so the
// preview areas show bento's own empty states.

type TileSize = 'small' | 'wide' | 'tall' | 'large';

export function tileSize(w: number, h: number): TileSize {
  if (w >= 2) return h >= 4 ? 'large' : 'wide';
  return h >= 4 ? 'tall' : 'small';
}

function PlayIcon() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 1.2v9.6c0 .9 1 1.5 1.8 1L9.4 7a1.2 1.2 0 0 0 0-2L1.8.2C1-.3 0 .3 0 1.2Z" />
    </svg>
  );
}

function Icon({ icon, url }: { icon?: string; url: string }) {
  const svg = icon ? PLATFORM_ICONS[icon] : undefined;
  return (
    <div className="relative h-10 w-10 min-w-10 shrink-0 overflow-hidden rounded-[10px] shadow-[0_1px_2px_rgba(0,0,0,.1)]">
      {svg ? (
        <div
          className="h-full w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${hostOf(url)}&sz=64`}
            alt=""
            className="h-full w-full rounded-[4px] object-contain"
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]" />
    </div>
  );
}

function Preview({ posts, large }: { posts?: boolean; large?: boolean }) {
  if (posts) {
    return (
      <div
        className={cn(
          'grid h-full w-full gap-2',
          large ? 'grid-cols-3' : 'grid-cols-2'
        )}
      >
        {Array.from({ length: large ? 6 : 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[8px] bg-black/[.04] shadow-[inset_0_0_0_1px_rgba(0,0,0,.04)]"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black/[.04] px-4 text-center text-[10px] leading-[14px] text-black/40 shadow-[inset_0_0_0_1px_rgba(0,0,0,.04)]">
      Seems like there&apos;s no preview image.
    </div>
  );
}

export function LinkTile({
  url,
  title,
  w,
  h,
}: {
  url: string;
  title?: string;
  w: number;
  h: number;
}) {
  const platform = findPlatform(url);
  const size = tileSize(w, h);
  const name =
    title && title !== 'New link' && title !== 'Untitled link'
      ? title
      : (platform?.name ?? (hostOf(url) || 'New link'));
  const sub = platform
    ? platform.handle
      ? handleFrom(url, platform.handle)
      : undefined
    : hostOf(url);
  const button = platform?.button;
  // Previews: post thumbnails for post-based platforms, otherwise the og
  // image slot for plain links. Platforms with a button but no posts (Twitter,
  // GitHub, TikTok, Spotify) show no preview, as on bento.
  const preview = platform?.posts || !button;
  // Button sits top-right on large tiles, and on wide tiles without a preview.
  const topRight = size === 'large' || (size === 'wide' && !preview);

  const cta = button && (
    <div
      role="button"
      onClick={(e) => {
        // The pill follows the same link as the tile.
        e.stopPropagation();
      }}
      className={cn(
        'flex items-center justify-center gap-1 whitespace-nowrap px-[11px] py-[7px] text-xs font-bold leading-4 [transition:transform_.1s,background-color_80ms]',
        size !== 'small' && 'px-[14px]',
        button.className
      )}
    >
      {button.play && <PlayIcon />}
      {button.label}
    </div>
  );

  const meta = (
    <div className="mt-2 flex w-full min-w-0 shrink-0 flex-col xl:mt-3">
      <div className="line-clamp-1 text-sm leading-5 text-black xl:line-clamp-2">
        {name}
      </div>
      {sub && (
        <div className="mt-0.5 line-clamp-1 text-xs leading-4 text-black/60">
          {sub}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-[var(--tile-bg)] p-4 transition-colors duration-100 group-hover/card:bg-[var(--tile-hover)] group-active/card:bg-[var(--tile-active)] xl:p-6"
      style={
        {
          '--tile-bg': platform?.bg ?? '#ffffff',
          '--tile-hover': platform?.hover ?? '#FBFBFB',
          '--tile-active': platform?.active ?? '#EFEFEF',
        } as React.CSSProperties
      }
    >
      {topRight ? (
        <div className="flex w-full items-start">
          <Icon icon={platform?.icon} url={url} />
          <div className="flex-1" />
          {cta}
        </div>
      ) : (
        <Icon icon={platform?.icon} url={url} />
      )}

      {size === 'wide' && preview ? (
        // Text and button on the left, preview on the right.
        <div className="-mt-10 flex min-h-0 flex-1 gap-5">
          <div className="flex w-[45%] min-w-0 flex-col pt-10">
            {meta}
            {cta && <div className="mt-3 flex">{cta}</div>}
          </div>
          <div className="min-h-0 flex-1">
            <Preview posts={platform?.posts} />
          </div>
        </div>
      ) : (
        <>
          {meta}
          {size === 'small' && cta && (
            <div className="mt-2 flex shrink-0 xl:mt-3">{cta}</div>
          )}
          {(size === 'tall' || size === 'large') && preview && (
            <div className="mt-4 min-h-0 flex-1">
              <Preview posts={platform?.posts} large={size === 'large'} />
            </div>
          )}
          {size === 'tall' && cta && (
            <div className="mt-auto flex pt-4">{cta}</div>
          )}
        </>
      )}
    </div>
  );
}
