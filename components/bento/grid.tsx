'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Block, BlockType, defaultBlockData } from '@/lib';
import {
  Square,
  RectangleHorizontal,
  RectangleVertical,
  LayoutGrid,
  Trash2,
  Pencil,
  Crop,
  MousePointerClick,
} from 'lucide-react';
import { toast } from 'sonner';
import { isVideoUrl, uploadBlockMedia } from '@/lib/media';
import { BlockContent } from './block-content';
import { BlockEditorDialog } from './block-editor-dialog';
import { CropDialog } from './editing/crop-dialog';
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
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
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

  const editingBlock = blocks.find((b) => b.id === editingBlockId) ?? null;
  const croppingBlock = blocks.find((b) => b.id === croppingBlockId) ?? null;
  const croppingData = croppingBlock?.data as
    { url?: string; original?: string } | undefined;
  const canCrop = (block: Block) => {
    const { url, kind } = block.data as { url?: string; kind?: string };
    return (
      block.type === 'IMAGE' && !!url && kind !== 'video' && !isVideoUrl(url)
    );
  };

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
        isResizable={false}
        compactType="vertical"
        useCSSTransforms={true}
      >
        {blocks.map((block) => {
          const clickable =
            publicMode &&
            block.type === 'LINK' &&
            !!(block.data as { url?: string })?.url;
          // Section titles are bento's plain labels above a group, not cards.
          const label = block.type === 'SECTION_TITLE';
          const card = (
            // bento's widget: 24px corners, 8% black hairline, 0 2px 4px shadow;
            // links tint on hover (inside the tile) and press down to 97%.
            <div
              className={`relative h-full w-full rounded-[24px] [transition:transform_.1s_cubic-bezier(.427,.073,.105,.997)] ${
                label ? '' : 'bg-card shadow-[0_2px_4px_rgba(0,0,0,.04)]'
              } ${clickable ? 'group/card active:scale-[.97] active:shadow-none' : ''}`}
            >
              <div
                className="h-full w-full overflow-hidden rounded-[inherit]"
                onClick={() => {
                  if (isEditMode) setEditingBlockId(block.id);
                }}
                role={isEditMode ? 'button' : undefined}
              >
                <BlockContent block={block} interactive={!isEditMode} />
              </div>
              {!label && (
                <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-black/[.08]" />
              )}
            </div>
          );
          return (
            <div
              key={block.id}
              data-block-id={block.id}
              className={`group relative overflow-visible rounded-[24px] ${
                isEditMode
                  ? 'cursor-grab transition-shadow hover:z-50 hover:shadow-lg active:cursor-grabbing'
                  : ''
              }`}
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
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                    className="absolute -left-3 -top-3 z-50 flex size-10 items-center justify-center rounded-full bg-white text-gray-700 opacity-0 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-opacity hover:scale-105 hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>

                  {block.type !== 'SECTION_TITLE' && (
                    <div
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute -bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-[1.25rem] bg-black px-3 py-2 opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-opacity group-hover:opacity-100"
                    >
                      <button
                        onClick={() => updateBlockSize(block.id, 1, 2)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          block.w === 1 && block.h === 2
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Square size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => updateBlockSize(block.id, 2, 2)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          block.w === 2 && block.h === 2
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <RectangleHorizontal size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => updateBlockSize(block.id, 1, 4)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          block.w === 1 && block.h === 4
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <RectangleVertical size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => updateBlockSize(block.id, 2, 4)}
                        className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                          block.w === 2 && block.h === 4
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <LayoutGrid size={18} strokeWidth={2.5} />
                      </button>
                      <div className="mx-1 h-4 w-px bg-white/20" />
                      {canCrop(block) && (
                        <button
                          aria-label="Crop"
                          onClick={() => setCroppingBlockId(block.id)}
                          className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                        >
                          <Crop size={16} strokeWidth={2.5} />
                        </button>
                      )}
                      <button
                        aria-label="Edit"
                        onClick={() => setEditingBlockId(block.id)}
                        className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                      >
                        <Pencil size={16} strokeWidth={2.5} />
                      </button>
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

      <BlockEditorDialog
        block={editingBlock}
        open={!!editingBlock}
        onOpenChange={(open) => {
          if (!open) setEditingBlockId(null);
        }}
        onSave={(data) => {
          if (editingBlock) updateBlockData(editingBlock.id, data);
          setEditingBlockId(null);
        }}
      />

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
