import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  presign: vi.fn(),
  findTrackTarget: vi.fn(),
  recordView: vi.fn(),
  recordClick: vi.fn(),
}));
vi.mock('@/lib/server/session', () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock('@/lib/server/r2', () => ({ getR2PresignedUploadUrl: mocks.presign }));
vi.mock('@/lib/server/analytics', () => ({
  findTrackTarget: mocks.findTrackTarget,
  recordView: mocks.recordView,
  recordClick: mocks.recordClick,
}));

import { POST as uploadUrl } from '@/app/api/media/upload-url/route';
import { POST as track } from '@/app/api/track/route';
import { resetRateLimits } from '@/lib/server/rate-limit';

const json = (
  url: string,
  body: unknown,
  headers: Record<string, string> = {}
) =>
  new NextRequest(`http://localhost${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });

beforeEach(() => {
  resetRateLimits();
  Object.values(mocks).forEach((m) => m.mockReset());
  mocks.getCurrentUser.mockResolvedValue({ id: 'u1', email: 'a@b.c' });
  mocks.presign.mockResolvedValue({
    uploadUrl: 'https://up',
    publicUrl: 'https://pub',
  });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/media/upload-url', () => {
  const ask = (body: unknown) => uploadUrl(json('/api/media/upload-url', body));

  it('signs an image upload with its exact size, a random name and a type-based extension', async () => {
    const res = await ask({
      filename: 'evil.php',
      contentType: 'image/png',
      size: 1234,
    });
    expect(res.status).toBe(200);
    const call = mocks.presign.mock.calls[0][0];
    expect(call.contentLength).toBe(1234);
    expect(call.key).toMatch(/^block-images\/u1-[0-9a-f-]{36}\.png$/);
  });

  it.each<[Record<string, unknown>, string]>([
    [{ contentType: 'image/svg+xml', size: 10 }, 'SVG'],
    [{ contentType: 'text/html', size: 10 }, 'HTML'],
    [{ contentType: 'image/png', size: 6 * 1024 * 1024 }, 'too big'],
    [{ contentType: 'video/mp4', size: 26 * 1024 * 1024 }, 'video too big'],
    [{ contentType: 'image/png', size: -5 }, 'negative'],
    [{ size: 10 }, 'no type'],
  ])('refuses %j (%s)', async (body) => {
    const res = await ask(body);
    expect(res.status).toBe(400);
    expect(mocks.presign).not.toHaveBeenCalled();
  });

  it('answers 429 after 60 uploads in an hour', async () => {
    for (let i = 0; i < 60; i++) {
      await ask({ contentType: 'image/png', size: 10 });
    }
    expect((await ask({ contentType: 'image/png', size: 10 })).status).toBe(
      429
    );
  });
});

describe('POST /api/track', () => {
  const visit = (body: unknown, headers: Record<string, string> = {}) =>
    track(
      json('/api/track', body, { 'user-agent': 'Mozilla/5.0', ...headers })
    );

  it('counts a visit', async () => {
    mocks.findTrackTarget.mockResolvedValue({ ownerId: 'owner', pageId: 'p1' });
    mocks.getCurrentUser.mockResolvedValue(null);
    expect((await visit({ username: 'jane' })).status).toBe(204);
    expect(mocks.recordView).toHaveBeenCalledWith('p1');
  });

  it('counts a click on a block of that page', async () => {
    mocks.findTrackTarget.mockResolvedValue({
      ownerId: 'owner',
      pageId: 'p1',
      blockId: 'b1',
    });
    mocks.getCurrentUser.mockResolvedValue(null);
    await visit({ username: 'jane', blockId: 'b1' });
    expect(mocks.recordClick).toHaveBeenCalledWith('p1', 'b1');
    expect(mocks.recordView).not.toHaveBeenCalled();
  });

  it("does not count the owner's own visit, a bot, or an unknown profile", async () => {
    mocks.findTrackTarget.mockResolvedValue({ ownerId: 'u1', pageId: 'p1' });
    await visit({ username: 'jane' });
    await visit({ username: 'jane' }, { 'user-agent': 'Googlebot' });
    mocks.findTrackTarget.mockResolvedValue(null);
    mocks.getCurrentUser.mockResolvedValue(null);
    await visit({ username: 'nobody' });
    expect(mocks.recordView).not.toHaveBeenCalled();
  });

  it('refuses a bad body (400) and a flood from one address (429)', async () => {
    mocks.findTrackTarget.mockResolvedValue(null);
    expect((await visit({ nope: 1 })).status).toBe(400);
    let last = 0;
    for (let i = 0; i < 125; i++) {
      last = (
        await visit({ username: 'jane' }, { 'x-forwarded-for': '9.9.9.9' })
      ).status;
    }
    expect(last).toBe(429);
  });
});
