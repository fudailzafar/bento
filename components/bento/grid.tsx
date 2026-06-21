'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Block, BlockType, defaultBlockData } from '@/lib';
import { Trash2, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import { fetchLinkPreview, isVideoFile, uploadBlockMedia } from '@/lib/media';
import { findPlatform } from '@/lib/platforms';
import { cn } from '@/lib/utils';
import { BlockContent, type BlockEditing } from './block-content';
import { CropDialog } from './editing/crop-dialog';
import { NO_DRAG } from './editing/no-drag';
import { WidgetToolbar } from './editing/widget-toolbar';
import { tileAspect } from './link-tile';

const ResponsiveGridLayout = WidthProvider(Responsive);

type GridProps = React.ComponentProps<typeof Responsive>;

// bento.me's grid engine switches to the desktop layout at this width.
const DESKTOP_MIN_WIDTH = 1260;
const MOBILE_GAP = 24;

// bento's phone layout: two columns, so a small square is half the width and
// anything wider spans both. Blocks are re-flowed in reading order.
function toMobileLayout(layout: Layout[]): Layout[] {
  const filled: boolean[][] = [];
  const free = (x: number, y: number, w: number, h: number) => {
    for (let row = y; row < y + h; row++)
      for (let col = x; col < x + w; col++)
        if (filled[row]?.[col]) return false;
    return true;
  };
  return [...layout]
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map((item) => {
      const w = Math.min(item.w, 2);
      let y = 0;
      for (; ; y++) {
        for (let x = 0; x + w <= 2; x++) {
          if (free(x, y, w, item.h)) {
            for (let row = y; row < y + item.h; row++) {
              filled[row] ??= [];
              for (let col = x; col < x + w; col++) filled[row][col] = true;
            }
            return { ...item, x, y, w, maxW: 2 };
          }
        }
      }
    });
}

interface BentoGridProps {
  isEditMode?: boolean;
  blocks?: Block[];
  onBlocksChange?: (newBlocks: Block[]) => void;
  // Link clicks per block, shown on hover in the editor.
  clicks?: Record<string, number>;
}

export function BentoGrid({
  isEditMode = false,
  blocks = [],
  onBlocksChange,
  clicks,
}: BentoGridProps) {
  const [mounted, setMounted] = useState(false);
  // The widget being edited in place: its toolbar stays open.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadingIds, setUploadingIds] = useState<string[]>([]);
  const [croppingBlockId, setCroppingBlockId] = useState<string | null>(null);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  // Public profile only: which bento layout to use, and the phone grid width
  // (tile height follows width there, so squares stay square).
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const [width, setWidth] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Element | null;
      // Clicking another widget selects it instead (its own handler).
      if (!target?.closest?.('[data-block-id]')) setSelectedId(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [selectedId]);

  useEffect(() => {
    if (isEditMode) return;
    const mql = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const onChange = () => setDesktop(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width)
    );
    if (wrapper.current) {
      // Read the width now too; the observer may not fire in a hidden tab.
      setWidth(wrapper.current.getBoundingClientRect().width);
      observer.observe(wrapper.current);
    }
    return () => {
      mql.removeEventListener('change', onChange);
      observer.disconnect();
    };
  }, [isEditMode, mounted]);

  const gridLayouts: Layout[] = blocks.map((block) => ({
    i: block.id,
    x: block.x,
    y: block.y === Infinity ? 9999 : block.y,
    w: block.w,
    h: block.h,
    minW: 1,
    minH: 1,
    maxW: 4,
    maxH: 4,
    isDraggable: isEditMode,
    isResizable: false,
  }));

  const handleGridLayoutChange = (currentLayout: Layout[]) => {
    if (!onBlocksChange) return;

    let hasChanges = false;
    const newBlocks = blocksRef.current.map((block) => {
      const match = currentLayout.find((l) => l.i === block.id);

      // ONLY sync x and y — w/h changes from react-grid-layout are auto-compaction
      // on smaller breakpoints, not real resizes, so they must be ignored here.
      if (match && (match.x !== block.x || match.y !== block.y)) {
        hasChanges = true;
        return { ...block, x: match.x, y: match.y };
      }
      return block;
    });

    if (hasChanges) {
      onBlocksChange(newBlocks);
    }
  };

  const updateBlockSize = (id: string, w: number, h: number) => {
    if (!onBlocksChange) return;
    onBlocksChange(
      blocksRef.current.map((block) =>
        block.id === id ? { ...block, w, h } : block
      )
    );
  };

  const updateBlockData = (id: string, data: Record<string, unknown>) => {
    if (!onBlocksChange) return;
    onBlocksChange(
      blocksRef.current.map((block) =>
        block.id === id ? { ...block, data } : block
      )
    );
  };

  const patchBlock = (id: string, patch: Record<string, unknown>) => {
    const block = blocksRef.current.find((b) => b.id === id);
    if (block) updateBlockData(id, { ...block.data, ...patch });
  };

  const uploadInto = async (id: string, file: File, field: 'url' | 'image') => {
    setUploadingIds((ids) => [...ids, id]);
    try {
      const url = await uploadBlockMedia(file);
      patchBlock(
        id,
        field === 'url'
          ? {
              url,
              kind: isVideoFile(file) ? 'video' : 'image',
              original: undefined,
            }
          : { image: url }
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    } finally {
      setUploadingIds((ids) => ids.filter((x) => x !== id));
    }
  };

  // A link's address is set in place; its preview (and title, for plain
  // sites) fills in once fetched.
  const setLinkUrl = async (id: string, url: string) => {
    patchBlock(id, { url, image: undefined, description: undefined });
    const preview = await fetchLinkPreview(url);
    const block = blocksRef.current.find((b) => b.id === id);
    const title = (block?.data as { title?: string } | undefined)?.title;
    const untitled =
      !title || title === 'New link' || title === 'Untitled link';
    patchBlock(id, {
      image: preview.image,
      description: preview.description,
      ...(untitled && !findPlatform(url) && preview.title
        ? { title: preview.title }
        : {}),
    });
  };

  const editingFor = (block: Block): BlockEditing => ({
    onPatch: (patch) => patchBlock(block.id, patch),
    onSetUrl: (url) => setLinkUrl(block.id, url),
    onUpload: (file, field) => uploadInto(block.id, file, field),
    uploading: uploadingIds.includes(block.id),
  });

  const deleteBlock = (id: string) => {
    if (!onBlocksChange) return;
    onBlocksChange(blocksRef.current.filter((block) => block.id !== id));
  };

  if (!mounted) return null;

  // bento's widget suggestions: an empty editor shows dashed "Add …" tiles
  // that drop in that block type.
  if (isEditMode && blocks.length === 0 && onBlocksChange) {
    const suggestions: { type: BlockType; label: string }[] = [
      { type: 'LINK', label: 'Add Link' },
      { type: 'IMAGE', label: 'Add Photo' },
      { type: 'TEXT', label: 'Add Note' },
      { type: 'MAP', label: 'Add Map' },
    ];
    return (
      <div className="mx-auto grid w-full max-w-[820px] grid-cols-2 gap-6 pb-32 xl:grid-cols-4 xl:gap-10">
        {suggestions.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => onBlocksChange([newBlock(type, 0)])}
            className="relative flex aspect-square flex-col items-center justify-center gap-2 rounded-[24px] border-2 border-dashed border-black/[.08] text-xs font-semibold text-black transition-colors hover:border-black/20 hover:bg-black/[.02] active:scale-[.97]"
          >
            <span className="absolute right-3 top-2 text-lg font-normal leading-none text-black/20">
              +
            </span>
            {label}
          </button>
        ))}
      </div>
    );
  }

  const croppingBlock = blocks.find((b) => b.id === croppingBlockId) ?? null;
  const croppingData = croppingBlock?.data as
    { url?: string; original?: string } | undefined;

  // The public profile uses bento's two layouts: 4 columns with 40px gaps from
  // 1260px, otherwise 2 columns with 24px gaps and tiles scaled to the width.
  // The editor keeps its own breakpoints so saved positions stay untouched.
  const publicMode = !isEditMode;
  if (publicMode && (desktop === null || width === 0)) {
    return <div ref={wrapper} className="w-full" />;
  }
  const mobileRow = ((width - MOBILE_GAP) / 2 - MOBILE_GAP) / 2;
  const publicLayout = desktop ? gridLayouts : toMobileLayout(gridLayouts);
  const gridProps: Partial<GridProps> = publicMode
    ? {
        layouts: { lg: publicLayout },
        breakpoints: { lg: 0 },
        width,
        cols: { lg: desktop ? 4 : 2 },
        rowHeight: desktop ? 67.5 : mobileRow,
        margin: (desktop ? [40, 40] : [MOBILE_GAP, MOBILE_GAP]) as [
          number,
          number,
        ],
      }
    : {
        layouts: {
          lg: gridLayouts,
          md: gridLayouts,
          sm: gridLayouts,
          xs: gridLayouts,
          xxs: gridLayouts,
        },
        breakpoints: { lg: 1200, md: 800, sm: 530, xs: 400, xxs: 0 },
        cols: { lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 },
        rowHeight: 67.5,
        margin: [40, 40] as [number, number],
      };
  // The public grid is sized from the measured wrapper width.
  const Grid = (
    publicMode ? Responsive : ResponsiveGridLayout
  ) as React.ComponentType<GridProps>;
  // bento staggers each widget by its grid position: 0.15s per tile across
  // and down, after 0.2s (0.5s on phones).
  const entranceDelay = (id: string) => {
    const item = publicLayout.find((l) => l.i === id);
    if (!item) return 0;
    return 0.15 * item.x + 0.15 * (item.y / 2) + (desktop ? 0.2 : 0.5);
  };

  return (
    <div
      ref={wrapper}
      className={publicMode ? 'w-full' : 'mx-auto w-full max-w-[820px] pb-32'}
    >
      <Grid
        key={publicMode ? (desktop ? 'desktop' : 'mobile') : 'editor'}
        className="layout"
        {...gridProps}
        containerPadding={[0, 0]}
        onLayoutChange={(layout) => {
          if (isEditMode) handleGridLayoutChange(layout);
        }}
        isDraggable={isEditMode}
        draggableCancel={`.${NO_DRAG}`}
        isResizable={false}
        compactType="vertical"
        useCSSTransforms={true}
      >
        {blocks.map((block) => {
          const data = block.data as { url?: string; href?: string };
          // Any widget with a link tints and presses down, as on bento.
          const clickable =
            publicMode && (block.type === 'LINK' ? !!data?.url : !!data?.href);
          // Section titles are bento's plain labels above a group, not cards.
          const label = block.type === 'SECTION_TITLE';
          const selected = isEditMode && selectedId === block.id;
          const card = (
            // bento's widget: corners by size, 8% black hairline with a faint
            // white top highlight, 0 2px 4px shadow. Linked widgets tint on
            // hover (inside the tile) and press down to 97%; in the editor the
            // selected widget lifts 4px with a 2px outline.
            <div
              data-widget
              style={
                {
                  '--widget-radius': `${widgetRadius(block)}px`,
                } as React.CSSProperties
              }
              className={cn(
                'relative h-full w-full rounded-[var(--widget-radius)] [transition:box-shadow_.2s_ease-in-out,transform_.24s_cubic-bezier(.43,.01,.29,1),background_.2s_cubic-bezier(.43,.01,.29,1)]',
                !label && 'bg-card shadow-[0_2px_4px_rgba(0,0,0,.04)]',
                clickable &&
                  'group/card cursor-pointer active:scale-[.97] active:shadow-none',
                selected &&
                  '-translate-y-1 shadow-[0_25px_31px_rgba(0,0,0,.06),0_16.2px_18.16px_rgba(0,0,0,.046),0_9.63px_9.87px_rgba(0,0,0,.036),0_5px_5.04px_rgba(0,0,0,.03),0_2.04px_2.53px_rgba(0,0,0,.024),0_.46px_1.22px_rgba(0,0,0,.014)]'
              )}
            >
              <div className="h-full w-full overflow-hidden rounded-[inherit]">
                <BlockContent
                  block={block}
                  interactive={!isEditMode}
                  edit={isEditMode ? editingFor(block) : undefined}
                />
              </div>
              {!label && (
                <>
                  <div className="pointer-events-none absolute inset-px rounded-[calc(var(--widget-radius)-1px)] border border-white/[.22] [mask-image:linear-gradient(0deg,transparent,#000)]" />
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-0 rounded-[inherit] border transition-[border,opacity] duration-200 ease-in-out',
                      selected ? 'border-2 border-black' : 'border-black/[.08]'
                    )}
                  />
                </>
              )}
            </div>
          );
          return (
            <div
              key={block.id}
              data-block-id={block.id}
              onPointerDown={() => {
                if (isEditMode) setSelectedId(block.id);
              }}
              className={cn(
                'group relative overflow-visible',
                isEditMode && 'cursor-grab hover:z-50 active:cursor-grabbing',
                selectedId === block.id && 'z-50'
              )}
            >
              {publicMode ? (
                // bento's entrance: fade in and rise 60px over 1s, slight overshoot.
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    opacity: {
                      duration: 1,
                      ease: [0.42, 0, 0.25, 1],
                      delay: entranceDelay(block.id),
                    },
                    y: {
                      duration: 1,
                      ease: [0.2, 1.18, 0.47, 1],
                      delay: entranceDelay(block.id),
                    },
                  }}
                >
                  {card}
                </motion.div>
              ) : (
                card
              )}

              {isEditMode && (
                <>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => deleteBlock(block.id)}
                    className={cn(
                      NO_DRAG,
                      'absolute -left-3 -top-3 z-50 flex size-10 items-center justify-center rounded-full bg-white text-gray-700 opacity-0 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-opacity hover:scale-105 hover:text-red-500 group-hover:opacity-100',
                      selectedId === block.id && 'opacity-100'
                    )}
                  >
                    <Trash2 size={18} />
                  </button>

                  {block.type !== 'SECTION_TITLE' && (
                    <div
                      className={cn(
                        'absolute -bottom-6 left-1/2 z-50 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100',
                        selectedId === block.id
                          ? 'opacity-100'
                          : 'pointer-events-none group-hover:pointer-events-auto'
                      )}
                    >
                      <WidgetToolbar
                        selected={selectedId === block.id}
                        block={block}
                        onResize={(w, h) => updateBlockSize(block.id, w, h)}
                        onPatch={(patch) => patchBlock(block.id, patch)}
                        onSetUrl={(url) => setLinkUrl(block.id, url)}
                        onReplace={(file) => uploadInto(block.id, file, 'url')}
                        onCrop={() => setCroppingBlockId(block.id)}
                      />
                    </div>
                  )}

                  {clicks?.[block.id] ? (
                    <div className="pointer-events-none absolute right-3 top-3 z-40 flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <MousePointerClick size={12} />
                      {clicks[block.id]}{' '}
                      {clicks[block.id] === 1 ? 'click' : 'clicks'}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
      </Grid>

      <CropDialog
        src={
          croppingData
            ? croppingData.original || croppingData.url || null
            : null
        }
        aspect={
          croppingBlock ? tileAspect(croppingBlock.w, croppingBlock.h) : 1
        }
        onCancel={() => setCroppingBlockId(null)}
        onDone={async (blob) => {
          if (!croppingBlock || !croppingData) return;
          try {
            const url = await uploadBlockMedia(blob);
            updateBlockData(croppingBlock.id, {
              ...croppingBlock.data,
              url,
              kind: 'image',
              original: croppingData.original || croppingData.url,
            });
            setCroppingBlockId(null);
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : 'Failed to crop image'
            );
          }
        }}
      />
    </div>
  );
}

// bento's corner radius per widget size: 16px section titles, 20px bars,
// 28px large squares, 24px for everything else.
function widgetRadius(block: Block) {
  if (block.type === 'SECTION_TITLE') return 16;
  if (block.h <= 1) return 20;
  if (block.w >= 2 && block.h >= 4) return 28;
  return 24;
}

export function newBlock(
  type: BlockType,
  y: number,
  data?: Record<string, unknown>
): Block {
  const w = type === 'SECTION_TITLE' ? 4 : 1;
  const h = type === 'SECTION_TITLE' ? 1 : 2;
  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 11),
    type,
    x: 0,
    y,
    w,
    h,
    data: { ...defaultBlockData(type), ...data },
  };
}
