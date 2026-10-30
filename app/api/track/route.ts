import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/server/db';
import { createClient } from '@/lib/supabase/server';

// Records a profile view, or a click on one of its link widgets. Sent by the
// public profile page; the owner's own visits and crawlers are skipped.

const TrackSchema = z.object({
  username: z.string().min(1).max(64),
  blockId: z.string().min(1).max(64).optional(),
});

const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless/i;

export async function POST(request: NextRequest) {
  if (BOT.test(request.headers.get('user-agent') ?? '')) {
    return new NextResponse(null, { status: 204 });
  }

  let body: z.infer<typeof TrackSchema>;
  try {
    body = TrackSchema.parse(JSON.parse(await request.text()));
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const owner = await prisma.user.findUnique({
    where: { username: body.username },
    select: { id: true, page: { select: { id: true } } },
  });
  const pageId = owner?.page?.id;
  if (!pageId) return new NextResponse(null, { status: 204 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id === owner.id) return new NextResponse(null, { status: 204 });

  if (body.blockId) {
    const block = await prisma.block.findFirst({
      where: { id: body.blockId, pageId },
      select: { id: true },
    });
    if (block) {
      await prisma.blockClick.create({
        data: { pageId, blockId: block.id },
      });
    }
  } else {
    await prisma.pageView.create({ data: { pageId } });
  }

  return new NextResponse(null, { status: 204 });
}
