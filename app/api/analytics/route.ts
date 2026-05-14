import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/db';
import { createClient } from '@/lib/supabase/server';

export type AnalyticsResponse = {
  viewsYesterday: number;
  views: number;
  clicks: Record<string, number>;
};

// The signed-in user's profile stats: yesterday's views (bento's footer
// counter), all-time views, and link clicks per block.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const page = await prisma.page.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!page) {
    return NextResponse.json<AnalyticsResponse>({
      viewsYesterday: 0,
      views: 0,
      clicks: {},
    });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const [viewsYesterday, views, clicks] = await Promise.all([
    prisma.pageView.count({
      where: { pageId: page.id, createdAt: { gte: yesterday, lt: today } },
    }),
    prisma.pageView.count({ where: { pageId: page.id } }),
    prisma.blockClick.groupBy({
      by: ['blockId'],
      where: { pageId: page.id },
      _count: { _all: true },
    }),
  ]);

  return NextResponse.json<AnalyticsResponse>({
    viewsYesterday,
    views,
    clicks: Object.fromEntries(
      clicks.map((row) => [row.blockId, row._count._all])
    ),
  });
}
