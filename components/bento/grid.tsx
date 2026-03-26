'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { BlockContent } from './block-content';
import { BlockEditorDialog } from './block-editor-dialog';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface BentoGridProps {
  isEditMode?: boolean;
  blocks?: Block[];
  onBlocksChange?: (newBlocks: Block[]) => void;
}

export function BentoGrid({
  isEditMode = false,
  blocks = [],
  onBlocksChange,
}: BentoGridProps) {
  const [mounted, setMounted] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const editingBlock = blocks.find((b) => b.id === editingBlockId) ?? null;

  return (
    <div className="mx-auto w-full max-w-[820px] pb-32">
      <ResponsiveGridLayout
        className="layout"
        layouts={{
          lg: gridLayouts,
          md: gridLayouts,
          sm: gridLayouts,
          xs: gridLayouts,
          xxs: gridLayouts,
        }}
        breakpoints={{ lg: 1200, md: 800, sm: 530, xs: 400, xxs: 0 }}
        cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={67.5}
        margin={[40, 40]}
        containerPadding={[0, 0]}
        onLayoutChange={(layout) => handleGridLayoutChange(layout)}
        isDraggable={isEditMode}
        isResizable={false}
        compactType="vertical"
        useCSSTransforms={true}
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`group relative overflow-visible rounded-[2rem] border border-border bg-card transition-shadow ${
              isEditMode
                ? 'cursor-grab active:cursor-grabbing hover:shadow-lg hover:z-50'
                : ''
            }`}
            style={{ boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.05)' }}
          >
            <div
              className="h-full w-full overflow-hidden rounded-[2rem]"
              onClick={() => {
                if (isEditMode) setEditingBlockId(block.id);
              }}
              role={isEditMode ? 'button' : undefined}
            >
              <BlockContent block={block} interactive={!isEditMode} />
            </div>

            {isEditMode && (
              <>
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    deleteBlock(block.id);
                  }}
                  className="absolute -left-3 -top-3 flex size-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15)] opacity-0 transition-opacity group-hover:opacity-100 hover:scale-105 hover:text-red-500 z-50"
                >
                  <Trash2 size={18} />
                </button>

                {block.type !== 'SECTION_TITLE' && (
                  <div
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-[1.25rem] bg-black px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.2)] opacity-0 transition-opacity group-hover:opacity-100 z-50"
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
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </ResponsiveGridLayout>

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
    </div>
  );
}

export function newBlock(type: BlockType, y: number): Block {
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
    data: defaultBlockData(type),
  };
}
