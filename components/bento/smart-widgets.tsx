'use client';

import { useSyncExternalStore } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import {
  formatDuration,
  richSourceFor,
  type GithubData,
  type RichData,
  type SpotifyData,
  type YoutubeData,
} from '@/lib/rich-data';

// The live parts of bento's smart widgets: GitHub's contribution graph,
// YouTube's latest videos and Spotify's players.

export function useRichData(url: string) {
  const enabled = !!url && !!richSourceFor(url);
  const { data } = useQuery({
    queryKey: ['rich-data', url],
    enabled,
    staleTime: 60 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<RichData | null> => {
      const response = await fetch(
        `/api/rich-data?url=${encodeURIComponent(url)}`
      );
      return response.ok ? response.json() : null;
    },
  });
  return enabled ? (data ?? null) : null;
}

// Clicks on parts of a widget that sit inside the tile's own link.
function own(handler: () => void) {
  return (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
  };
}

// One shared player for Spotify's 30-second previews, so starting one stops
// the last.
let audio: HTMLAudioElement | null = null;
let playing: string | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function togglePreview(src: string) {
  if (!audio) {
    audio = new Audio();
    audio.addEventListener('ended', () => {
      playing = null;
      notify();
    });
  }
  if (playing === src) {
    audio.pause();
    playing = null;
  } else {
    audio.src = src;
    audio.play().catch(() => {
      playing = null;
      notify();
    });
    playing = src;
  }
  notify();
}

function usePlaying() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => playing,
    () => null
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
      <path d="M0 1.2v9.6c0 .9 1 1.5 1.8 1L9.4 7a1.2 1.2 0 0 0 0-2L1.8.2C1-.3 0 .3 0 1.2Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
      <rect x="0.5" y="0.5" width="3" height="11" rx="1" />
      <rect x="6.5" y="0.5" width="3" height="11" rx="1" />
    </svg>
  );
}

// ---------------------------------------------------------------- GitHub

// GitHub's own contribution colours, empty to busiest.
const LEVELS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// bento's graph: 12px cells on a 20px pitch, the latest weeks that fit, with
// month labels and the year's total on large tiles.
export function GithubGraph({
  data,
  weeks: count,
  labels,
  align = 'bottom',
}: {
  data: GithubData;
  weeks: number;
  labels?: boolean;
  align?: 'top' | 'bottom';
}) {
  const weeks = data.weeks.slice(-count);
  const start = data.weeks.length - weeks.length;
  const width = weeks.length * 20 - 8;
  const monthOf = (index: number) => {
    const date = new Date(`${data.start}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + (start + index) * 7);
    return date.getUTCMonth();
  };
  const months = labels
    ? weeks
        .map((_, i) => i)
        .filter((i) => i > 0 && monthOf(i) !== monthOf(i - 1))
    : [];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} 132`}
      fill="none"
      preserveAspectRatio={align === 'top' ? 'xMaxYMin meet' : 'xMaxYMax meet'}
      className="overflow-visible"
      aria-label={`${data.total} contributions in the last year`}
    >
      {months.map((i) => (
        <text
          key={i}
          x={i * 20 + 12}
          y={-8}
          fontSize={12}
          textAnchor="middle"
          fill="rgba(0,0,0,0.4)"
        >
          {MONTHS[monthOf(i)]}
        </text>
      ))}
      {weeks.map((week, x) =>
        week.map((level, y) =>
          level < 0 ? null : (
            <g key={`${x}-${y}`}>
              <rect
                x={x * 20}
                y={y * 20}
                width={12}
                height={12}
                rx={2.5}
                fill={LEVELS[level]}
              />
              <rect
                x={x * 20 + 0.5}
                y={y * 20 + 0.5}
                width={11}
                height={11}
                rx={2}
                strokeWidth={1}
                stroke="rgba(0,0,0,0.04)"
              />
            </g>
          )
        )
      )}
    </svg>
  );
}

// ---------------------------------------------------------------- YouTube

