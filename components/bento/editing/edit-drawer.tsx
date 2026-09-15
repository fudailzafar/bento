'use client';

import { useEffect, useRef, useState } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { LoaderCircle, Navigation, Plus, X } from 'lucide-react';
import { Block } from '@/lib';
import { findPlatform } from '@/lib/platforms';
import { isQuote } from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { BlockContent, type BlockEditing } from '../block-content';
import { Icon as TileIcon, tileAspect } from '../link-tile';
import { MapTiles } from '../map-tiles';
import { UploadRing } from '../upload-ring';
import { CropEditor } from './crop-editor';
import {
  AlignBottomIcon,
  AlignCenterIcon,
  AlignLeftIcon,
  AlignMiddleIcon,
  AlignRightIcon,
  AlignTopIcon,
  CropIcon,
  DeletePictureIcon,
  WebsitePictureIcon,
} from './toolbar-icons';
import {
  NOTE_COLORS,
  searchPlaces,
  useImageAspect,
  type Place,
} from './widget-toolbar';
import { widgetRadius } from './widget-radius';

// bento's phone editor: a white sheet that rises from the bottom, one layout
// per kind of widget, with a green Done at the top right.

const FIELD =
  'w-full rounded-xl bg-[#f7f7f7] px-4 py-3.5 text-base leading-5 text-black outline-none placeholder:text-black/35';
const SQUARE =
  'flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-white text-black shadow-[0_0_0_1px_rgba(0,0,0,.05),0_1px_3px_rgba(0,0,0,.1)] outline-none transition-transform active:scale-95';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 ml-1.5 mt-7 text-base leading-5 text-black/60">
      {children}
    </p>
  );
}

function Header({
  onDone,
  onCancel,
  doneLabel = 'Done',
}: {
  onDone: () => void;
  onCancel?: () => void;
  doneLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 pb-1 pt-5">
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-xl bg-[#f7f7f7] px-6 text-base font-semibold text-black outline-none active:scale-[.97]"
        >
          Cancel
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onDone}
        className="h-11 min-w-[100px] rounded-xl bg-[#4ED975] px-6 text-base font-semibold text-white shadow-[0_3px_4px_rgba(0,0,0,.08)] outline-none transition-[transform,background-color] duration-100 active:scale-[.97] active:bg-[#32CA5C]"
      >
        {doneLabel}
      </button>
    </div>
  );
}

// The green upload button, with bento's size advice under it.
function UploadButton({
  onFile,
  uploading,
  accept,
  hint = 'Best 1200×630',
}: {
  onFile: (file: File) => void;
  uploading?: boolean;
  accept: string;
  hint?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="flex h-[52px] flex-1 flex-col items-center justify-center rounded-xl bg-[#4ED975] text-white outline-none transition-transform active:scale-[.98]"
      >
        {uploading ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : (
          <>
            <span className="text-base font-semibold leading-5">
              Upload Image or Video
            </span>
            <span className="text-xs leading-4">{hint}</span>
          </>
        )}
      </button>
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
    </>
  );
}

function TextField({
  value,
  onChange,
  placeholder,
  right,
  autoFocus,
  inputMode,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  right?: React.ReactNode;
  autoFocus?: boolean;
  inputMode?: 'url' | 'text';
}) {
  return (
    <div className="relative">
      <input
        autoFocus={autoFocus}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(FIELD, right && 'pr-14')}
      />
      {right && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div>
      )}
    </div>
  );
}

// A clear (×) button inside a field.
function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Clear"
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,.12)] active:scale-95"
    >
      <X className="size-5" />
    </button>
  );
}

// -------------------------------------------------------------------- link

