'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, Navigation, Search } from 'lucide-react';
import { Block } from '@/lib';
import { isVideoUrl } from '@/lib/media';
import { isQuote } from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { NO_DRAG } from './no-drag';
import { BentoTooltip } from '@/components/common/bento-tooltip';
import { tileAspect } from '../link-tile';
import {
  AlignBottomIcon,
  AlignCenterIcon,
  AlignLeftIcon,
  AlignMiddleIcon,
  AlignRightIcon,
  AlignTopIcon,
  CropIcon,
  LinkIcon,
  LinkSetIcon,
  MoreIcon,
  SizeBarIcon,
  SizeLargeIcon,
  SizeSmallIcon,
  SizeTallIcon,
  SizeWideIcon,
} from './toolbar-icons';

// bento's widget sizes, as w×h on the editor grid. Notes and links also come
// as a slim bar.
export const SIZES = [
  { w: 1, h: 2, label: 'Small', Icon: SizeSmallIcon },
  { w: 2, h: 1, label: 'Bar', Icon: SizeBarIcon },
  { w: 2, h: 2, label: 'Wide', Icon: SizeWideIcon },
  { w: 1, h: 4, label: 'Tall', Icon: SizeTallIcon },
  { w: 2, h: 4, label: 'Large', Icon: SizeLargeIcon },
];

// The sizes a widget can take: only notes and links come as a slim bar.
export const sizesFor = (type: string) =>
  SIZES.filter((s) => s.h > 1 || type === 'TEXT' || type === 'LINK');

// bento's note palette: 16 colours, and the text on a note is white on
// anything darker than brightness 190, black otherwise.
export const NOTE_COLORS = [
  '#FFFFFF',
  '#FAFAFA',
  '#5AB2E6',
  '#2292E2',
  '#2768B1',
  '#F6C823',
  '#F89F21',
  '#F96F20',
  '#494949',
  '#000000',
  '#E6B1F3',
  '#E487D7',
  '#DD5ABB',
  '#A6F9E8',
  '#3EB59D',
  '#1B7865',
];

// Natural width over height of a picture, loaded once per address.
const aspects = new Map<string, number>();
export function useImageAspect(src?: string) {
  const [aspect, setAspect] = useState<number | null>(
    src ? (aspects.get(src) ?? null) : null
  );
  useEffect(() => {
    if (!src) return setAspect(null);
    const known = aspects.get(src);
    if (known !== undefined) return setAspect(known);
    const image = new Image();
    image.onload = () => {
      const value = image.naturalWidth / image.naturalHeight;
      aspects.set(src, value);
      setAspect(value);
    };
    image.src = src;
  }, [src]);
  return aspect;
}

export interface Place {
  name: string;
  lat: number;
  lng: number;
}

type Panel = 'more' | 'color' | 'link' | 'search' | null;

// The black menu and its drop shadow, as bento draws them.
const MENU_SURFACE =
  'rounded-[10px] bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,.2),0_9px_13px_rgba(0,0,0,.05),0_5.83px_7.61px_rgba(0,0,0,.038),0_3.47px_4.14px_rgba(0,0,0,.03),0_1.8px_2.11px_rgba(0,0,0,.025),0_.73px_1.06px_rgba(0,0,0,.02),0_.17px_.51px_rgba(0,0,0,.012)]';

