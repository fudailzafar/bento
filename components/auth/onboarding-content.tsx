'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  Navigation,
  Plus,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Block } from '@/lib';
import { BentoGrid } from '@/components/bento/grid';
import {
  BlockContent,
  type BlockEditing,
} from '@/components/bento/block-content';
import {
  searchPlaces,
  type Place,
} from '@/components/bento/editing/widget-toolbar';
import { LinkIcon } from '@/components/icons';
import { findPlatform } from '@/lib/platforms';
import { PLATFORM_ICONS } from '@/lib/platform-icons';
import {
  checkMediaFile,
  fetchLinkPreview,
  isVideoFile,
  uploadBlockMedia,
} from '@/lib/media';
import { packInOrder } from '@/lib/layout';
import { SOCIALS, cleanHandle } from '@/lib/onboarding';
import { cn } from '@/lib/utils';
import { BUTTON_GRADIENT } from '@/components/preview/section-action-bar';
import { goToOwnPage } from './go-to-own-page';
import { BentoButton } from './bento-ui';

// What bento asks right after sign-up: your social accounts, then a nudge to
// add photos, video, maps and notes, with "Your page" building up beside it.

const id = () => crypto.randomUUID();
const TITLE = 'text-[28px] font-bold leading-[34px] text-black';

// ------------------------------------------------------------------ socials

function PlatformBadge({ socialId }: { socialId: string }) {
  const social = SOCIALS.find((s) => s.id === socialId)!;
  const platform = findPlatform(social.url('x'));
  const svg = platform?.icon ? PLATFORM_ICONS[platform.icon] : undefined;
  return (
    <div className="relative size-[45px] shrink-0 overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,.1)]">
      {svg ? (
        <div className="size-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={platform?.iconSrc} alt={social.name} className="size-full" />
      )}
    </div>
  );
}

