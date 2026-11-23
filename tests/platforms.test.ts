import { describe, expect, it } from 'vitest';
import { findPlatform, isProfileUrl } from '@/lib/platforms';

describe('isProfileUrl', () => {
  it('treats a Twitter post as a plain link, not a profile', () => {
    expect(isProfileUrl('https://twitter.com/joinbento/status/123')).toBe(
      false
    );
    expect(isProfileUrl('https://x.com/joinbento/status/123?s=20')).toBe(false);
  });

  it('treats a Twitter handle as a profile', () => {
    expect(isProfileUrl('https://twitter.com/rrhoover')).toBe(true);
  });

  it('tells posts from profiles on other platforms', () => {
    expect(isProfileUrl('https://instagram.com/rogie')).toBe(true);
    expect(isProfileUrl('https://instagram.com/p/abc/')).toBe(false);
    expect(isProfileUrl('https://dribbble.com/shots/19797305-x')).toBe(false);
    expect(isProfileUrl('https://dribbble.com/dennisgec')).toBe(true);
    expect(isProfileUrl('https://www.youtube.com/@mkbhd')).toBe(true);
  });

  it('treats an unknown site as a profile-less plain link', () => {
    expect(findPlatform('https://example.com')).toBeUndefined();
    expect(isProfileUrl('https://example.com')).toBe(true);
  });
});
