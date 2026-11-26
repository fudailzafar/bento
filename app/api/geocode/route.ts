import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/server/api';
import { rateLimit } from '@/lib/server/rate-limit';
import { searchPlaces } from '@/lib/server/places';

// Place search for the map widget, through the free Photon geocoder. Signed-in
// users only, so the editor is the only caller.
export const GET = withUser(
  async (user, request) => {
    rateLimit('geocode', user.id, { limit: 60, windowMs: 60000 });
    const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
    if (query.length < 2 || query.length > 120) return NextResponse.json([]);

    try {
      return NextResponse.json(await searchPlaces(query));
    } catch (error) {
      console.error('Geocoding failed:', error);
      return fail(502, 'Search failed');
    }
  },
  { log: 'Geocoding failed:' }
);