function LinkBody({ block, edit }: { block: Block; edit: BlockEditing }) {
  const data = block.data as {
    url?: string;
    title?: string;
    image?: string;
    customImage?: string;
    favicon?: string;
    images?: string[];
    bio?: string;
  };
  const url = data.url ?? '';
  const platform = findPlatform(url);
  const effective =
    data.customImage !== undefined ? data.customImage : data.image;
  const shown = edit.preview?.url ?? (effective || undefined);
  const gallery = data.images ?? [];

  return (
    <>
      <div className="mt-6">
        <TileIcon
          large
          icon={platform?.icon}
          src={platform?.iconSrc}
          url={url}
          favicon={data.favicon || undefined}
          loading={edit.fetching}
        />
      </div>

      {platform?.posts ? (
        <>
          <Label>Preview Pictures</Label>
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((src, i) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f7]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove picture"
                  onClick={() =>
                    edit.onPatch({ images: gallery.filter((_, j) => j !== i) })
                  }
                  className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-white shadow"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            {gallery.length < 6 && (
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl bg-[#f7f7f7] text-black/50 active:scale-95">
                {edit.uploading ? (
                  <LoaderCircle className="size-6 animate-spin" />
                ) : (
                  <Plus className="size-6" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) edit.onUpload(file, 'gallery');
                    e.target.value = '';
                  }}
                />
              </label>
            )}
          </div>
          {platform.bio && (
            <>
              <Label>Bio</Label>
              <textarea
                value={data.bio ?? ''}
                maxLength={280}
                rows={3}
                onChange={(e) => edit.onPatch({ bio: e.target.value })}
                className={cn(FIELD, 'resize-none')}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Label>Preview Image</Label>
          <div className="relative flex min-h-[176px] items-center justify-center overflow-hidden rounded-xl border border-black/[.08] bg-[#f4f4f4]">
            {shown ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={shown}
                alt=""
                referrerPolicy="no-referrer"
                className="max-h-[260px] w-full object-cover"
              />
            ) : edit.fetching ? (
              <div className="bento-skeleton absolute inset-0" />
            ) : (
              <p className="px-6 text-center text-base text-black/60">
                Seems like there’s no preview image.
              </p>
            )}
            {edit.preview && (
              <>
                <div className="absolute inset-0 bg-black/25" />
                <UploadRing progress={edit.progress} />
              </>
            )}
          </div>
          <div className="mt-3 flex gap-2">
            <UploadButton
              accept="image/*"
              uploading={edit.uploading}
              onFile={(file) => edit.onUpload(file, 'customImage')}
            />
            {data.customImage !== undefined && (
              <button
                type="button"
                aria-label="Use website picture"
                onClick={() => edit.onPatch({ customImage: undefined })}
                className={SQUARE}
              >
                <WebsitePictureIcon size={22} />
              </button>
            )}
            {!!shown && (
              <button
                type="button"
                aria-label="Delete picture"
                onClick={() => edit.onPatch({ customImage: '' })}
                className={cn(SQUARE, 'text-[#ff2222]')}
              >
                <DeletePictureIcon size={22} />
              </button>
            )}
          </div>
        </>
      )}

      <Label>Title</Label>
      <TextField
        value={data.title ?? ''}
        placeholder="Title"
        onChange={(title) => edit.onPatch({ title })}
      />
    </>
  );
}

// ------------------------------------------------------------------- image

