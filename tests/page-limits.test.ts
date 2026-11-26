import { describe, expect, it } from 'vitest';
import { MAX_BLOCKS, PageDataSchema } from '@/lib/blocks';
import { extensionFor, mediaKind } from '@/lib/media-types';
import { checkMediaFile } from '@/lib/media';

const block = (i: number) => ({
  id: `b${i}`,
  type: 'TEXT' as const,
  x: 0,
  y: i,
  w: 2,
  h: 2,
  data: { content: 'hi' },
});

describe('a saved page has limits', () => {
  it('accepts a normal page', () => {
    expect(
      PageDataSchema.safeParse({ name: 'Jane', blocks: [block(0)] }).success
    ).toBe(true);
  });

  it('refuses too many blocks, giant text and impossible sizes', () => {
    const many = Array.from({ length: MAX_BLOCKS + 1 }, (_, i) => block(i));
    expect(PageDataSchema.safeParse({ blocks: many }).success).toBe(false);
    expect(
      PageDataSchema.safeParse({ bio: 'x'.repeat(6000), blocks: [] }).success
    ).toBe(false);
    expect(
      PageDataSchema.safeParse({ blocks: [{ ...block(0), w: 99 }] }).success
    ).toBe(false);
    expect(
      PageDataSchema.safeParse({ blocks: [{ ...block(0), x: -1 }] }).success
    ).toBe(false);
  });
});

describe('uploads', () => {
  it('know the kind and extension of a type, and nothing else', () => {
    expect(mediaKind('image/png')).toBe('image');
    expect(mediaKind('video/mp4')).toBe('video');
    expect(mediaKind('image/svg+xml')).toBeNull();
    expect(mediaKind('text/html')).toBeNull();
    expect(extensionFor('image/jpeg')).toBe('jpg');
    expect(extensionFor('application/x-php')).toBeNull();
  });

  it('are checked by type and size in the browser', () => {
    const file = (type: string, size: number) =>
      ({ type, size }) as unknown as Blob;
    expect(checkMediaFile(file('image/png', 1000))).toBeNull();
    expect(checkMediaFile(file('image/svg+xml', 1000))).toMatch(/JPG/);
    expect(checkMediaFile(file('image/png', 6 * 1024 * 1024))).toMatch(/5MB/);
    expect(checkMediaFile(file('video/mp4', 26 * 1024 * 1024))).toMatch(/25MB/);
  });
});