function SocialRow({
  socialId,
  value,
  onCommit,
  onRemove,
}: {
  socialId: string;
  value?: string;
  onCommit: (handle: string) => void;
  onRemove: () => void;
}) {
  const [draft, setDraft] = useState('');
  const commit = () => {
    const handle = cleanHandle(draft);
    if (!handle) return;
    onCommit(handle);
    setDraft('');
  };
  const paste = async () => {
    try {
      setDraft(cleanHandle(await navigator.clipboard.readText()));
    } catch {
      // Clipboard access was refused: typing still works.
    }
  };

  return (
    <div className="flex items-center gap-3">
      <PlatformBadge socialId={socialId} />
      {value ? (
        <div className="flex h-[45px] min-w-0 flex-1 items-center gap-2 rounded-xl bg-black px-3.5 text-[15px] text-white">
          <Check className="size-4 shrink-0" strokeWidth={3} />
          <span className="truncate">@{value}</span>
          <button
            type="button"
            aria-label="Remove"
            onClick={onRemove}
            className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-md hover:bg-white/15"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="group flex h-[45px] min-w-0 flex-1 items-center rounded-xl bg-[#f7f7f7] pl-3.5 pr-2 text-[15px] transition-colors focus-within:bg-[#f0f0f0]">
          <span className="text-black">@</span>
          <input
            aria-label={`${socialId} username`}
            value={draft}
            placeholder="username"
            autoCapitalize="none"
            autoCorrect="off"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commit();
              }
            }}
            className="min-w-0 flex-1 bg-transparent px-0.5 text-black outline-none placeholder:text-black/25"
          />
          {draft.trim() ? (
            <button
              type="button"
              onClick={commit}
              className="h-8 shrink-0 rounded-lg bg-[#4ED975] px-3 text-sm font-semibold text-white active:scale-95"
            >
              Add
            </button>
          ) : (
            <button
              type="button"
              onClick={paste}
              className="hidden h-8 shrink-0 rounded-lg bg-white px-3 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(0,0,0,.05),0_1px_2px_rgba(0,0,0,.08)] active:scale-95 group-focus-within:block group-hover:block"
            >
              Paste
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SocialStep({
  handles,
  onCommit,
  onRemove,
  onNext,
}: {
  handles: Record<string, string>;
  onCommit: (socialId: string, handle: string) => void;
  onRemove: (socialId: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <h1 className={TITLE}>
        Now, let&apos;s add your social media accounts to your page.
      </h1>
      <div className="mt-10 flex flex-col gap-3">
        {SOCIALS.map((s) => (
          <SocialRow
            key={s.id}
            socialId={s.id}
            value={handles[s.id]}
            onCommit={(handle) => onCommit(s.id, handle)}
            onRemove={() => onRemove(s.id)}
          />
        ))}
      </div>
      <Actions onNext={onNext} onSkip={onNext} />
    </>
  );
}

function Actions({
  onNext,
  onSkip,
  loading,
}: {
  onNext: () => void;
  onSkip: () => void;
  loading?: boolean;
}) {
  return (
    <div className="mt-10 flex items-center gap-8">
      <BentoButton
        className="h-[42px] w-[194px] !rounded-lg"
        loading={loading}
        onClick={onNext}
      >
        Next
      </BentoButton>
      <button
        type="button"
        onClick={onSkip}
        disabled={loading}
        className="text-[15px] font-semibold text-black active:scale-95"
      >
        Skip
      </button>
    </div>
  );
}

// -------------------------------------------------------------------- media

type SlotId = 'music' | 'note' | 'map' | 'video' | 'link' | 'photo';

const SLOTS: {
  id: SlotId;
  label: string;
  // Place on bento's 4-column grid, in tiles.
  col: number;
  row: number;
  cols: number;
  rows: number;
  // The widget's size in the editor's grid units.
  w: number;
  h: number;
}[] = [
  {
    id: 'music',
    label: 'Add Music',
    col: 1,
    row: 1,
    cols: 1,
    rows: 1,
    w: 1,
    h: 2,
  },
  {
    id: 'note',
    label: 'Add Note',
    col: 1,
    row: 2,
    cols: 1,
    rows: 1,
    w: 1,
    h: 2,
  },
  { id: 'map', label: 'Add Map', col: 2, row: 1, cols: 1, rows: 2, w: 1, h: 4 },
  {
    id: 'video',
    label: 'Add Video',
    col: 3,
    row: 1,
    cols: 1,
    rows: 2,
    w: 1,
    h: 4,
  },
  {
    id: 'link',
    label: 'Add Link',
    col: 4,
    row: 1,
    cols: 1,
    rows: 2,
    w: 1,
    h: 4,
  },
  {
    id: 'photo',
    label: 'Add Photo',
    col: 2,
    row: 3,
    cols: 2,
    rows: 1,
    w: 2,
    h: 2,
  },
];

// bento's suggestion icons: a rounded tile with a soft gloss and a hairline
// border, like the dock's add buttons.
function Gloss({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white shadow-[0_.6px_2px_rgba(0,0,0,.06)]">
      {children}
      <span
        className="pointer-events-none absolute inset-0 rounded-[10px]"
        style={{ background: BUTTON_GRADIENT }}
      />
      <span className="pointer-events-none absolute inset-0 rounded-[10px] border border-black/[.12]" />
    </span>
  );
}

function SlotIcon({ id: slot }: { id: SlotId }) {
  if (slot === 'music') {
    return (
      <Gloss>
        <span
          className="size-full"
          dangerouslySetInnerHTML={{ __html: PLATFORM_ICONS.spotify }}
        />
      </Gloss>
    );
  }
  if (slot === 'link') {
    return (
      <Gloss>
        <LinkIcon className="size-4 text-black" />
      </Gloss>
    );
  }
  const src =
    slot === 'note'
      ? '/text.png'
      : slot === 'map'
        ? '/map.png'
        : '/image_copy.png';
  return (
    <Gloss>
      <Image
        src={src}
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    </Gloss>
  );
}

// A place search that sets the map, shown inside the map's tile.
function MapPicker({ onPick }: { onPick: (place: Place) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return setResults([]);
    setBusy(true);
    const t = setTimeout(
      () =>
        searchPlaces(q)
          .then(setResults)
          .finally(() => setBusy(false)),
      350
    );
    return () => clearTimeout(t);
  }, [query]);
  const locate = () =>
    navigator.geolocation?.getCurrentPosition(({ coords }) =>
      onPick({
        name: 'My location',
        lat: coords.latitude,
        lng: coords.longitude,
      })
    );
  return (
    <div className="flex size-full flex-col gap-2 p-3 pt-11">
      <div className="flex items-center rounded-lg bg-[#f7f7f7] pr-1.5">
        <input
          autoFocus
          value={query}
          placeholder="Search location"
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-black/30"
        />
        <button
          type="button"
          aria-label="Use my location"
          onClick={locate}
          className="p-1"
        >
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Navigation className="size-4" />
          )}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {results.map((r) => (
          <button
            key={`${r.lat},${r.lng}`}
            type="button"
            onClick={() => onPick(r)}
            className="block w-full truncate rounded-lg px-2 py-2 text-left text-sm hover:bg-black/[.04]"
          >
            {r.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Slot({
  def,
  block,
  scale,
  onSet,
  onUpdate,
  onClear,
}: {
  def: (typeof SLOTS)[number];
  block: Block | null;
  scale: number;
  onSet: (block: Block) => void;
  onUpdate: (update: (block: Block) => Block) => void;
  onClear: () => void;
}) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const base = { id: id(), x: 0, y: 0, w: def.w, h: def.h };

  const upload = async (picked: File) => {
    const invalid = checkMediaFile(picked);
    if (invalid) return alert(invalid);
    setBusy(true);
    try {
      const url = await uploadBlockMedia(picked);
      onSet({
        ...base,
        type: 'IMAGE',
        data: { url, kind: isVideoFile(picked) ? 'video' : 'image' },
      } as Block);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setBusy(false);
    }
  };

  const open = () => {
    if (def.id === 'photo' || def.id === 'video') return file.current?.click();
    if (def.id === 'note')
      return onSet({
        ...base,
        type: 'TEXT',
        data: { content: '', color: '#FFFFFF' },
      } as Block);
    if (def.id === 'map')
      return onSet({ ...base, type: 'MAP', data: { location: '' } } as Block);
    onSet({ ...base, type: 'LINK', data: { url: '', title: '' } } as Block);
  };

  const edit: BlockEditing = {
    onPatch: (patch) =>
      onUpdate((b) => ({ ...b, data: { ...b.data, ...patch } })),
    onSetUrl: async (url) => {
      onUpdate((b) => ({ ...b, data: { ...b.data, url, title: 'New link' } }));
      const preview = await fetchLinkPreview(url);
      onUpdate((b) => ({
        ...b,
        data: {
          ...b.data,
          image: preview.image,
          description: preview.description,
          favicon: preview.icon ?? '',
          ...(preview.title && !findPlatform(url)
            ? { title: preview.title }
            : {}),
        },
      }));
    },
    onUpload: () => {},
  };

  const place: React.CSSProperties = {
    gridColumn: `${def.col} / span ${def.cols}`,
    gridRow: `${def.row} / span ${def.rows}`,
  };

  if (!block) {
    return (
      <button
        type="button"
        onClick={open}
        style={{ ...place, borderRadius: 24 * scale }}
        className="group relative flex flex-col items-center justify-center gap-3 border-2 border-dashed border-black/[.06] bg-[#fcfcfc] text-black transition-[background-color,transform] hover:bg-[#f8f8f8] active:scale-[.98]"
      >
        <Plus className="absolute right-4 top-4 size-5 text-black/25" />
        {busy ? (
          <LoaderCircle className="size-6 animate-spin" />
        ) : (
          <SlotIcon id={def.id} />
        )}
        <span
          className="text-base font-semibold"
          style={{ fontSize: Math.max(13, 17 * scale) }}
        >
          {def.label}
        </span>
        <input
          ref={file}
          type="file"
          className="hidden"
          accept={
            def.id === 'photo'
              ? 'image/*'
              : 'video/mp4,video/webm,video/quicktime'
          }
          onChange={(e) => {
            const picked = e.target.files?.[0];
            if (picked) upload(picked);
            e.target.value = '';
          }}
        />
      </button>
    );
  }

  const mapReady =
    block.type !== 'MAP' ||
    typeof (block.data as { lat?: number }).lat === 'number';
  return (
    <div
      style={
        {
          ...place,
          borderRadius: 24 * scale,
          '--widget-radius': `${24 * scale}px`,
          '--ws': scale,
          '--tile-pad': `${24 * scale}px`,
        } as React.CSSProperties
      }
      className="group relative overflow-hidden bg-card shadow-[0_2px_4px_rgba(0,0,0,.04),0_0_0_1px_rgba(0,0,0,.06)]"
    >
      {mapReady ? (
        <BlockContent block={block} edit={edit} />
      ) : (
        <MapPicker
          onPick={(p) =>
            onUpdate((b) => ({
              ...b,
              data: { ...b.data, location: p.name, lat: p.lat, lng: p.lng },
            }))
          }
        />
      )}
      <button
        type="button"
        aria-label="Remove"
        onClick={onClear}
        className="absolute right-2 top-2 z-30 flex size-7 items-center justify-center rounded-full bg-black/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function MediaPreview({
  slots,
  setSlots,
}: {
  slots: Partial<Record<SlotId, Block>>;
  setSlots: React.Dispatch<
    React.SetStateAction<Partial<Record<SlotId, Block>>>
  >;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(820);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => setWidth(el.clientWidth);
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const scale = Math.max(width, 1) / 820;
  return (
    <div ref={box} className="w-full">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(4, ${175 * scale}px)`,
          gridAutoRows: `${175 * scale}px`,
          gap: 40 * scale,
        }}
      >
        {SLOTS.map((def) => (
          <Slot
            key={def.id}
            def={def}
            block={slots[def.id] ?? null}
            scale={scale}
            onSet={(block) => setSlots((s) => ({ ...s, [def.id]: block }))}
            onUpdate={(update) =>
              setSlots((s) =>
                s[def.id] ? { ...s, [def.id]: update(s[def.id]!) } : s
              )
            }
            onClear={() =>
              setSlots((s) => {
                const next = { ...s };
                delete next[def.id];
                return next;
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function MediaStep({
  onBack,
  onFinish,
  loading,
}: {
  onBack: () => void;
  onFinish: () => void;
  loading: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="mb-14 active:scale-90"
        aria-label="Back"
      >
        <ArrowLeft className="size-6" />
      </button>
      <h1 className={TITLE}>
        You can also add photos, video, maps, and notes.
      </h1>
      <div className="mt-8 flex items-center">
        {(['photo', 'note', 'map', 'music'] as SlotId[]).map((s) => (
          <span key={s} className="-mr-1 scale-[.8]">
            <SlotIcon id={s} />
          </span>
        ))}
      </div>
      <Actions onNext={onFinish} onSkip={onFinish} loading={loading} />
    </>
  );
}

// ---------------------------------------------------------------- the flow

export default function OnboardingContent({
  demo = false,
}: {
  // A walk-through that needs no account and saves nothing.
  demo?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState<'social' | 'media'>('social');
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<Partial<Record<SlotId, Block>>>({});
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (demo) return setReady(true);
    createClient()
      .auth.getSession()
      .then(async ({ data: { session } }) => {
        if (!session?.user) return router.replace('/login');
        // Someone who already has a page has been through this.
        const page = await fetch('/api/page')
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.page)
          .catch(() => null);
        if (page?.blocks?.length) return goToOwnPage(router);
        setReady(true);
      });
  }, [router, demo]);

  // The account widgets, which can be dragged, resized and deleted right
  // here in "Your page", like in the editor.
  const [blocks, setBlocks] = useState<Block[]>([]);

  const addAccount = (socialId: string, handle: string) => {
    const social = SOCIALS.find((s) => s.id === socialId)!;
    const blockId = `social-${socialId}`;
    setHandles((h) => ({ ...h, [socialId]: handle }));
    setBlocks((current) => {
      const data = { url: social.url(handle), title: social.name };
      if (current.some((b) => b.id === blockId)) {
        return current.map((b) => (b.id === blockId ? { ...b, data } : b));
      }
      const bottom = current.reduce((m, b) => Math.max(m, b.y + b.h), 0);
      return [
        ...current,
        {
          id: blockId,
          type: 'LINK',
          x: 0,
          y: bottom,
          w: 1,
          h: 2,
          data,
        } as Block,
      ];
    });
  };
  const removeAccount = (socialId: string) => {
    setHandles((h) => {
      const next = { ...h };
      delete next[socialId];
      return next;
    });
    setBlocks((current) =>
      current.filter((b) => b.id !== `social-${socialId}`)
    );
  };
  // A widget deleted from the preview also clears its row.
  const changeBlocks = (next: Block[]) => {
    setBlocks(next);
    setHandles((h) =>
      Object.fromEntries(
        Object.entries(h).filter(([key]) =>
          next.some((b) => b.id === `social-${key}`)
        )
      )
    );
  };

  const finish = async () => {
    setSaving(true);
    if (demo) {
      await new Promise((r) => setTimeout(r, 600));
      router.push('/');
      return;
    }
    const media = SLOTS.map((d) => slots[d.id]).filter((b): b is Block => {
      if (!b) return false;
      const data = b.data as Record<string, unknown>;
      if (b.type === 'LINK') return !!data.url;
      if (b.type === 'MAP') return typeof data.lat === 'number';
      if (b.type === 'TEXT') return !!String(data.content ?? '').trim();
      return !!data.url;
    });
    const fresh = [...blocks, ...media];
    try {
      if (fresh.length) {
        const existing = await fetch('/api/page')
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.page)
          .catch(() => null);
        const base: Block[] = existing?.blocks ?? [];
        const top = base.reduce((m, b) => Math.max(m, b.y + b.h), 0);
        // The arranged account widgets keep their places; what was added on
        // the second step goes underneath.
        const accountBottom = blocks.reduce(
          (m, b) => Math.max(m, b.y + b.h),
          0
        );
        const placed = [
          ...blocks.map((b) => ({ ...b, y: b.y + top })),
          ...packInOrder(media, 4).map((b) => ({
            ...b,
            y: b.y + top + accountBottom,
          })),
        ];
        await fetch('/api/page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(existing ?? {}),
            blocks: [...base, ...placed],
          }),
        });
      }
    } catch (error) {
      console.error('Saving the first widgets failed:', error);
    }
    await goToOwnPage(router);
  };

  if (!ready) return null;

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex min-h-screen w-full max-w-[1728px] flex-col gap-12 px-7 py-12 sm:px-16 sm:py-16 lg:flex-row lg:gap-[110px]">
        <div className="w-full max-w-[450px] shrink-0 lg:pt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.5, 1, 0.89, 1] }}
            >
              {step === 'social' ? (
                <SocialStep
                  handles={handles}
                  onCommit={addAccount}
                  onRemove={removeAccount}
                  onNext={() => setStep('media')}
                />
              ) : (
                <MediaStep
                  onBack={() => setStep('social')}
                  onFinish={finish}
                  loading={saving}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className={cn(
            'min-w-0 flex-1 lg:pt-4',
            step === 'social' && 'hidden lg:block'
          )}
        >
          <div className="mb-10 flex items-center gap-6">
            <div className="h-px flex-1 bg-black/[.05]" />
            <span className="text-[22px] font-bold leading-7 text-black">
              Your page
            </span>
            <div className="h-px flex-1 bg-black/[.05]" />
          </div>
          {step === 'social' ? (
            <div className="max-w-[820px]">
              {/* Mounted once there is something to arrange: the editor's
                  grid would otherwise show its own empty state first. */}
              {blocks.length > 0 && (
                <BentoGrid
                  isEditMode
                  blocks={blocks}
                  onBlocksChange={changeBlocks}
                />
              )}
            </div>
          ) : (
            <div className="max-w-[820px]">
              {blocks.length > 0 && (
                <div className="-mb-20">
                  <BentoGrid
                    isEditMode
                    blocks={blocks}
                    onBlocksChange={changeBlocks}
                  />
                </div>
              )}
              <MediaPreview slots={slots} setSlots={setSlots} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
