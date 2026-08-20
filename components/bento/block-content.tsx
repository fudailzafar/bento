'use client';

import { useRef, useState } from 'react';
import { Block } from '@/lib';
import { LinkTile } from './link-tile';
import { MapTiles } from './map-tiles';
import { NoteEditor, RichText } from './rich-text';
import { parseQuote, plainRich } from '@/lib/rich-text';
import { NO_DRAG } from './editing/no-drag';
import { embedFor } from '@/lib/embeds';
import { asUrl, isVideoUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { ImagePlus, LoaderCircle, MapPin } from 'lucide-react';

// bento's rule: text is white on anything under brightness 190.
function isDark(hex?: string) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return false;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b < 190;
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
  // bento's link overlay: a layer that darkens a little on hover, and the
  // arrow in a blurred disc ringed in white, 14px from the top-right corner.
  const badge = (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] p-[14px]">
      <div className="absolute inset-0 rounded-[inherit] transition-colors duration-150 ease-in-out group-hover/card:bg-black/[.08] group-active/card:bg-black/[.12]" />
      <div className="absolute right-[12px] top-[12px] size-[26px] rounded-full border-2 border-white/20 backdrop-blur-[8px] transition-all duration-150 ease-in-out group-hover/card:border-white/30" />
      <div className="absolute right-[14px] top-[14px] flex size-[22px] items-center justify-center rounded-full bg-black/20 backdrop-blur-[8px] transition-colors duration-150 group-hover/card:bg-black/30">
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3.25403 1.46875C2.83987 1.46875 2.5041 1.80446 2.50403 2.21862C2.50396 2.63289 2.83977 2.96875 3.25403 2.96875H5.94325L1.47358 7.43842C1.18068 7.73131 1.18068 8.20619 1.47358 8.49908C1.76647 8.79197 2.24134 8.79197 2.53424 8.49908L7.00299 4.03033L7.00314 6.71982C7.00316 7.13345 7.34024 7.46875 7.75387 7.46875C8.16752 7.46875 8.50108 7.13342 8.50108 6.71978V2.21875C8.50108 1.80454 8.16529 1.46875 7.75108 1.46875H3.25403Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
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
  // The chosen file, shown while it uploads, and how far along it is (0–1).
  preview?: { url: string; kind: 'image' | 'video' };
  progress?: number;
}

