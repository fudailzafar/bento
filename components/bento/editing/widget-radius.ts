import type { Block } from '@/lib';

// bento's corner radius per widget size: 16px section titles, 20px bars,
// 28px large squares, 24px for everything else.
export function widgetRadius(block: Pick<Block, 'type' | 'w' | 'h'>) {
  if (block.type === 'SECTION_TITLE') return 16;
  if (block.h <= 1) return 20;
  if (block.w >= 2 && block.h >= 4) return 28;
  return 24;
}
