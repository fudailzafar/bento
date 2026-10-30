'use client';

import { useRef } from 'react';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { findPlatform, handleFrom, hostOf } from '@/lib/platforms';
import { PLATFORM_ICONS } from '@/lib/platform-icons';
import { NO_DRAG } from './editing/no-drag';
import {
  GithubGraph,
  SpotifyBody,
  YoutubeVideos,
  useRichData,
} from './smart-widgets';

// bento.me's link widget. Small: icon, title, handle, button stacked. Wide and
// large: button moves to the top-right and a preview fills the rest. Tall:
// preview under the text. Bar: one slim row. The preview is the page's Open
// Graph image (or one the owner uploaded); otherwise bento's empty states.
// Smart links (GitHub, YouTube, Spotify) show the platform's live data.

type TileSize = 'bar' | 'small' | 'wide' | 'tall' | 'large';

function tileSize(w: number, h: number): TileSize {
  if (h <= 1) return 'bar';
  if (w >= 2) return h >= 4 ? 'large' : 'wide';
  return h >= 4 ? 'tall' : 'small';
}

// Width over height of a tile on bento's desktop grid (175px or 390px a side).
export function tileAspect(w: number, h: number) {
  return (w >= 2 ? 390 : 175) / (h >= 4 ? 390 : h <= 1 ? 67.5 : 175);
}

interface LinkTileEditing {
  onTitle: (title: string) => void;
  onBio: (bio: string) => void;
  onImage: (file: File) => void;
  onGallery: (file: File) => void;
  onRemoveGallery: (index: number) => void;
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

function Icon({
  icon,
  src,
  url,
  small,
}: {
  icon?: string;
  src?: string;
  url: string;
  // bento's bar links use a 28px icon with 7px corners.
  small?: boolean;
}) {
  const svg = icon ? PLATFORM_ICONS[icon] : undefined;
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,.1)]',
        small
          ? 'h-7 w-7 min-w-7 rounded-[7px]'
          : 'h-10 w-10 min-w-10 rounded-[10px]'
      )}
    >
      {svg ? (
        <div
          className="h-full w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full" />
      ) : (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center bg-white',
            small ? 'p-1.5' : 'p-2'
          )}
        >
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
  portrait?: boolean;
  images?: string[];
  large?: boolean;
  image?: string;
  edit?: LinkTileEditing;
  // Live platform content, in place of the image.
  smart?: React.ReactNode;
}) {
  if (props.smart) return <div className="h-full w-full">{props.smart}</div>;
  return (
    <div className="relative h-full w-full">
      <PreviewArea {...props} />
      {props.edit && !props.posts && (
        <PreviewControls edit={props.edit} hasImage={!!props.image} />
      )}
    </div>
  );
}

// bento's grid of recent posts. Platforms without a public data source show
// the owner's own pictures; in the editor each empty cell takes an upload.
function PostCell({
  src,
  index,
  portrait,
  edit,
}: {
  src?: string;
  index: number;
  portrait?: boolean;
  edit?: LinkTileEditing;
}) {
  const input = useRef<HTMLInputElement>(null);
  const shape = portrait ? 'aspect-[9/16]' : 'aspect-square';
  if (src) {
    return (
      <div
        className={cn(
          'group/post relative overflow-hidden rounded-[8px] bg-black/[.04]',
          shape
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]" />
        {edit && (
          <button
            type="button"
            aria-label="Remove picture"
            onClick={() => edit.onRemoveGallery(index)}
            className={cn(
              NO_DRAG,
              'absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover/post:opacity-100'
            )}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    );
  }
  const cell = cn(
    'flex items-center justify-center rounded-[8px] bg-black/[.04] text-black/40 shadow-[inset_0_0_0_1px_rgba(0,0,0,.04)]',
    shape
  );
  if (!edit) {
    return (
      <div className={cell}>
        <ImagePlus className="size-4 opacity-50" />
      </div>
    );
  }
  return (
    <button
      type="button"
      aria-label="Add picture"
      onClick={() => input.current?.click()}
      className={cn(NO_DRAG, cell, 'transition-colors hover:bg-black/[.07]')}
    >
      <ImagePlus className="size-4" />
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) edit.onGallery(file);
          e.target.value = '';
        }}
      />
    </button>
  );
}

