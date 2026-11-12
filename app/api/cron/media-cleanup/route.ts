import { NextRequest, NextResponse } from 'next/server';
import { cleanupOrphanedMedia } from '@/lib/server/media-cleanup';

// Run daily by Vercel Cron (see vercel.json), which sends CRON_SECRET as a
// bearer token. `?dry=1` lists what would go without deleting.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dry = request.nextUrl.searchParams.get('dry') === '1';
    return NextResponse.json(await cleanupOrphanedMedia({ dry }));
  } catch (error) {
    console.error('Media cleanup failed:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
