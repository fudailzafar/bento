import { NextResponse } from 'next/server';
import { z } from 'zod';
import { publicApi } from '@/lib/server/api';
import {
  findTrackTarget,
  recordClick,
  recordView,
} from '@/lib/server/analytics';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';
import { readJson } from '@/lib/server/request';
import { getCurrentUser } from '@/lib/server/session';

const TrackSchema = z.object({
  username: z.string().min(1).max(64),
  blockId: z.string().min(1).max(64).optional(),
});

const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless/i;

const done = () => new NextResponse(null, { status: 204 });

// Counts a profile visit, or a click on one of its blocks. Anyone may call it,
// so each address is limited, and the owner's own visits are not counted.
export const POST = publicApi(
  async (request) => {
    if (BOT.test(request.headers.get('user-agent') ?? '')) return done();
    rateLimit('track', clientIp(request), { limit: 120, windowMs: 60_000 });

    const body = await readJson(request, TrackSchema, 2 * 1024);
    const target = await findTrackTarget(body.username, body.blockId);
    if (!target) return done();

    const user = await getCurrentUser();
    if (user?.id === target.ownerId) return done();

    if (target.blockId) await recordClick(target.pageId, target.blockId);
    else await recordView(target.pageId);
    return done();
  },
  { log: 'Tracking failed:' }
);