// bento's toolbar button: a 36px square, white with black icon when on.
function StyleButton({
  label,
  selected,
  mode,
  disabled,
  onClick,
  className,
  children,
}: {
  label: string;
  selected?: boolean;
  // bento's green on-state, for modes such as crop.
  mode?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={selected}
      disabled={disabled}
      // Keeps the note's text selected while a button is used.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'flex size-[26px] shrink-0 items-center justify-center rounded-[4px] outline-none transition-[transform,color] duration-100 [transition-timing-function:cubic-bezier(.427,.073,.105,.997)] disabled:bg-transparent disabled:text-white/40',
        !disabled && 'active:scale-90',
        selected && mode
          ? 'bg-[#4ED975] text-white'
          : selected
            ? 'bg-white text-black hover:bg-[#fafafa] active:bg-[#f2f2f2]'
            : 'not-disabled:active:bg-white/30 text-white',
        className
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="h-3 w-0.5 shrink-0 rounded-full bg-white/[.18]" />;
}

// The menu that drops under the toolbar. It slides in like bento's and stays
// 16px inside the screen, so it works at phone width.
function Submenu({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const { left, right } = el.getBoundingClientRect();
    const margin = 16;
    const width = document.documentElement.clientWidth;
    const natural = left - shift;
    const naturalRight = right - shift;
    if (natural < margin) setShift(margin - natural);
    else if (naturalRight > width - margin)
      setShift(width - margin - naturalRight);
    else if (shift) setShift(0);
  });
  return (
    <div
      ref={box}
      className="absolute left-1/2 top-full z-10 mt-3 -translate-x-1/2"
      style={{ marginLeft: shift }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.29, 1.28, 0.47, 0.99] }}
        className={cn(MENU_SURFACE, className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

// bento's link field, with a button that clears it.
function LinkField({
  value,
  onChange,
  onDone,
}: {
  value: string;
  onChange: (value: string) => void;
  onDone: () => void;
}) {
  const [text, setText] = useState(value);
  const set = (next: string) => {
    setText(next);
    onChange(next);
  };
  return (
    <form
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onDone();
      }}
    >
      <input
        autoFocus
        aria-label="Link"
        placeholder="Enter link here"
        value={text}
        onChange={(e) => set(e.target.value)}
        className="w-full rounded-[4px] bg-white/20 px-1.5 py-[3px] pr-7 text-sm text-white outline-none placeholder:text-white/40"
      />
      {text && (
        <button
          type="button"
          aria-label="Clear link"
          onClick={() => set('')}
          className="absolute right-0.5 top-0 flex h-full w-6 items-center justify-center"
        >
          <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.70711 0.792893C1.31658 0.402369 0.683417 0.402369 0.292893 0.792893C-0.0976311 1.18342 -0.0976311 1.81658 0.292893 2.20711L2.58579 4.5L0.292893 6.79289C-0.0976311 7.18342 -0.0976311 7.81658 0.292893 8.20711C0.683417 8.59763 1.31658 8.59763 1.70711 8.20711L4 5.91421L6.29289 8.20711C6.68342 8.59763 7.31658 8.59763 7.70711 8.20711C8.09763 7.81658 8.09763 7.18342 7.70711 6.79289L5.41421 4.5L7.70711 2.20711C8.09763 1.81658 8.09763 1.18342 7.70711 0.792893C7.31658 0.402369 6.68342 0.402369 6.29289 0.792893L4 3.08579L1.70711 0.792893Z"
              fill="white"
            />
          </svg>
        </button>
      )}
    </form>
  );
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

interface WidgetToolbarProps {
  block: Block;
  onResize: (w: number, h: number) => void;
  onPatch: (patch: Record<string, unknown>) => void;
  onCrop: () => void;
  // Crop mode is on for this widget.
  cropping: boolean;
  // Whether the widget is selected; its option panels close when it isn't.
  selected: boolean;
}

// The black bar under a selected widget: its sizes, plus that widget's own
// options, edited in place. Built to bento's own editor.
export function WidgetToolbar({
  block,
  onResize,
  onPatch,
  onCrop,
  cropping,
  selected,
}: WidgetToolbarProps) {
  const [panel, setPanel] = useState<Panel>(null);
  useEffect(() => {
    if (!selected) setPanel(null);
  }, [selected]);
  const toggle = (next: Panel) => setPanel((p) => (p === next ? null : next));
  const data = block.data as Record<string, string | undefined>;

  const sizes = SIZES.filter(
    (s) => s.h > 1 || block.type === 'TEXT' || block.type === 'LINK'
  );
  const isImage =
    block.type === 'IMAGE' &&
    !!data.url &&
    data.kind !== 'video' &&
    !isVideoUrl(data.url);

  // Quotes stay left-aligned and top-aligned, and a bar centres its text.
  const quote = block.type === 'TEXT' && isQuote(data.content ?? '');
  const bar = block.w === 2 && block.h === 1;
  let halign = data.align ?? 'left';
  if (quote && halign === 'center') halign = 'left';
  let valign = data.valign ?? 'top';
  if (bar) valign = 'middle';
  else if (quote) valign = 'top';

  const align = [
    ['left', AlignLeftIcon, false],
    ['center', AlignCenterIcon, quote],
    ['right', AlignRightIcon, false],
  ] as const;
  const vertical = [
    ['top', AlignTopIcon, bar],
    ['middle', AlignMiddleIcon, quote && !bar],
    ['bottom', AlignBottomIcon, bar || quote],
  ] as const;

  const aspect = useImageAspect(isImage ? data.url : undefined);
  // A picture already the shape of its frame has nothing to crop.
  const fits =
    aspect !== null && Math.abs(aspect - tileAspect(block.w, block.h)) <= 0.05;

  const linkIcon = data.href ? (
    <LinkSetIcon size={18} />
  ) : (
    <LinkIcon size={18} />
  );

  return (
    <div className={cn(NO_DRAG, 'relative flex flex-col items-center')}>
      <div className={cn('flex items-center gap-1.5 p-1.5', MENU_SURFACE)}>
        {sizes.map((s) => (
          <StyleButton
            key={s.label}
            label={s.label}
            selected={block.w === s.w && block.h === s.h}
            onClick={() => onResize(s.w, s.h)}
          >
            <s.Icon size={18} />
          </StyleButton>
        ))}

        {block.type === 'TEXT' && (
          <>
            <Divider />
            <StyleButton
              label="More"
              selected={panel !== null}
              onClick={() => setPanel((p) => (p ? null : 'more'))}
            >
              <MoreIcon size={18} />
            </StyleButton>
          </>
        )}

        {block.type === 'IMAGE' && data.url && (
          <>
            <Divider />
            {isImage && (
              <BentoTooltip content="Fits perfectly already" disabled={!fits}>
                <span>
                  <StyleButton
                    label="Crop"
                    mode
                    selected={cropping}
                    disabled={fits}
                    onClick={onCrop}
                  >
                    <CropIcon size={18} />
                  </StyleButton>
                </span>
              </BentoTooltip>
            )}
            <StyleButton
              label="Link"
              selected={panel === 'link'}
              onClick={() => toggle('link')}
            >
              {linkIcon}
            </StyleButton>
          </>
        )}

        {block.type === 'MAP' && (
          <>
            <Divider />
            <StyleButton
              label="Search location"
              selected={panel === 'search'}
              onClick={() => toggle('search')}
            >
              <Search className="size-[18px]" />
            </StyleButton>
          </>
        )}
      </div>

      {block.type === 'TEXT' && panel && (
        <Submenu className="flex flex-col">
          <div className="flex items-center gap-1.5 p-1.5">
            {align.map(([value, Icon, disabled]) => (
              <StyleButton
                key={value}
                label={`Align ${value}`}
                selected={halign === value}
                disabled={disabled}
                onClick={() => onPatch({ align: value })}
              >
                <Icon size={18} />
              </StyleButton>
            ))}
            <Divider />
            {vertical.map(([value, Icon, disabled]) => (
              <StyleButton
                key={value}
                label={`Align ${value}`}
                selected={valign === value}
                disabled={disabled}
                onClick={() => onPatch({ valign: value })}
              >
                <Icon size={18} />
              </StyleButton>
            ))}
            <Divider />
            <StyleButton
              label="Colour"
              selected={panel === 'color'}
              onClick={() =>
                setPanel((p) => (p === 'color' ? 'more' : 'color'))
              }
            >
              <div
                className="size-[18px] rounded-full"
                style={{
                  background: data.color ?? '#FFFFFF',
                  border:
                    panel === 'color'
                      ? '1px solid rgba(0,0,0,0.12)'
                      : '1px solid rgba(255,255,255,0.2)',
                }}
              />
            </StyleButton>
            <StyleButton
              label="Link"
              selected={panel === 'link'}
              onClick={() => setPanel((p) => (p === 'link' ? 'more' : 'link'))}
            >
              {linkIcon}
            </StyleButton>
          </div>

          {panel === 'color' && (
            <>
              <div className="grid w-full grid-cols-8 items-start justify-items-center gap-0.5 p-1.5">
                {NOTE_COLORS.map((c) => {
                  const on = (data.color ?? '#FFFFFF').toUpperCase() === c;
                  return (
                    <StyleButton
                      key={c}
                      label={c}
                      selected={on}
                      className="size-[26px]"
                      onClick={() => onPatch({ color: c })}
                    >
                      <div
                        className="size-[18px] rounded-full"
                        style={{
                          background: c,
                          border: on
                            ? '1px solid rgba(0,0,0,0.12)'
                            : '1px solid rgba(255,255,255,0.2)',
                        }}
                      />
                    </StyleButton>
                  );
                })}
              </div>
              <div className="px-2.5 pb-2">
                <input
                  aria-label="Hex colour"
                  placeholder="#768CFF"
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (HEX.test(value)) {
                      onPatch({
                        color: `#${value.replace('#', '')}`.toUpperCase(),
                      });
                    }
                  }}
                  className="w-full rounded-[4px] bg-white/20 p-1 text-sm text-white outline-none placeholder:text-white/40"
                />
              </div>
            </>
          )}

          {panel === 'link' && (
            <div className="mb-1.5 mt-2 w-full px-1.5">
              <LinkField
                value={data.href ?? ''}
                onChange={(href) => onPatch({ href })}
                onDone={() => setPanel(null)}
              />
            </div>
          )}
        </Submenu>
      )}

      {block.type === 'IMAGE' && panel === 'link' && (
        <Submenu className="p-1.5">
          <LinkField
            value={data.href ?? ''}
            onChange={(href) => onPatch({ href })}
            onDone={() => setPanel(null)}
          />
        </Submenu>
      )}

      {block.type === 'MAP' && panel === 'search' && (
        <Submenu className="w-[300px] p-1.5">
          <MapSearch
            current={data.location}
            onPick={(place) => {
              onPatch({
                location: place.name,
                lat: place.lat,
                lng: place.lng,
              });
              setPanel(null);
            }}
          />
        </Submenu>
      )}
    </div>
  );
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  return response.ok ? response.json() : [];
}

