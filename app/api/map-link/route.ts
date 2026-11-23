import { NextResponse } from 'next/server';
import { ApiError, fail, withUser } from '@/lib/server/api';
import { isShortMapsLink, parseMapsUrl, unwrapEmbed } from '@/lib/maps';
import { placeAt, searchPlaces } from '@/lib/server/places';

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

export const GET = withUser(async (_user, request) => {
  let url = unwrapEmbed(request.nextUrl.searchParams.get('url') ?? '');
  if (url.length > 2000) fail(400, 'Not a map');
  try {
    if (isShortMapsLink(url)) url = await resolveShortLink(url);
    const link = parseMapsUrl(url);
    if (!link) fail(404, 'Not a map');

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
    if (!place) fail(404, 'Not found');
    return NextResponse.json({
      location: link.name!.length <= 40 ? link.name! : place.name,
      lat: place.lat,
      lng: place.lng,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Map link failed:', error);
    return fail(502, 'Lookup failed');
  }
});
