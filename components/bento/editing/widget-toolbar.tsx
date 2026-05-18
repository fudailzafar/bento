'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  Crop,
  Ellipsis,
  ImageUp,
  Link2,
  Navigation,
  Search,
} from 'lucide-react';
import { Block } from '@/lib';
import { asUrl, isVideoUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { NO_DRAG } from './no-drag';

// bento's widget sizes, as w×h on the editor grid. Notes and links also come
// as a slim bar.
const SIZES = [
  { w: 1, h: 2, label: 'Small', box: 'h-[9px] w-[9px] rounded-[2px]' },
  { w: 2, h: 1, label: 'Bar', box: 'h-[5px] w-[17px] rounded-[2px]' },
  { w: 2, h: 2, label: 'Wide', box: 'h-[9px] w-[17px] rounded-[3px]' },
  { w: 1, h: 4, label: 'Tall', box: 'h-[17px] w-[9px] rounded-[3px]' },
  { w: 2, h: 4, label: 'Large', box: 'h-[17px] w-[17px] rounded-[4px]' },
];

// bento's note palette.
const NOTE_COLORS = [
  '#FFFFFF',
  '#F5F5F5',
  '#8EC3EF',
  '#4C97E8',
  '#2F5BA5',
  '#F5D04E',
  '#F4A541',
  '#EE7539',
  '#4A4A4A',
  '#141414',
  '#E9B8F2',
  '#DB8EDB',
  '#D24FA8',
  '#B9F2E2',
  '#5DB89A',
  '#2E7A5B',
];

const LOCATIONS = [
  'Berlin, Germany',
  'New York, United States',
  'Tokyo, Japan',
];

type Panel = 'more' | 'color' | 'link' | 'search' | null;

function ToolButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg transition-colors',
        active
          ? 'bg-white text-black'
          : 'text-white hover:bg-white/15 active:bg-white/25'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-4 w-px bg-white/20" />;
}

interface WidgetToolbarProps {
  block: Block;
  onResize: (w: number, h: number) => void;
  onPatch: (patch: Record<string, unknown>) => void;
  onSetUrl: (url: string) => void;
  onReplace: (file: File) => void;
  onCrop: () => void;
  // Whether the widget is selected; its option panels close when it isn't.
  selected: boolean;
}