function ImageBody({ block, edit }: { block: Block; edit: BlockEditing }) {
  const data = block.data as {
    url?: string;
    kind?: 'image' | 'video';
    caption?: string;
    href?: string;
    posX?: number;
    posY?: number;
  };
  const [cropping, setCropping] = useState(false);
  const url = edit.preview?.url ?? data.url;
  const video = (edit.preview?.kind ?? data.kind) === 'video';
  const aspect = tileAspect(block.w, block.h);
  const natural = useImageAspect(!video ? data.url : undefined);
  const fits = natural !== null && Math.abs(natural - aspect) <= 0.05;
  const radius = widgetRadius(block);

  return (
    <>
      <Label>Preview Image</Label>
      <div className="flex justify-center overflow-hidden rounded-[20px] bg-[#f7f7f7] px-6 py-10">
        <div
          className="relative"
          style={{
            aspectRatio: String(aspect),
            width: `min(100%, ${Math.round(250 * aspect)}px)`,
          }}
        >
          {cropping && data.url ? (
            <CropEditor
              src={data.url}
              posX={data.posX ?? 0.5}
              posY={data.posY ?? 0.5}
              radius={radius}
              onCommit={(pos) => edit.onPatch(pos)}
            />
          ) : (
            <div
              className="relative size-full overflow-hidden bg-white shadow-[0_2px_4px_rgba(0,0,0,.08)]"
              style={{ borderRadius: radius }}
            >
              {url &&
                (video ? (
                  <video
                    src={url}
                    className="size-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt=""
                    className="size-full object-cover"
                    style={{
                      objectPosition: `${(data.posX ?? 0.5) * 100}% ${(data.posY ?? 0.5) * 100}%`,
                    }}
                  />
                ))}
              {data.caption && (
                <span className="absolute bottom-3 left-3 line-clamp-2 max-w-[calc(100%-24px)] rounded-lg bg-white px-2 py-1 text-xs leading-4 text-black">
                  {data.caption}
                </span>
              )}
              {edit.preview && (
                <>
                  <div className="absolute inset-0 bg-black/25" />
                  <UploadRing progress={edit.progress} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <UploadButton
          accept="image/*,video/mp4,video/webm,video/quicktime"
          uploading={edit.uploading}
          onFile={(file) => {
            setCropping(false);
            edit.onUpload(file, 'url');
          }}
        />
        {!video && !!data.url && (
          <button
            type="button"
            aria-label="Crop"
            aria-pressed={cropping}
            disabled={fits}
            onClick={() => setCropping((c) => !c)}
            className={cn(
              SQUARE,
              cropping && 'bg-[#4ED975] text-white',
              fits && 'opacity-40'
            )}
          >
            <CropIcon size={22} />
          </button>
        )}
      </div>

      <Label>Caption</Label>
      <TextField
        value={data.caption ?? ''}
        placeholder="Caption"
        onChange={(caption) => edit.onPatch({ caption })}
        right={
          data.caption ? (
            <ClearButton onClick={() => edit.onPatch({ caption: '' })} />
          ) : null
        }
      />

      <Label>Link</Label>
      <TextField
        value={data.href ?? ''}
        inputMode="url"
        onChange={(href) => edit.onPatch({ href })}
      />
    </>
  );
}

// -------------------------------------------------------------------- note

function TextBody({ block, edit }: { block: Block; edit: BlockEditing }) {
  const data = block.data as {
    content?: string;
    color?: string;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
    href?: string;
  };
  const quote = isQuote(data.content ?? '');
  const bar = block.w === 2 && block.h === 1;
  const tileW = block.w >= 2 ? 390 : 175;
  const tileH = block.h >= 4 ? 390 : block.h <= 1 ? 67.5 : 175;
  const k = Math.min(1, 300 / tileW);
  const halign =
    quote && data.align === 'center' ? 'left' : (data.align ?? 'left');
  const valign = bar ? 'middle' : quote ? 'top' : (data.valign ?? 'top');

  const choice = (
    on: boolean,
    disabled: boolean,
    label: string,
    onClick: () => void,
    icon: React.ReactNode
  ) => (
    <button
      key={label}
      type="button"
      aria-label={label}
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-11 flex-1 items-center justify-center rounded-lg outline-none transition-transform active:scale-95 disabled:opacity-30',
        on ? 'bg-black text-white' : 'bg-[#f7f7f7] text-black'
      )}
    >
      {icon}
    </button>
  );

  return (
    <>
      <Label>Note</Label>
      <div className="flex justify-center rounded-[20px] bg-[#f7f7f7] px-4 py-6">
        {/* The real widget at full size, scaled down to fit the sheet. */}
        <div
          className="relative overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,.08)]"
          style={{
            width: tileW * k,
            height: tileH * k,
            borderRadius: widgetRadius(block) * k,
          }}
        >
          <div
            className="origin-top-left"
            style={
              {
                width: tileW,
                height: tileH,
                transform: `scale(${k})`,
                '--ws': 1,
                '--tile-pad': '24px',
              } as React.CSSProperties
            }
          >
            <BlockContent block={block} edit={{ ...edit, inline: true }} />
          </div>
        </div>
      </div>

      <Label>Color</Label>
      <div className="grid grid-cols-8 gap-1.5">
        {NOTE_COLORS.map((c) => {
          const on = (data.color ?? '#FFFFFF').toUpperCase() === c;
          return (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={on}
              onClick={() => edit.onPatch({ color: c })}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg outline-none active:scale-95',
                on ? 'bg-black/[.08]' : ''
              )}
            >
              <span
                className="size-7 rounded-full border border-black/[.12]"
                style={{ background: c }}
              />
            </button>
          );
        })}
      </div>

      <Label>Alignment</Label>
      <div className="flex gap-1.5">
        {choice(
          halign === 'left',
          false,
          'Align left',
          () => edit.onPatch({ align: 'left' }),
          <AlignLeftIcon size={20} />
        )}
        {choice(
          halign === 'center',
          quote,
          'Align center',
          () => edit.onPatch({ align: 'center' }),
          <AlignCenterIcon size={20} />
        )}
        {choice(
          halign === 'right',
          false,
          'Align right',
          () => edit.onPatch({ align: 'right' }),
          <AlignRightIcon size={20} />
        )}
        <span className="mx-1 w-0.5 self-center rounded-full bg-black/10 py-2.5" />
        {choice(
          valign === 'top',
          bar,
          'Align top',
          () => edit.onPatch({ valign: 'top' }),
          <AlignTopIcon size={20} />
        )}
        {choice(
          valign === 'middle',
          quote && !bar,
          'Align middle',
          () => edit.onPatch({ valign: 'middle' }),
          <AlignMiddleIcon size={20} />
        )}
        {choice(
          valign === 'bottom',
          bar || quote,
          'Align bottom',
          () => edit.onPatch({ valign: 'bottom' }),
          <AlignBottomIcon size={20} />
        )}
      </div>

      <Label>Link</Label>
      <TextField
        value={data.href ?? ''}
        inputMode="url"
        onChange={(href) => edit.onPatch({ href })}
      />
    </>
  );
}

