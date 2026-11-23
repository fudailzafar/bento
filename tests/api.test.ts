import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

import { ApiError, fail, withUser } from '@/lib/server/api';

const { getCurrentUser } = vi.hoisted(() => ({ getCurrentUser: vi.fn() }));
vi.mock('@/lib/server/session', () => ({ getCurrentUser }));

const request = () => new NextRequest('http://localhost/api/x');
const user = { id: 'u1', email: 'a@b.c' };

beforeEach(() => {
  getCurrentUser.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('withUser', () => {
  it('answers 401 when nobody is signed in, without running the handler', async () => {
    getCurrentUser.mockResolvedValue(null);
    const handler = vi.fn();
    const res = await withUser(handler)(request());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('passes the user and request to the handler', async () => {
    getCurrentUser.mockResolvedValue(user);
    const res = await withUser((u) => NextResponse.json({ id: u.id }))(
      request()
    );
    expect(await res.json()).toEqual({ id: 'u1' });
  });

  it('turns fail() into its status and message', async () => {
    getCurrentUser.mockResolvedValue(user);
    const res = await withUser(() => fail(400, 'Nope'))(request());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Nope' });
  });

  it('logs an unexpected error and answers 500 with the set message', async () => {
    getCurrentUser.mockResolvedValue(user);
    const res = await withUser(
      () => {
        throw new Error('boom');
      },
      { failure: 'Failed to do it', log: 'Oops:' }
    )(request());
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Failed to do it' });
    expect(console.error).toHaveBeenCalledWith('Oops:', expect.any(Error));
  });

  it('can build the 500 message from the error', async () => {
    getCurrentUser.mockResolvedValue(user);
    const res = await withUser(
      () => {
        throw new Error('Wrong password');
      },
      { failure: (e) => (e as Error).message }
    )(request());
    expect(await res.json()).toEqual({ error: 'Wrong password' });
  });

  it('lets onError answer some errors itself', async () => {
    getCurrentUser.mockResolvedValue(user);
    class Conflict extends Error {}
    const res = await withUser(
      () => {
        throw new Conflict();
      },
      {
        onError: (e) =>
          e instanceof Conflict
            ? NextResponse.json({ error: 'conflict' }, { status: 409 })
            : undefined,
      }
    )(request());
    expect(res.status).toBe(409);
  });

  it('exposes ApiError with its status', () => {
    expect(() => fail(404, 'x')).toThrow(ApiError);
  });
});