function PostsGrid({
  large,
  portrait,
  images,
  edit,
}: {
  large?: boolean;
  portrait?: boolean;
  images?: string[];
  edit?: LinkTileEditing;
}) {
  const full = portrait ? (large ? 3 : 2) : large ? 6 : 4;
  const columns = portrait ? full : large ? 3 : 2;
  // Visitors see only the pictures the owner added.
  const count = edit ? full : Math.min(images?.length ?? 0, full);
  return (
    <div
      className="grid h-full w-full content-start gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <PostCell
          key={i}
          index={i}
          src={images?.[i]}
          portrait={portrait}
          edit={edit}
        />
      ))}
    </div>
  );
}

function PreviewArea({
  posts,
  portrait,
  images,
  large,
  image,
  edit,
}: {
  posts?: boolean;
  portrait?: boolean;
  images?: string[];
  large?: boolean;
  image?: string;
  edit?: LinkTileEditing;
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
      <PostsGrid
        large={large}
        portrait={portrait}
        images={images}
        edit={edit}
      />
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
  images,
  bio,
  w,
  h,
  edit,
}: {
  url: string;
  title?: string;
  image?: string;
  images?: string[];
  bio?: string;
  w: number;
  h: number;
  // In the editor: the title is typed into, the preview image can be set.
  edit?: LinkTileEditing;
}) {
  const platform = findPlatform(url);
  const size = tileSize(w, h);
  const rich = useRichData(url);
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
  const github = rich?.kind === 'github' ? rich : null;
  const youtube = rich?.kind === 'youtube' && rich.videos.length ? rich : null;
  // The graph or videos in the preview slot, by tile size.
  const smart =
    github && size === 'wide' ? (
      <GithubGraph data={github} weeks={8} align="top" />
    ) : github && size === 'tall' ? (
      <div className="flex h-full items-end">
        <div className="h-[150px] w-full">
          <GithubGraph data={github} weeks={6} />
        </div>
      </div>
    ) : youtube && size !== 'small' ? (
      <div className="flex h-full items-end">
        <YoutubeVideos
          data={youtube}
          columns={size === 'tall' ? 1 : 2}
          rows={2}
        />
      </div>
    ) : null;
  const preview =
    (platform?.posts && (!!edit || !!images?.length)) ||
    !button ||
    !!image ||
    !!smart ||
    (!!edit && !!platform?.bio) ||
    (!!github && size === 'large');
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
      {youtube?.subscribers && (
        <span className="ml-1 font-medium text-white/80">
          {youtube.subscribers}
        </span>
      )}
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
        className="flex h-full w-full items-center gap-3 overflow-hidden bg-[var(--tile-bg)] px-[var(--tile-pad,24px)] py-5 transition-colors duration-200 [transition-timing-function:cubic-bezier(.43,.01,.29,1)] group-hover/card:bg-[var(--tile-hover)] group-active/card:bg-[var(--tile-active)]"
        style={
          {
            '--tile-bg': platform?.bg ?? '#ffffff',
            '--tile-hover': platform?.hover ?? '#FBFBFB',
            '--tile-active': platform?.active ?? '#EFEFEF',
          } as React.CSSProperties
        }
      >
        <Icon icon={platform?.icon} src={platform?.iconSrc} url={url} small />
        <div className="line-clamp-1 min-w-0 flex-1 text-sm leading-5 text-black">
          {titleText}
        </div>
        {cta}
      </div>
    );
  }

  const tileStyle = {
    '--tile-bg': platform?.bg ?? '#ffffff',
    '--tile-hover': platform?.hover ?? '#FBFBFB',
    '--tile-active': platform?.active ?? '#EFEFEF',
  } as React.CSSProperties;

  if (rich?.kind === 'spotify') {
    return (
      <div
        className="flex h-full w-full overflow-hidden bg-[var(--tile-bg)] p-[var(--tile-pad,24px)] transition-colors duration-200 [transition-timing-function:cubic-bezier(.43,.01,.29,1)] group-hover/card:bg-[var(--tile-hover)] group-active/card:bg-[var(--tile-active)]"
        style={tileStyle}
      >
        <SpotifyBody
          data={rich}
          size={size}
          icon={
            <Icon icon={platform?.icon} src={platform?.iconSrc} url={url} />
          }
          title={titleText}
        />
      </div>
    );
  }

  const meta = (
    <div className="mt-3 flex w-full min-w-0 shrink-0 flex-col">
      <div className="line-clamp-2 text-sm leading-[1.2] text-black">
        {titleText}
      </div>
      {sub && (
        <div className="mt-1 line-clamp-1 text-xs leading-4 text-black/60">
          {sub}
        </div>
      )}
      {platform?.bio && size !== 'small' && (edit || bio) && (
        <div className="mt-2 text-xs leading-4 text-black/80">
          {edit ? (
            <textarea
              value={bio ?? ''}
              placeholder="Add your bio"
              rows={2}
              maxLength={280}
              onChange={(e) => edit.onBio(e.target.value)}
              className={cn(
                NO_DRAG,
                'w-full resize-none border-0 bg-transparent p-0 text-xs leading-4 outline-none placeholder:text-black/40 focus:ring-0'
              )}
            />
          ) : (
            <p className="line-clamp-3">{bio}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-[var(--tile-bg)] p-[var(--tile-pad,24px)] transition-colors duration-200 [transition-timing-function:cubic-bezier(.43,.01,.29,1)] group-hover/card:bg-[var(--tile-hover)] group-active/card:bg-[var(--tile-active)]"
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
          <Icon icon={platform?.icon} src={platform?.iconSrc} url={url} />
          <div className="flex-1" />
          {cta}
        </div>
      ) : (
        <Icon icon={platform?.icon} src={platform?.iconSrc} url={url} />
      )}

      {size === 'wide' && preview ? (
        // Text and button on the left, preview on the right.
        <div className="-mt-10 flex min-h-0 flex-1 gap-6">
          <div className="flex min-w-0 flex-1 flex-col pt-10">
            {meta}
            {cta && <div className="mt-3 flex">{cta}</div>}
          </div>
          {/* The preview is 1.4 wide for every height, so the text takes
              what is left, as on bento's phone grid. */}
          <div className="aspect-[1.4] h-full shrink-0">
            <Preview
              posts={platform?.posts}
              portrait={platform?.portrait}
              images={images}
              image={image}
              edit={edit}
              smart={smart}
            />
          </div>
        </div>
      ) : (
        <>
          {meta}
          {size === 'small' && cta && (
            <div className="mt-3 flex shrink-0">{cta}</div>
          )}
          {github && size === 'large' && (
            <div className="mt-auto w-full shrink-0 pt-8">
              <div className="h-[136px] w-full">
                <GithubGraph data={github} weeks={17} labels />
              </div>
              <p className="mt-4 text-xs leading-4 text-black/60">
                {github.total.toLocaleString('en')} contributions in the last
                year
              </p>
            </div>
          )}
          {(size === 'tall' || size === 'large') &&
            preview &&
            !(github && size === 'large') && (
              <div
                className={
                  size === 'large' && !platform?.posts && !smart
                    ? 'mt-auto w-full shrink-0 pt-2'
                    : 'mt-4 min-h-0 flex-1'
                }
              >
                <div
                  className={
                    size === 'large' && !platform?.posts && !smart
                      ? 'aspect-[1200/630] w-full'
                      : 'h-full w-full'
                  }
                >
                  <Preview
                    posts={platform?.posts}
                    portrait={platform?.portrait}
                    images={images}
                    large={size === 'large'}
                    image={image}
                    edit={edit}
                    smart={smart}
                  />
                </div>
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