// ----------------------------------------------------------------- section

function SectionBody({ block, edit }: { block: Block; edit: BlockEditing }) {
  const title = (block.data as { title?: string }).title ?? '';
  return (
    <>
      <Label>Title</Label>
      <TextField
        autoFocus
        value={title}
        placeholder="Section title"
        onChange={(value) => edit.onPatch({ title: value })}
      />
    </>
  );
}

// --------------------------------------------------------------------- map

function MapBody({
  block,
  edit,
  onClose,
}: {
  block: Block;
  edit: BlockEditing;
  onClose: () => void;
}) {
  const data = block.data as {
    location?: string;
    label?: string;
    lat?: number;
    lng?: number;
  };
  // Changes wait for Save; Cancel leaves the map as it was.
  const [place, setPlace] = useState({
    location: data.location ?? '',
    lat: data.lat,
    lng: data.lng,
  });
  const [label, setLabel] = useState(data.label ?? '');
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query.trim(), 350);
  const [results, setResults] = useState<Place[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setBusy(true);
    searchPlaces(debounced)
      .then((found) => !cancelled && setResults(found))
      .finally(() => !cancelled && setBusy(false));
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const pick = (p: { name: string; lat: number; lng: number }) => {
    setPlace({ location: p.name, lat: p.lat, lng: p.lng });
    setQuery('');
    setResults([]);
  };
  const locate = () =>
    navigator.geolocation?.getCurrentPosition(({ coords }) =>
      pick({
        name: 'My location',
        lat: coords.latitude,
        lng: coords.longitude,
      })
    );
  const hasMap = typeof place.lat === 'number' && typeof place.lng === 'number';

  return (
    <>
      <Header
        onCancel={onClose}
        doneLabel="Save"
        onDone={() => {
          edit.onPatch({
            location: place.location,
            lat: place.lat,
            lng: place.lng,
            label,
          });
          onClose();
        }}
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-10">
        <Label>Location</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              value={query}
              placeholder={place.location || 'Search...'}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(FIELD, 'pr-14')}
            />
            <button
              type="button"
              aria-label="Use my location"
              onClick={locate}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,.12)] active:scale-95"
            >
              {busy ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Navigation className="size-5" />
              )}
            </button>
          </div>
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7] active:scale-95"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="mt-4">
            {results.map((r) => (
              <button
                key={`${r.lat},${r.lng}`}
                type="button"
                onClick={() => pick(r)}
                className="block w-full px-4 py-3.5 text-left text-lg text-black active:bg-black/[.04]"
              >
                {r.name}
              </button>
            ))}
          </div>
        ) : (
          <>
            <Label>Map</Label>
            <div className="rounded-[20px] bg-[#f7f7f7] p-6">
              <div className="relative h-[190px] overflow-hidden rounded-2xl bg-white">
                {hasMap ? (
                  <MapTiles
                    key={`${place.lat},${place.lng}`}
                    lat={place.lat!}
                    lng={place.lng!}
                    zoom={11}
                  />
                ) : (
                  <p className="flex size-full items-center justify-center text-base text-black/50">
                    Search for a place
                  </p>
                )}
                <span className="pointer-events-none absolute bottom-3 left-3 line-clamp-1 max-w-[calc(100%-24px)] rounded-lg bg-white px-2 py-1 text-sm text-black">
                  {label || place.location}
                </span>
              </div>
            </div>

            <Label>Caption</Label>
            <TextField
              value={label}
              placeholder={place.location || 'Caption'}
              onChange={setLabel}
            />
          </>
        )}
      </div>
    </>
  );
}

