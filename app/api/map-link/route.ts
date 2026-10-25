import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isShortMapsLink, parseMapsUrl, unwrapEmbed } from '@/lib/maps';
import { placeAt, searchPlaces } from '@/lib/server/mapbox';

// Turns a pasted map link (Google Maps, a share link, embed code, Apple Maps
// or OpenStreetMap) into a place for a map widget. Signed-in users only.

// Where a share link may lead: only map and short-link hosts are followed.
const FOLLOW = /(^|\.)(google\.[a-z.]+|goo\.gl|g\.co|apple\.com)$/i;

async function resolveShortLink(start: string) {
  let url = start;
  for (let hop = 0; hop < 5; hop++) {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; BentoBot/1.0)' },
      signal: AbortSignal.timeout(5000),
    });
    const next = response.headers.get('location');
    if (!next || response.status < 300 || response.status >= 400) return url;
    const target = new URL(next, url);
    if (!FOLLOW.test(target.hostname) || target.protocol !== 'https:')
      return url;
    url = target.toString();
    if (parseMapsUrl(url)) return url;
  }
  return url;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let url = unwrapEmbed(request.nextUrl.searchParams.get('url') ?? '');
  if (url.length > 2000) {
    return NextResponse.json({ error: 'Not a map' }, { status: 400 });
  }
  try {
    if (isShortMapsLink(url)) url = await resolveShortLink(url);
    const link = parseMapsUrl(url);
    if (!link) {
      return NextResponse.json({ error: 'Not a map' }, { status: 404 });
    }

    // Coordinates but no name: name the spot. A name but no coordinates:
    // find it.
    if (link.lat !== undefined && link.lng !== undefined) {
      const place = link.name
        ? undefined
        : await placeAt(link.lat, link.lng).catch(() => undefined);
      return NextResponse.json({
        location: link.name ?? place?.name ?? '',
        lat: link.lat,
        lng: link.lng,
      });
    }
    const [place] = await searchPlaces(link.name!, 1);
    if (!place) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({
      location: link.name!.length <= 40 ? link.name! : place.name,
      lat: place.lat,
      lng: place.lng,
    });
  } catch (error) {
    console.error('Map link failed:', error);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 502 });
  }
}
