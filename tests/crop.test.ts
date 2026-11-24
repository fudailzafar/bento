import { describe, expect, it } from 'vitest';
import { dragAxis, pullOf, pullTransform } from '@/lib/crop';

describe('pullOf', () => {
  it('matches the distances measured in the video', () => {
    expect(pullOf(0)).toBe(0);
    expect(pullOf(15)).toBeCloseTo(1.44, 0);
    expect(pullOf(163)).toBeCloseTo(3.72, 0);
    expect(pullOf(334)).toBeCloseTo(5.04, 0);
  });

  it('goes both ways and gives less the further it goes', () => {
    expect(pullOf(-50)).toBe(-pullOf(50));
    expect(pullOf(200) - pullOf(100)).toBeLessThan(pullOf(100) - pullOf(1));
  });
});

describe('dragAxis', () => {
  it('moves the picture with the pointer inside the limits', () => {
    expect(dragAxis(0.5, 200, 50)).toEqual({ pos: 0.25, pull: 0 });
    expect(dragAxis(0.5, 200, -50)).toEqual({ pos: 0.75, pull: 0 });
  });

  it('stops at each edge and pulls the way the pointer went', () => {
    const right = dragAxis(0.5, 200, 300);
    expect(right.pos).toBe(0);
    expect(right.pull).toBeCloseTo(pullOf(200));
    expect(right.pull).toBeGreaterThan(0);
    const left = dragAxis(0.5, 200, -300);
    expect(left.pos).toBe(1);
    expect(left.pull).toBeLessThan(0);
  });

  it('is continuous at the edge', () => {
    expect(dragAxis(0.5, 200, 100)).toEqual({ pos: 0, pull: 0 });
  });

  it('keeps an axis with nothing hidden still', () => {
    expect(dragAxis(0.3, 0, 400)).toEqual({ pos: 0.3, pull: 0 });
  });
});

describe('pullTransform', () => {
  const frame = { w: 175, h: 390 };

  it('does nothing without a pull', () => {
    expect(pullTransform(0, 0, frame)).toBe('none');
  });

  it('puts a sideways pull where the video has the tile', () => {
    const m = pullTransform(-5.52, 0, frame)
      .match(/-?[\d.]+/g)!
      .map(Number);
    const [x, y, sx, sy] = m;
    expect(x - ((sx - 1) * 175) / 2).toBeCloseTo(-7.2, 0); // left edge
    expect(x + ((sx - 1) * 175) / 2).toBeCloseTo(-3.84, 0); // right edge
    expect(y + ((sy - 1) * 390) / 2).toBeCloseTo(0, 5); // bottom edge stays
    expect(y - ((sy - 1) * 390) / 2).toBeCloseTo(1.68, 1); // top edge drops
  });
});
