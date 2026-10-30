'use client';

import { useRef, useState } from 'react';
import { Block } from '@/lib';
import { LinkTile } from './link-tile';
import { MapTiles } from './map-tiles';
import { NoteEditor, RichText } from './rich-text';
import { plainRich } from '@/lib/rich-text';
import { NO_DRAG } from './editing/no-drag';
import { embedFor } from '@/lib/embeds';
import { asUrl, isVideoUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { ImagePlus, LoaderCircle, MapPin } from 'lucide-react';

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

// What the editor passes in so a widget can be edited where it sits.
export interface BlockEditing {
  onPatch: (patch: Record<string, unknown>) => void;
  // Sets a link widget's address and fetches its preview.
  onSetUrl: (url: string) => void;
  // Uploads a file into a data field ("url" for media, "image" for a
  // link's preview).
  onUpload: (file: File, field: 'url' | 'image' | 'gallery') => void;
  uploading?: boolean;
}

// Text that is typed straight into the widget, styled exactly as it shows on
// the public profile.
function InlineText({
  value,
  placeholder,
  onChange,
  className,
  size,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
  // Width in characters, for inputs that hug their text.
  size?: number;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      size={size}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
      className={cn(
        NO_DRAG,
        'w-full border-0 bg-transparent p-0 outline-none placeholder:text-current placeholder:opacity-40 focus:ring-0',
        className
      )}
    />
  );
}

function FilePicker({
  accept,
  onFile,
  children,
  className,
}: {
  accept: string;
  onFile: (file: File) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => input.current?.click()}
      className={cn(NO_DRAG, className)}
    >
      {children}
      <input
        ref={input}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
    </button>
  );
}

// An empty link widget asks for its address in place.
function LinkUrlInput({ onSetUrl }: { onSetUrl: (url: string) => void }) {
  const [value, setValue] = useState('');
  const submit = () => {
    const url = asUrl(value);
    if (url) onSetUrl(url);
  };
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 p-4 xl:p-6">
      <span className="text-sm font-semibold text-black">Add a link</span>
      <input
        autoFocus
        value={value}
        placeholder="Paste a link..."
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        onBlur={submit}
        className={cn(
          NO_DRAG,
          'w-full rounded-lg bg-black/[.04] px-3 py-2 text-sm text-black outline-none placeholder:text-black/40 focus:bg-black/[.06]'
        )}
      />
    </div>
  );
}