// bento's grid of the channel's latest four videos, 8px corners. While the
// videos aren't there yet, or can't be fetched, grey boxes hold their places.
export function YoutubeVideos({
  data,
  columns,
  rows,
  shape = 'landscape',
}: {
  data: YoutubeData | null;
  columns: number;
  rows: number;
  // landscape: 163:106 thumbnails; square: tall tiles' small squares; fill:
  // the thumbnails share the height they are given (wide tiles).
  shape?: 'landscape' | 'square' | 'fill';
}) {
  const count = columns * rows;
  const videos = data?.videos.slice(0, count) ?? [];
  return (
    <div
      className={cn(
        'grid w-full',
        shape === 'square' ? 'gap-2' : 'gap-4',
        shape === 'fill' && 'h-full'
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        ...(shape === 'fill'
          ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }
          : {}),
      }}
    >
      {Array.from({ length: count }, (_, i) => videos[i] ?? null).map(
        (video, i) => (
          <span
            key={video?.id ?? `empty-${i}`}
            role={video ? 'link' : undefined}
            title={video?.title}
            onClick={
              video
                ? own(() =>
                    window.open(
                      `https://www.youtube.com/watch?v=${video.id}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  )
                : undefined
            }
            className={cn(
              'relative block overflow-hidden rounded-[8px] bg-black/[.04]',
              shape === 'square'
                ? 'aspect-square'
                : shape === 'fill'
                  ? 'h-full'
                  : 'aspect-[163/106]'
            )}
          >
            {video && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]" />
          </span>
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Spotify

export function SpotifyPlayButton({
  src,
  iconOnly,
  className,
}: {
  src?: string;
  // The round button on podcast episodes.
  iconOnly?: boolean;
  className?: string;
}) {
  const current = usePlaying();
  const active = !!src && current === src;
  return (
    <span
      role="button"
      aria-label={active ? 'Pause preview' : 'Play preview'}
      onClick={src ? own(() => togglePreview(src)) : undefined}
      className={cn(
        'flex items-center justify-center gap-1.5 whitespace-nowrap bg-[#1ED760] text-xs font-bold leading-4 text-white [transition:transform_.1s,background-color_80ms] hover:bg-[#1fdf64] active:scale-[.95] active:bg-[#169c46] active:text-white/80',
        iconOnly
          ? 'size-8 rounded-full'
          : 'min-w-[86px] rounded-[18px] px-[14px] py-[7px]',
        className
      )}
    >
      {active ? <PauseIcon /> : <PlayIcon />}
      {!iconOnly && (active ? 'Pause' : 'Play')}
    </span>
  );
}

function Cover({ src, className }: { src?: string; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[10px] bg-black/[.06]',
        className
      )}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]" />
    </div>
  );
}

function TrackList({ data, limit }: { data: SpotifyData; limit: number }) {
  const current = usePlaying();
  return (
    <ul className="flex w-full flex-col">
      {data.tracks.slice(0, limit).map((track, i) => (
        <li key={`${track.title}-${i}`}>
          <span
            role="button"
            onClick={
              track.preview
                ? own(() => togglePreview(track.preview!))
                : undefined
            }
            className="group/track flex h-8 w-full items-center text-sm leading-5"
          >
            <span className="w-5 shrink-0 text-black/40">
              {current && current === track.preview ? '♪' : `${i + 1}.`}
            </span>
            <span className="mx-3 min-w-0 flex-1 truncate text-black group-hover/track:underline">
              {track.title}
            </span>
            <span className="shrink-0 tabular-nums text-black/40">
              {formatDuration(track.duration)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

// An episode card from bento's podcast widget.
function Episode({ data }: { data: SpotifyData }) {
  const episode = data.tracks[0];
  if (!episode) return null;
  return (
    <div className="flex w-full flex-col gap-3 rounded-[12px] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,.06)]">
      <SpotifyPlayButton
        src={episode.preview}
        iconOnly
        className="self-start"
      />
      <p className="line-clamp-2 text-sm leading-5 text-black">
        {episode.title}
      </p>
      <span className="text-xs leading-4 text-black/60">
        {formatDuration(episode.duration)}
      </span>
    </div>
  );
}

// Bento's Spotify widget body under the icon, by tile size.
export function SpotifyBody({
  data,
  size,
  icon,
  title,
}: {
  data: SpotifyData;
  size: 'small' | 'wide' | 'tall' | 'large';
  icon: React.ReactNode;
  title: React.ReactNode;
}) {
  const play = data.preview ?? data.tracks.find((t) => t.preview)?.preview;
  const meta = (
    <div className="flex min-w-0 flex-col">
      <div className="line-clamp-2 text-sm leading-[1.2] text-black">
        {title}
      </div>
      {data.subtitle && (
        <div className="mt-1 line-clamp-1 text-xs leading-4 text-black/60">
          {data.subtitle}
        </div>
      )}
    </div>
  );

  if (size === 'large') {
    const list = data.tracks.length > 1 && data.type !== 'show';
    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-start gap-3">
          {/* The cover sits over the platform icon, offset 8px. */}
          <div className="relative size-24 shrink-0">
            <div className="absolute left-0 top-0">{icon}</div>
            <Cover
              src={data.cover}
              className="absolute left-2 top-2 size-[88px]"
            />
          </div>
          <div className="flex h-24 min-w-0 flex-1 flex-col justify-between">
            <SpotifyPlayButton src={play} className="self-end" />
            {meta}
          </div>
        </div>
        <div className="mt-auto w-full pt-4">
          {list ? (
            <TrackList data={data} limit={6} />
          ) : data.type === 'show' ? (
            <div className="grid grid-cols-2 gap-4">
              <Episode data={data} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (size === 'wide') {
    return (
      <div className="flex h-full w-full gap-8">
        <div className="flex min-w-0 flex-1 flex-col">
          {icon}
          <div className="mt-3">{meta}</div>
          <SpotifyPlayButton src={play} className="mt-auto self-start" />
        </div>
        <Cover src={data.cover} className="aspect-square h-full shrink-0" />
      </div>
    );
  }

  if (size === 'tall') {
    return (
      <div className="flex h-full w-full flex-col">
        {icon}
        <div className="mt-3">{meta}</div>
        <SpotifyPlayButton src={play} className="mt-3 self-start" />
        <Cover src={data.cover} className="mt-auto aspect-square w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {icon}
      <div className="mt-3">{meta}</div>
      <SpotifyPlayButton src={play} className="mt-auto self-start" />
    </div>
  );
}