// The black bar under a selected widget: its sizes, plus that widget's own
// options, edited in place.
export function WidgetToolbar({
  block,
  onResize,
  onPatch,
  onSetUrl,
  onReplace,
  onCrop,
  selected,
}: WidgetToolbarProps) {
  const [panel, setPanel] = useState<Panel>(null);
  useEffect(() => {
    if (!selected) setPanel(null);
  }, [selected]);
  const toggle = (next: Panel) => setPanel((p) => (p === next ? null : next));
  const fileInput = useRef<HTMLInputElement>(null);
  const data = block.data as Record<string, string | undefined>;

  const sizes = SIZES.filter(
    (s) => s.h > 1 || block.type === 'TEXT' || block.type === 'LINK'
  );
  const isImage =
    block.type === 'IMAGE' &&
    !!data.url &&
    data.kind !== 'video' &&
    !isVideoUrl(data.url);

  return (
    <div className={cn(NO_DRAG, 'relative flex flex-col items-center')}>
      <div className="flex items-center gap-0.5 rounded-[14px] bg-black p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        {sizes.map((s) => (
          <ToolButton
            key={s.label}
            label={s.label}
            active={block.w === s.w && block.h === s.h}
            onClick={() => onResize(s.w, s.h)}
          >
            <span className={cn('border-2 border-current', s.box)} />
          </ToolButton>
        ))}

        {block.type === 'TEXT' && (
          <>
            <Divider />
            <ToolButton
              label="More"
              active={panel !== null}
              onClick={() => setPanel((p) => (p ? null : 'more'))}
            >
              <Ellipsis className="size-4" />
            </ToolButton>
          </>
        )}

        {block.type === 'IMAGE' && data.url && (
          <>
            <Divider />
            {isImage && (
              <ToolButton label="Crop" onClick={onCrop}>
                <Crop className="size-4" />
              </ToolButton>
            )}
            <ToolButton
              label="Replace"
              onClick={() => fileInput.current?.click()}
            >
              <ImageUp className="size-4" />
            </ToolButton>
            <ToolButton
              label="Link"
              active={panel === 'link'}
              onClick={() => toggle('link')}
            >
              <Link2 className="size-4" />
            </ToolButton>
            <input
              ref={fileInput}
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onReplace(file);
                e.target.value = '';
              }}
            />
          </>
        )}

        {block.type === 'LINK' && data.url && (
          <>
            <Divider />
            <ToolButton
              label="Change link"
              active={panel === 'link'}
              onClick={() => toggle('link')}
            >
              <Link2 className="size-4" />
            </ToolButton>
          </>
        )}

        {block.type === 'MAP' && (
          <>
            <Divider />
            <ToolButton
              label="Search location"
              active={panel === 'search'}
              onClick={() => toggle('search')}
            >
              <Search className="size-4" />
            </ToolButton>
          </>
        )}
      </div>

      {panel && (
        <div className="absolute top-full z-10 mt-2 w-[300px] rounded-[14px] bg-black p-2 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          {block.type === 'TEXT' && (
            <div className="flex items-center gap-0.5">
              {(
                [
                  ['left', AlignLeft],
                  ['center', AlignCenter],
                  ['right', AlignRight],
                ] as const
              ).map(([value, Icon]) => (
                <ToolButton
                  key={value}
                  label={`Align ${value}`}
                  active={(data.align ?? 'left') === value}
                  onClick={() => onPatch({ align: value })}
                >
                  <Icon className="size-4" />
                </ToolButton>
              ))}
              <Divider />
              {(
                [
                  ['top', AlignVerticalJustifyStart],
                  ['middle', AlignVerticalJustifyCenter],
                  ['bottom', AlignVerticalJustifyEnd],
                ] as const
              ).map(([value, Icon]) => (
                <ToolButton
                  key={value}
                  label={`Align ${value}`}
                  active={(data.valign ?? 'top') === value}
                  onClick={() => onPatch({ valign: value })}
                >
                  <Icon className="size-4" />
                </ToolButton>
              ))}
              <Divider />
              <ToolButton
                label="Colour"
                active={panel === 'color'}
                onClick={() =>
                  setPanel((p) => (p === 'color' ? 'more' : 'color'))
                }
              >
                <span
                  className="size-4 rounded-full border border-white/40"
                  style={{ background: data.color ?? '#FFFFFF' }}
                />
              </ToolButton>
              <ToolButton
                label="Link"
                active={panel === 'link'}
                onClick={() =>
                  setPanel((p) => (p === 'link' ? 'more' : 'link'))
                }
              >
                <Link2 className="size-4" />
              </ToolButton>
            </div>
          )}

          {block.type === 'TEXT' && panel === 'color' && (
            <div className="mt-2">
              <div className="grid grid-cols-8 gap-1.5 px-1">
                {NOTE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={() => onPatch({ color: c })}
                    className={cn(
                      'size-7 rounded-full border border-white/20 transition-transform hover:scale-110',
                      (data.color ?? '#FFFFFF').toUpperCase() === c &&
                        'ring-2 ring-white ring-offset-2 ring-offset-black'
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <input
                aria-label="Hex colour"
                defaultValue={data.color ?? '#FFFFFF'}
                key={data.color}
                placeholder="#768CFF"
                onKeyDown={(e) => {
                  const value = e.currentTarget.value.trim();
                  if (e.key === 'Enter' && /^#[0-9a-f]{6}$/i.test(value)) {
                    onPatch({ color: value.toUpperCase() });
                  }
                }}
                className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
              />
            </div>
          )}

          {panel === 'link' && (
            <input
              autoFocus
              aria-label="Link"
              placeholder="Enter link here"
              defaultValue={
                (block.type === 'LINK' ? data.url : data.href) ?? ''
              }
              onChange={(e) => {
                if (block.type !== 'LINK') onPatch({ href: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                if (block.type === 'LINK') {
                  const url = asUrl(e.currentTarget.value);
                  if (url) onSetUrl(url);
                }
                setPanel(null);
              }}
              className={cn(
                'w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40',
                block.type === 'TEXT' && 'mt-2'
              )}
            />
          )}

          {panel === 'search' && (
            <MapSearch
              current={data.location}
              onPick={(location) => {
                onPatch({ location });
                setPanel(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function MapSearch({
  current,
  onPick,
}: {
  current?: string;
  onPick: (location: string) => void;
}) {
  const [query, setQuery] = useState(current ?? '');
  const matches = LOCATIONS.filter((l) =>
    l.toLowerCase().includes(query.trim().toLowerCase())
  );
  return (
    <div>
      <div className="flex items-center rounded-lg bg-white/10 pr-2">
        <input
          autoFocus
          aria-label="Search location"
          placeholder="Search Location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) onPick(query.trim());
          }}
          className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          type="button"
          aria-label="Use this location"
          onClick={() => query.trim() && onPick(query.trim())}
          className="text-white/70 hover:text-white"
        >
          <Navigation className="size-4" />
        </button>
      </div>
      {(query.trim() ? matches : LOCATIONS).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onPick(l)}
          className="block w-full rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10"
        >
          {l}
        </button>
      ))}
    </div>
  );
}
