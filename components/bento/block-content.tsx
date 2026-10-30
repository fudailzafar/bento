'use client';

import { Block } from '@/lib';
import { LinkTile } from './link-tile';
import { embedFor } from '@/lib/embeds';
import { isVideoUrl } from '@/lib/media';
import { ImageOff, MapPin } from 'lucide-react';

// Dark note colours get white text.
function isDark(hex?: string) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return false;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 160;
}

// bento's linkable widgets: the whole tile opens the link, with a small
// arrow badge in the top-right corner.
function Linked({
  href,
  interactive,
  children,
}: {
  href?: string;
  interactive: boolean;
  children: React.ReactNode;
}) {
  if (!href) return <>{children}</>;
  const badge = (
    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-black/60 shadow-[0_1px_2px_rgba(0,0,0,.1)] backdrop-blur">
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.5 7.5 7.5 2.5M3.5 2.5h4v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
  if (!interactive) {
    return (
      <div className="relative h-full w-full">
        {children}
        {badge}
      </div>
    );
  }
  return (
    <a
      href={href.startsWith('http') ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block h-full w-full"
    >
      {children}
      {badge}
    </a>
  );
}

export function BlockContent({
  block,
  interactive = false,
}: {
  block: Block;
  interactive?: boolean;
}) {
  switch (block.type) {
    case 'LINK': {
      const { url, title, image } = block.data as {
        url?: string;
        title?: string;
        image?: string;
      };
      // Videos and players play inside wide and tall tiles, as on bento.
      const embed =
        url && (block.w >= 2 || block.h >= 4) ? embedFor(url) : null;
      if (embed) {
        return (
          <div className="relative h-full w-full bg-black/[.04]">
            <iframe
              src={embed.src}
              title={title || embed.provider}
              className="h-full w-full border-0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              allowFullScreen
            />
            {/* In the editor the tile stays draggable and opens its settings. */}
            {!interactive && <div className="absolute inset-0" />}
          </div>
        );
      }
      const tile = (
        <LinkTile
          url={url ?? ''}
          title={title}
          image={image}
          w={block.w}
          h={block.h}
        />
      );
      if (interactive && url) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
          >
            {tile}
          </a>
        );
      }
      return tile;
    }

    case 'IMAGE': {
      const { url, alt, href, kind } = block.data as {
        url?: string;
        alt?: string;
        href?: string;
        kind?: 'image' | 'video';
      };
      if (!url) {
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs font-medium">Add an image or video</span>
          </div>
        );
      }
      return (
        <Linked href={href} interactive={interactive}>
          <div className="h-full w-full overflow-hidden bg-muted">
            {kind === 'video' || isVideoUrl(url) ? (
              // bento's video widget: muted, looping, no controls.
              <video
                src={url}
                aria-label={alt || undefined}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={alt || ''}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </Linked>
      );
    }

    case 'TEXT': {
      const { content, href, color, align } = block.data as {
        content?: string;
        href?: string;
        color?: string;
        align?: 'left' | 'center' | 'right';
      };
      const dark = isDark(color);
      const tone = dark ? 'text-white' : 'text-black';
      const alignClass =
        align === 'center'
          ? 'text-center items-center'
          : align === 'right'
            ? 'text-right items-end'
            : '';
      const text = content?.trim() ?? '';
      // bento's quote note: a closing "— Author" line turns the note into a
      // quote with a big opening mark and italic text.
      const lines = text.split('\n');
      const last = lines[lines.length - 1]?.trim() ?? '';
      const author =
        /^[—–-]\s*\S/.test(last) && lines.length > 1
          ? last.replace(/^[—–-]\s*/, '')
          : null;
      if (author) {
        return (
          <Linked href={href} interactive={interactive}>
            <div
              className={`flex h-full w-full flex-col overflow-hidden p-6 ${alignClass}`}
              style={{ background: color ?? '#FFFFFF' }}
            >
              <span className="font-serif text-[32px] font-bold leading-none text-black">
                &ldquo;
              </span>
              <p
                className={`mt-3 line-clamp-[10] whitespace-pre-wrap text-sm italic leading-5 ${tone}`}
              >
                {lines.slice(0, -1).join('\n').trim()}
              </p>
              <p
                className={`mt-4 text-sm italic leading-5 ${dark ? 'text-white/70' : 'text-black/60'}`}
              >
                &mdash; {author}
              </p>
            </div>
          </Linked>
        );
      }
      return (
        <Linked href={href} interactive={interactive}>
          <div
            className={`flex h-full w-full flex-col overflow-hidden p-6 ${alignClass}`}
            style={{ background: color ?? '#FFFFFF' }}
          >
            <p
              className={
                text
                  ? `line-clamp-[10] whitespace-pre-wrap text-sm leading-5 ${tone}`
                  : `text-sm leading-5 ${dark ? 'text-white/50' : 'text-black/30'}`
              }
            >
              {text || 'Add note...'}
            </p>
          </div>
        </Linked>
      );
    }

    case 'MAP': {
      const { location, label } = block.data as {
        location?: string;
        label?: string;
      };
      return (
        <div
          className="relative h-full w-full overflow-hidden bg-muted"
          style={{
            backgroundImage:
              'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            color: 'hsl(var(--muted-foreground) / 0.35)',
          }}
        >
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm backdrop-blur-md">
            <MapPin className="size-4" />
            {location
              ? `${label || 'Where I live'} · ${location}`
              : label || 'Where I live'}
          </div>
        </div>
      );
    }

    case 'SECTION_TITLE': {
      const { title } = block.data as { title?: string };
      return (
        <div className="flex h-full w-full items-end px-2 pb-1">
          <h2 className="text-sm font-semibold leading-[17px] text-black">
            {title || 'Section'}
          </h2>
        </div>
      );
    }
  }
}
