import { NextRequest, NextResponse } from 'next/server';
import { richSourceFor } from '@/lib/rich-data';
import { getRichData } from '@/lib/server/rich-data';

// Live data for smart widgets. Public, since profile visitors load it; only
// links richSourceFor recognises are fetched, from their platform's own host.
export async function GET(request: NextRequest) {
  const source = richSourceFor(request.nextUrl.searchParams.get('url') ?? '');
  if (!source) {
    return NextResponse.json({ error: 'Not a smart link' }, { status: 400 });
  }
  try {
    const data = await getRichData(source);
    return NextResponse.json(data, {
      headers: {
        'cache-control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Rich data failed:', error);
    return NextResponse.json({ error: 'Unavailable' }, { status: 502 });
  }
}