export function BlockContent({
  block,
  interactive = false,
  edit,
}: {
  block: Block;
  interactive?: boolean;
  edit?: BlockEditing;
}) {
  switch (block.type) {
    case 'LINK': {
      const { url, title, image, images, bio } = block.data as {
        url?: string;
        title?: string;
        image?: string;
        images?: string[];
        bio?: string;
      };
      if (edit && !url) return <LinkUrlInput onSetUrl={edit.onSetUrl} />;
      // Videos and players play inside wide and tall tiles, as on bento.
      const embed =
        url && (block.w >= 2 || block.h >= 4) && block.h > 1
          ? embedFor(url)
          : null;
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
            {/* In the editor the tile stays draggable. */}
            {!interactive && <div className="absolute inset-0" />}
          </div>
        );
      }
      const tile = (
        <LinkTile
          url={url ?? ''}
          title={title}
          image={image}
          images={images}
          bio={bio}
          w={block.w}
          h={block.h}
          edit={
            edit && {
              onTitle: (value) => edit.onPatch({ title: value }),
              onBio: (value) => edit.onPatch({ bio: value }),
              onImage: (file) => edit.onUpload(file, 'image'),
              onGallery: (file) => edit.onUpload(file, 'gallery'),
              onRemoveGallery: (index) =>
                edit.onPatch({
                  images: (images ?? []).filter((_, i) => i !== index),
                }),
              onClearImage: () => edit.onPatch({ image: undefined }),
              uploading: edit.uploading,
            }
          }
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
      const { url, alt, href, kind, caption } = block.data as {
        url?: string;
        alt?: string;
        href?: string;
        kind?: 'image' | 'video';
        caption?: string;
      };
      // bento's advice for the two square sizes.
      const recommended =
        block.w === 1 && block.h === 2
          ? '400×400px'
          : block.w === 2 && block.h === 4
            ? '800×800px'
            : null;
      if (!url) {
        const empty = (
          <>
            {edit?.uploading ? (
              <LoaderCircle className="size-6 animate-spin" />
            ) : (
              <ImagePlus className="size-6" />
            )}
            <span className="text-xs font-medium">
              {edit?.uploading ? 'Uploading...' : 'Add an image or video'}
            </span>
            {!edit?.uploading && recommended && (
              <span className="text-[10px] leading-3 opacity-70">
                Best at {recommended} or larger
              </span>
            )}
          </>
        );
        const emptyClass =
          'flex h-full w-full flex-col items-center justify-center gap-2 bg-black/[.03] text-black/40';
        return edit ? (
          <FilePicker
            accept="image/*,video/mp4,video/webm,video/quicktime"
            onFile={(file) => edit.onUpload(file, 'url')}
            className={cn(emptyClass, 'transition-colors hover:bg-black/[.05]')}
          >
            {empty}
          </FilePicker>
        ) : (
          <div className={emptyClass}>{empty}</div>
        );
      }
      return (
        <Linked href={href} interactive={interactive}>
          <div className="relative h-full w-full overflow-hidden bg-muted">
            {kind === 'video' || isVideoUrl(url) ? (
              // bento's video widget: muted, looping, no controls.
              <video
                src={url}
                aria-label={caption || alt || undefined}
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
                alt={caption || alt || ''}
                className="h-full w-full object-cover"
              />
            )}
            {edit ? (
              // The caption pill is typed into directly; empty, it shows on
              // hover as a "Caption..." prompt.
              <div
                className={cn(
                  'absolute bottom-4 left-4 max-w-[calc(100%-32px)] rounded-[8px] bg-white px-2 py-1.5',
                  !caption &&
                    'opacity-0 focus-within:opacity-100 group-hover:opacity-100'
                )}
              >
                <InlineText
                  value={caption ?? ''}
                  placeholder="Caption..."
                  onChange={(value) => edit.onPatch({ caption: value })}
                  size={Math.max((caption ?? '').length, 8)}
                  className="w-auto max-w-full text-sm leading-[21px] text-black"
                />
              </div>
            ) : (
              caption && (
                <span className="absolute bottom-4 left-4 line-clamp-2 max-w-[calc(100%-32px)] rounded-[8px] bg-white px-2 py-1.5 text-sm leading-[21px] text-black">
                  {caption}
                </span>
              )
            )}
          </div>
        </Linked>
      );
    }

    case 'TEXT': {
      const { content, href, color, align, valign } = block.data as {
        content?: string;
        href?: string;
        color?: string;
        align?: 'left' | 'center' | 'right';
        valign?: 'top' | 'middle' | 'bottom';
      };
      const dark = isDark(color);
      const tone = dark ? 'text-white' : 'text-black';
      const alignClass =
        align === 'center'
          ? 'text-center items-center'
          : align === 'right'
            ? 'text-right items-end'
            : '';
      const valignClass =
        valign === 'middle'
          ? 'justify-center'
          : valign === 'bottom'
            ? 'justify-end'
            : '';
      const raw = content?.trim() ?? '';
      // Without the bold, italic and link marks.
      const text = plainRich(raw);
      const size =
        /^(\p{Extended_Pictographic}|\p{Emoji_Component}|\u200d|\ufe0f){1,8}$/u.test(
          text
        )
          ? 'text-[48px] leading-[52px]'
          : 'text-[20px] leading-[26px]';
      const pad = block.h <= 1 ? 'px-6 justify-center' : 'p-6';
      // bento's quote note: a closing "— Author" line turns the note into a
      // quote with a big opening mark and italic text.
      const lines = text.split('\n');
      const rawLines = raw.split('\n');
      const last = lines[lines.length - 1]?.trim() ?? '';
      const author =
        /^[—–-]\s*\S/.test(last) && lines.length > 1
          ? last.replace(/^[—–-]\s*/, '')
          : null;
      const quote = author ? (
        <div
          className={`flex h-full w-full flex-col overflow-hidden ${pad} ${alignClass} ${valignClass}`}
          style={{ background: color ?? '#FFFFFF' }}
        >
          <span
            className={`font-serif text-[32px] font-bold leading-none ${dark ? 'text-white' : 'text-black'}`}
          >
            &ldquo;
          </span>
          <p
            className={`mt-3 line-clamp-[8] whitespace-pre-wrap text-[20px] italic leading-[26px] ${tone}`}
          >
            <RichText
              text={rawLines.slice(0, -1).join('\n').trim()}
              plainLinks={!!href}
            />
          </p>
          <p
            className={`mt-4 text-[20px] italic leading-[26px] ${dark ? 'text-white/70' : 'text-black/60'}`}
          >
            &mdash; {author}
          </p>
        </div>
      ) : null;
      if (edit) {
        return (
          <NoteEditor
            content={content ?? ''}
            color={color}
            className={cn(pad, alignClass, valignClass)}
            textClass={cn(
              size,
              tone,
              author && 'italic',
              align === 'center' && 'text-center',
              align === 'right' && 'text-right'
            )}
            onChange={(value) => edit.onPatch({ content: value })}
            preview={quote}
          />
        );
      }
      if (author) {
        return (
          <Linked href={href} interactive={interactive}>
            {quote}
          </Linked>
        );
      }
      return (
        <Linked href={href} interactive={interactive}>
          <div
            className={`flex h-full w-full flex-col overflow-hidden ${pad} ${alignClass} ${valignClass}`}
            style={{ background: color ?? '#FFFFFF' }}
          >
            <p
              className={
                text
                  ? `line-clamp-[10] whitespace-pre-wrap ${size} ${tone}`
                  : `text-[20px] leading-[26px] ${dark ? 'text-white/50' : 'text-black/30'}`
              }
            >
              {raw ? (
                <RichText text={raw} plainLinks={!!href} />
              ) : (
                'Add note...'
              )}
            </p>
          </div>
        </Linked>
      );
    }

    case 'MAP': {
      const { location, label, lat, lng } = block.data as {
        location?: string;
        label?: string;
        lat?: number;
        lng?: number;
      };
      if (typeof lat === 'number' && typeof lng === 'number') {
        // Zoomed out a little on large maps, as bento framed them.
        return (
          <div className="relative h-full w-full overflow-hidden">
            <MapTiles
              lat={lat}
              lng={lng}
              zoom={block.h >= 4 ? 10 : 11}
              interactive={interactive}
            />
            <span className="pointer-events-none absolute bottom-4 left-4 line-clamp-2 max-w-[calc(100%-32px)] rounded-[8px] bg-white px-2 py-1.5 text-sm leading-[21px] text-black">
              {label || location}
            </span>
          </div>
        );
      }
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
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-[10px] bg-white/90 px-3 py-1.5 text-sm text-black shadow-sm backdrop-blur-md">
            <MapPin className="size-4" />
            {location || label || 'Where I live'}
          </div>
        </div>
      );
    }

    case 'SECTION_TITLE': {
      const { title } = block.data as { title?: string };
      return (
        <div className="flex h-full w-full items-end px-2 pb-1">
          {edit ? (
            <InlineText
              value={title ?? ''}
              placeholder="Section title"
              onChange={(value) => edit.onPatch({ title: value })}
              className="text-lg font-semibold leading-7 text-black"
            />
          ) : (
            <h2 className="text-lg font-semibold leading-7 text-black">
              {title || 'Section'}
            </h2>
          )}
        </div>
      );
    }
  }
}