// Live place search (OpenStreetMap), plus the browser's own location.
function MapSearch({
  current,
  onPick,
}: {
  current?: string;
  onPick: (place: Place) => void;
}) {
  const [query, setQuery] = useState(current ?? '');
  const debounced = useDebounce(query.trim(), 350);
  const [places, setPlaces] = useState<Place[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (debounced.length < 2) {
      setPlaces([]);
      return;
    }
    let cancelled = false;
    setBusy(true);
    searchPlaces(debounced)
      .then((results) => !cancelled && setPlaces(results))
      .finally(() => !cancelled && setBusy(false));
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const useMyLocation = () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) =>
      onPick({
        name: 'My location',
        lat: coords.latitude,
        lng: coords.longitude,
      })
    );
  };

  return (
    <div>
      <div className="flex items-center rounded-lg bg-white/10 pr-2">
        <input
          autoFocus
          aria-label="Search location"
          placeholder="Search Location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key !== 'Enter' || query.trim().length < 2) return;
            const [first] = places.length
              ? places
              : await searchPlaces(query.trim());
            if (first) onPick(first);
          }}
          className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          type="button"
          aria-label="Use my location"
          title="Use my location"
          onClick={useMyLocation}
          className="text-white/70 hover:text-white"
        >
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Navigation className="size-4" />
          )}
        </button>
      </div>
      {places.map((place) => (
        <button
          key={`${place.lat},${place.lng}`}
          type="button"
          onClick={() => onPick(place)}
          className="block w-full truncate rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
        >
          {place.name}
        </button>
      ))}
    </div>
  );
}
