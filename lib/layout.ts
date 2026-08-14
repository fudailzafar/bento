import type { Block } from './blocks';

// bento keeps two layouts per page: the desktop one (4 columns) in x, y, w, h
// and the phone one (2 columns, shared by phones and tablets) in mx, my, mw,
// mh. Until the phone layout is first edited it is derived from the desktop
// one, in reading order.

export interface Placed {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PHONE_COLUMNS = 2;

// Places items in the order given, each in the first free spot, left to right
// and top to bottom. A wide item spans every column it can.
export function packInOrder<T extends Placed>(items: T[], cols: number): T[] {
  const filled: boolean[][] = [];
  const free = (x: number, y: number, w: number, h: number) => {
    for (let row = y; row < y + h; row++)
      for (let col = x; col < x + w; col++)
        if (filled[row]?.[col]) return false;
    return true;
  };
  return items.map((item) => {
    const w = Math.min(item.w, cols);
    for (let y = 0; ; y++) {
      for (let x = 0; x + w <= cols; x++) {
        if (free(x, y, w, item.h)) {
          for (let row = y; row < y + item.h; row++) {
            filled[row] ??= [];
            for (let col = x; col < x + w; col++) filled[row][col] = true;
          }
          return { ...item, x, y, w };
        }
      }
    }
  });
}

export const readingOrder = <T extends Placed>(items: T[]) =>
  [...items].sort((a, b) => a.y - b.y || a.x - b.x);

export function hasPhoneLayout(blocks: Block[]) {
  return (
    blocks.length > 0 &&
    blocks.every(
      (b) => b.mx != null && b.my != null && b.mw != null && b.mh != null
    )
  );
}

// Each block's place in the phone layout: its own when stored, else the
// desktop layout flowed into two columns in reading order.
export function phonePlacements(
  blocks: Block[]
): { id: string; x: number; y: number; w: number; h: number }[] {
  if (hasPhoneLayout(blocks)) {
    return blocks.map((b) => ({
      id: b.id,
      x: b.mx!,
      y: b.my!,
      w: b.mw!,
      h: b.mh!,
    }));
  }
  return packInOrder(
    readingOrder(
      blocks.map((b) => ({ id: b.id, x: b.x, y: b.y, w: b.w, h: b.h }))
    ),
    PHONE_COLUMNS
  );
}

// Writes a phone layout into the blocks.
export function withPhoneLayout(
  blocks: Block[],
  layout: { id: string; x: number; y: number; w: number; h: number }[]
): Block[] {
  const byId = new Map(layout.map((l) => [l.id, l]));
  return blocks.map((b) => {
    const spot = byId.get(b.id);
    return spot ? { ...b, mx: spot.x, my: spot.y, mw: spot.w, mh: spot.h } : b;
  });
}

// Adds a block at the end of both layouts.
export function appendBlock(blocks: Block[], block: Block): Block[] {
  const deskBottom = blocks.reduce((max, b) => Math.max(max, b.y + b.h), 0);
  const placed: Block = { ...block, x: 0, y: deskBottom };
  if (!hasPhoneLayout(blocks)) return [...blocks, placed];
  const phoneBottom = blocks.reduce(
    (max, b) => Math.max(max, b.my! + b.mh!),
    0
  );
  return [
    ...blocks,
    {
      ...placed,
      mx: 0,
      my: phoneBottom,
      mw: Math.min(block.w, PHONE_COLUMNS),
      mh: block.h,
    },
  ];
}

// bento's grid engine switches to the desktop layout at this width: the
// profile pins left and the 4-column grid sits right. Below it phones and
// tablets share the 2-column layout.
export const DESKTOP_MIN_WIDTH = 1280;
