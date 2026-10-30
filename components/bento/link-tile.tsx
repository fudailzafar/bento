'use client';

import { useRef } from 'react';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { findPlatform, handleFrom, hostOf } from '@/lib/platforms';
import { PLATFORM_ICONS } from '@/lib/platform-icons';
import { NO_DRAG } from './editing/no-drag';

// bento.me's link widget. Small: icon, title, handle, button stacked. Wide and
// large: button moves to the top-right and a preview fills the rest. Tall:
// preview under the text. Bar: one slim row. The preview is the page's Open
// Graph image (or one the owner uploaded); otherwise bento's empty states.

type TileSize = 'bar' | 'small' | 'wide' | 'tall' | 'large';

export function tileSize(w: number, h: number): TileSize {
  if (h <= 1) return 'bar';
  if (w >= 2) return h >= 4 ? 'large' : 'wide';
  return h >= 4 ? 'tall' : 'small';
}

// Width over height of a tile on bento's desktop grid (175px or 390px a side).
export function tileAspect(w: number, h: number) {
  return (w >= 2 ? 390 : 175) / (h >= 4 ? 390 : h <= 1 ? 67.5 : 175);
}

export interface LinkTileEditing {
  onTitle: (title: string) => void;
  onImage: (file: File) => void;
  onClearImage: () => void;
  uploading?: boolean;
}

// bento's preview controls: upload a picture for the preview, or drop it.
function PreviewControls({
  edit,
  hasImage,
}: {
  edit: LinkTileEditing;
  hasImage: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div
      className={cn(
        NO_DRAG,
        'absolute left-2 top-2 z-10 flex items-center gap-0.5 rounded-[10px] bg-black p-1 opacity-0 shadow-[0_4px_12px_rgba(0,0,0,.2)] transition-opacity group-hover:opacity-100'
      )}
    >
      <button
        type="button"
        aria-label="Upload preview image"
        title="Upload preview image"
        onClick={() => input.current?.click()}
        className="flex size-7 items-center justify-center rounded-md text-white hover:bg-white/15"
      >
        {edit.uploading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <ImagePlus className="size-4" />
        )}
      </button>
      <button
        type="button"
        aria-label="Remove preview image"
        title="Remove preview image"
        disabled={!hasImage}
        onClick={edit.onClearImage}
        className="flex size-7 items-center justify-center rounded-md text-white hover:bg-white/15 disabled:text-white/30 disabled:hover:bg-transparent"
      >
        <X className="size-4" />
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) edit.onImage(file);
          e.target.value = '';
        }}
      />
    </div>
  );
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

function Preview(props: {
  posts?: boolean;
  large?: boolean;
  image?: string;
  edit?: LinkTileEditing;
}) {
  return (
    <div className="relative h-full w-full">
      <PreviewArea {...props} />
      {props.edit && (
        <PreviewControls edit={props.edit} hasImage={!!props.image} />
      )}
    </div>
  );
}

function PreviewArea({
  posts,
  large,
  image,
}: {
  posts?: boolean;
  large?: boolean;
  image?: string;
}) {
  // The page's Open Graph image, fetched when the link was added.
  if (image) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-black/[.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]" />
      </div>
    );
  }
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
  image,
  w,
  h,
  edit,
}: {
  url: string;
  title?: string;
  image?: string;
  w: number;
  h: number;
  // In the editor: the title is typed into, the preview image can be set.
  edit?: LinkTileEditing;
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
  const preview = platform?.posts || !button || !!image;
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
        size !== 'small' && size !== 'bar' && 'px-[14px]',
        button.className
      )}
    >
      {button.play && <PlayIcon />}
      {button.label}
    </div>
  );

  const titleText = edit ? (
    <input
      value={
        title === 'New link' || title === 'Untitled link' ? '' : (title ?? '')
      }
      placeholder={platform?.name ?? (hostOf(url) || 'Title')}
      onChange={(e) => edit.onTitle(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
      className={cn(
        NO_DRAG,
        'w-full border-0 bg-transparent p-0 text-sm leading-5 text-black outline-none placeholder:text-black focus:ring-0'
      )}
    />
  ) : (
    name
  );

  if (size === 'bar') {
    return (
      <div
        className="flex h-full w-full items-center gap-3 overflow-hidden bg-[var(--tile-bg)] px-4 transition-colors duration-100 group-hover/card:bg-[var(--tile-hover)] group-active/card:bg-[var(--tile-active)]"
        style={
          {
            '--tile-bg': platform?.bg ?? '#ffffff',
            '--tile-hover': platform?.hover ?? '#FBFBFB',
            '--tile-active': platform?.active ?? '#EFEFEF',
          } as React.CSSProperties
        }
      >
        <div className="scale-[.8]">
          <Icon icon={platform?.icon} url={url} />
        </div>
        <div className="line-clamp-1 min-w-0 flex-1 text-sm leading-5 text-black">
          {titleText}
        </div>
        {cta}
      </div>
    );
  }

  const meta = (
    <div className="mt-2 flex w-full min-w-0 shrink-0 flex-col xl:mt-3">
      <div className="line-clamp-1 text-sm leading-5 text-black xl:line-clamp-2">
        {titleText}
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
            <Preview posts={platform?.posts} image={image} edit={edit} />
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
              <Preview
                posts={platform?.posts}
                large={size === 'large'}
                image={image}
                edit={edit}
              />
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
