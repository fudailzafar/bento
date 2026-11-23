import { describe, expect, it } from 'vitest';
import { isReservedUsername, isValidUsername } from '@/lib/routes';

describe('usernames', () => {
  it('reserves the pages the app serves itself', () => {
    expect(isReservedUsername('changelog')).toBe(true);
    expect(isReservedUsername('Changelog')).toBe(true);
    expect(isReservedUsername('rogie')).toBe(false);
  });

  it('accepts ordinary handles and refuses odd ones', () => {
    expect(isValidUsername('rogie')).toBe(true);
    expect(isValidUsername('a b')).toBe(false);
    expect(isValidUsername('')).toBe(false);
  });
});
