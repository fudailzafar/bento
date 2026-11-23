import { describe, expect, it } from 'vitest';
import type { Block } from '@/lib/blocks';
import {
  appendBlock,
  hasPhoneLayout,
  packInOrder,
  phonePlacements,
  withPhoneLayout,
} from '@/lib/layout';

const block = (id: string, x: number, y: number, w: number, h: number) =>
  ({ id, type: 'TEXT', x, y, w, h, data: {} }) as Block;

describe('packInOrder', () => {
  it('places each item in the first free spot, left to right', () => {
    const placed = packInOrder(
      [
        { x: 0, y: 0, w: 1, h: 2 },
        { x: 0, y: 0, w: 1, h: 2 },
        { x: 0, y: 0, w: 1, h: 2 },
      ],
      2
    );
    expect(placed.map((p) => [p.x, p.y])).toEqual([
      [0, 0],
      [1, 0],
      [0, 2],
    ]);
  });

  it('clamps a wide item to the columns there are', () => {
    const [wide] = packInOrder([{ x: 3, y: 9, w: 4, h: 1 }], 2);
    expect(wide).toMatchObject({ x: 0, y: 0, w: 2 });
  });

  it('never overlaps two items', () => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      x: 0,
      y: 0,
      w: 1 + (i % 2),
      h: 1 + (i % 3),
    }));
    const placed = packInOrder(items, 2);
    const cells = new Set<string>();
    for (const p of placed)
      for (let y = p.y; y < p.y + p.h; y++)
        for (let x = p.x; x < p.x + p.w; x++) {
          const key = `${x},${y}`;
          expect(cells.has(key)).toBe(false);
          cells.add(key);
        }
  });
});

describe('phone layout', () => {
  it('has none until every block has all four phone values', () => {
    const blocks = [block('a', 0, 0, 1, 2), block('b', 1, 0, 1, 2)];
    expect(hasPhoneLayout([])).toBe(false);
    expect(hasPhoneLayout(blocks)).toBe(false);
    expect(
      hasPhoneLayout([{ ...blocks[0], mx: 0, my: 0, mw: 1, mh: 2 }, blocks[1]])
    ).toBe(false);
  });

  it('flows the desktop layout into two columns in reading order', () => {
    const blocks = [
      block('b', 1, 0, 1, 2),
      block('a', 0, 0, 1, 2),
      block('c', 0, 2, 2, 1),
    ];
    expect(phonePlacements(blocks)).toEqual([
      { id: 'a', x: 0, y: 0, w: 1, h: 2 },
      { id: 'b', x: 1, y: 0, w: 1, h: 2 },
      { id: 'c', x: 0, y: 2, w: 2, h: 1 },
    ]);
  });

  it('uses the stored phone layout once every block has one', () => {
    const blocks = withPhoneLayout(
      [block('a', 0, 0, 1, 2), block('b', 1, 0, 1, 2)],
      [
        { id: 'a', x: 1, y: 5, w: 1, h: 2 },
        { id: 'b', x: 0, y: 0, w: 2, h: 1 },
      ]
    );
    expect(hasPhoneLayout(blocks)).toBe(true);
    expect(phonePlacements(blocks)[0]).toEqual({
      id: 'a',
      x: 1,
      y: 5,
      w: 1,
      h: 2,
    });
  });
});

describe('appendBlock', () => {
  it('adds a block under the desktop layout', () => {
    const next = appendBlock([block('a', 0, 0, 2, 4)], block('b', 3, 3, 1, 2));
    expect(next[1]).toMatchObject({ id: 'b', x: 0, y: 4 });
  });
});
