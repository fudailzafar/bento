import { describe, expect, it } from 'vitest';
import {
  applySwap,
  restoreOthers,
  swapTarget,
  touchesOthers,
  type Cell,
} from '@/lib/swap';

const cell = (i: string, x: number, y: number, w = 1, h = 2): Cell => ({
  i,
  x,
  y,
  w,
  h,
});

const start = [
  cell('a', 0, 0),
  cell('b', 1, 0),
  cell('c', 0, 2),
  cell('wide', 2, 0, 2, 1),
];

describe('swapTarget', () => {
  it('finds the same-size widget the dragged one covers', () => {
    expect(swapTarget(start, cell('a', 1, 0))?.i).toBe('b');
  });

  it('needs at least half of it covered', () => {
    expect(swapTarget(start, cell('a', 1, 1))?.i).toBe('b'); // half
    expect(swapTarget(start, cell('a', 1, 2))).toBeUndefined(); // c only 0, b none
  });

  it('ignores widgets of another size and itself', () => {
    expect(swapTarget(start, cell('a', 2, 0))).toBeUndefined();
    expect(swapTarget(start, cell('a', 0, 0))).toBeUndefined();
  });

  it('takes the widget covered most', () => {
    expect(swapTarget(start, cell('b', 0, 1))?.i).toBe('c');
  });
});

describe('applySwap', () => {
  it('swaps the pair and puts everything else back', () => {
    const layout = [
      cell('a', 1, 0),
      cell('b', 1, 2), // pushed down by the default behaviour
      cell('c', 0, 4), // pushed too
      cell('wide', 2, 0, 2, 1),
    ];
    applySwap(layout, start, start[0], start[1]);
    expect(layout.map((c) => [c.i, c.x, c.y])).toEqual([
      ['a', 1, 0],
      ['b', 0, 0],
      ['c', 0, 2],
      ['wide', 2, 0],
    ]);
  });
});

describe('undoing a swap', () => {
  it('sees when the dragged widget has moved clear of the others', () => {
    expect(touchesOthers(start, cell('a', 0, 0))).toBe(false); // home
    expect(touchesOthers(start, cell('a', 1, 0))).toBe(true); // on b
    expect(touchesOthers(start, cell('a', 3, 3))).toBe(false); // free space
  });

  it('puts everything but the dragged widget back', () => {
    const layout = [
      cell('a', 0, 0),
      cell('b', 0, 0), // swapped into a's place
      cell('c', 0, 2),
      cell('wide', 2, 0, 2, 1),
    ];
    restoreOthers(layout, start, 'a');
    expect(layout.map((c) => [c.i, c.x, c.y])).toEqual([
      ['a', 0, 0],
      ['b', 1, 0],
      ['c', 0, 2],
      ['wide', 2, 0],
    ]);
  });
});