// bento's upload ring: a small circle filling up in the tile's corner.
function UploadRing({ progress = 0 }: { progress?: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg
      className="absolute left-4 top-4 size-6 -rotate-90"
      viewBox="0 0 24 24"
      fill="none"
      role="progressbar"
      aria-label="Uploading"
    >
      <circle
        cx="12"
        cy="12"
        r={r}
        stroke="white"
        strokeOpacity=".5"
        strokeWidth="2.5"
      />
      <circle
        cx="12"
        cy="12"
        r={r}
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.max(progress, 0.08))}
        className="transition-[stroke-dashoffset] duration-200"
      />
    </svg>
  );
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
    <div className="flex h-full w-full flex-col justify-center gap-2 p-[var(--tile-pad,24px)]">
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
      const { alt, href, caption } = block.data as {
        alt?: string;
        href?: string;
        caption?: string;
      };
      const stored = block.data as { url?: string; kind?: 'image' | 'video' };
      // While uploading, the chosen file shows in place of the saved one.
      const url = edit?.preview?.url ?? stored.url;
      const kind = edit?.preview?.kind ?? stored.kind;
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
            {edit?.preview && (
              <>
                <div className="absolute inset-0 bg-black/25" />
                <UploadRing progress={edit.progress} />
              </>
            )}
            {edit ? (
              // The caption pill is typed into directly; empty, it shows on
              // hover as a "Caption..." prompt.
              <div
                className={cn(
                  'absolute bottom-4 left-4 max-w-[calc(100%-32px)] rounded-[var(--caption-radius,8px)] bg-white px-2 py-1.5',
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
                <span className="absolute bottom-4 left-4 line-clamp-2 max-w-[calc(100%-32px)] rounded-[var(--caption-radius,8px)] bg-white px-2 py-1.5 text-sm leading-[21px] text-black">
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
      // Quotes stay left and top aligned; a bar centres its text.
      const isQuoteNote = !!parseQuote(content ?? '');
      const bar = block.w === 2 && block.h === 1;
      const halign =
        align === 'center' && isQuoteNote ? 'left' : (align ?? 'left');
      const valignEff = bar ? 'middle' : isQuoteNote ? 'top' : valign;
      const alignClass =
        halign === 'center'
          ? 'text-center items-center'
          : halign === 'right'
            ? 'text-right items-end'
            : '';
      const valignClass =
        valignEff === 'middle'
          ? 'justify-center'
          : valignEff === 'bottom'
            ? 'justify-end'
            : '';
      const raw = content?.trim() ?? '';
      // Without the bold and italic marks.
      const text = plainRich(raw);
      const quote = parseQuote(content ?? '');
      // bento enlarges a lone emoji (48px) or symbol such as an arrow (64px).
      const lone = [...new Intl.Segmenter().segment(text.trim())].length === 1;
      const emojiOnly =
        /^(\p{Extended_Pictographic}|\p{Emoji_Component}|\u200d|\ufe0f){1,8}$/u.test(
          text
        );
      const size = quote
        ? 'text-[length:calc(20px*var(--ws,1))] leading-[calc(26px*var(--ws,1))]'
        : emojiOnly
          ? 'text-[48px] leading-[52px]'
          : lone
            ? 'text-[64px] leading-[56px]'
            : 'text-[length:calc(20px*var(--ws,1))] leading-[calc(26px*var(--ws,1))]';
      const pad =
        block.h <= 1
          ? 'px-[calc(24px*var(--ws,1))] justify-center'
          : 'p-[calc(24px*var(--ws,1))]';
      // bento's quote note: a big opening mark, italic text, and an author
      // line (a dash, then the name) set apart and softened.
      const quoteView = quote ? (
        <div
          className={`relative flex h-full w-full flex-col overflow-hidden ${pad} ${alignClass} ${valignClass} ${tone}`}
          style={{ background: color ?? '#FFFFFF' }}
        >
          <span
            className={
              'quote-symbol block text-[length:calc(60px*var(--ws,1))] font-bold not-italic leading-[calc(52px*var(--ws,1))]'
            }
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p
            className={
              'line-clamp-[8] whitespace-pre-wrap text-[20px] italic leading-[26px]'
            }
          >
            <RichText text={quote.body} />
          </p>
          {quote.cite && (
            <p
              className={
                'mt-[calc(22px*var(--ws,1))] text-[20px] italic leading-[26px] opacity-60'
              }
            >
              &mdash; {quote.cite}
            </p>
          )}
        </div>
      ) : null;
      if (edit) {
        return (
          <NoteEditor
            content={content ?? ''}
            color={color}
            className={cn(pad, alignClass, valignClass, tone)}
            textClass={cn(
              size,
              tone,
              halign === 'center' && 'text-center',
              halign === 'right' && 'text-right'
            )}
            onChange={(value) => edit.onPatch({ content: value })}
            preview={quoteView}
          />
        );
      }
      if (quoteView) {
        return (
          <Linked href={href} interactive={interactive}>
            {quoteView}
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
                raw
                  ? `line-clamp-[10] whitespace-pre-wrap ${size} ${tone}`
                  : `text-[length:calc(20px*var(--ws,1))] leading-[calc(26px*var(--ws,1))] ${dark ? 'text-white/50' : 'text-black/30'}`
              }
            >
              {raw ? <RichText text={raw} /> : 'Add note...'}
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
            <span className="pointer-events-none absolute bottom-4 left-4 line-clamp-2 max-w-[calc(100%-32px)] rounded-[var(--caption-radius,8px)] bg-white px-2 py-1.5 text-sm leading-[21px] text-black">
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
        // bento's section title: 16px padding and 8px more indent, so the
        // text starts 24px in and 16px down in its 60px box.
        <div className="flex h-full w-full items-start px-6 py-4">
          {edit ? (
            <InlineText
              value={title ?? ''}
              placeholder="Section title"
              onChange={(value) => edit.onPatch({ title: value })}
              className="text-[18px] font-semibold leading-7 text-black"
            />
          ) : (
            <h2 className="text-[18px] font-semibold leading-7 text-black">
              {title || 'Section'}
            </h2>
          )}
        </div>
      );
    }
  }
}