// ------------------------------------------------------------------ drawer

export function EditDrawer({
  block,
  edit,
  onClose,
}: {
  block: Block | null;
  edit: BlockEditing | null;
  onClose: () => void;
}) {
  // Keep the last widget while the sheet slides away.
  const last = useRef<{ block: Block; edit: BlockEditing } | null>(null);
  if (block && edit) last.current = { block, edit };
  const shown = block && edit ? { block, edit } : last.current;

  return (
    <DrawerPrimitive.Root
      open={!!block}
      onOpenChange={(open) => !open && onClose()}
      shouldScaleBackground={false}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay
          data-keep-selection
          className="fixed inset-0 z-[80] bg-black/20"
        />
        <DrawerPrimitive.Content
          data-keep-selection
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-[90] mx-auto flex max-h-[92dvh] max-w-[640px] flex-col rounded-t-[32px] bg-white outline-none"
        >
          <DrawerPrimitive.Title className="sr-only">
            Edit widget
          </DrawerPrimitive.Title>
          {shown &&
            (shown.block.type === 'MAP' ? (
              <MapBody
                key={shown.block.id}
                block={shown.block}
                edit={shown.edit}
                onClose={onClose}
              />
            ) : (
              <>
                <Header onDone={onClose} />
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-10">
                  {shown.block.type === 'LINK' && (
                    <LinkBody block={shown.block} edit={shown.edit} />
                  )}
                  {shown.block.type === 'IMAGE' && (
                    <ImageBody
                      key={shown.block.id}
                      block={shown.block}
                      edit={shown.edit}
                    />
                  )}
                  {shown.block.type === 'TEXT' && (
                    <TextBody block={shown.block} edit={shown.edit} />
                  )}
                  {shown.block.type === 'SECTION_TITLE' && (
                    <SectionBody block={shown.block} edit={shown.edit} />
                  )}
                </div>
              </>
            ))}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}
