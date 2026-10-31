import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';

// Place search for the map widget, through Mapbox's Geocoding API. Signed-in
// users only, so the editor is the only caller. Picked places are saved on the
// page, so the lookup is the "permanent" kind Mapbox's terms ask for then.
const TOKEN =
  process.env.MAPBOX_SERVER_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (query.length < 2 || query.length > 120) return NextResponse.json([]);

  if (!TOKEN) {
    return NextResponse.json({ error: 'Search unavailable' }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?${new URLSearchParams({
        q: query,
        limit: '5',
        language: 'en',
        permanent: 'true',
        access_token: TOKEN,
      })}`,
      {
        // A token limited to certain URLs checks the referrer, which a
        // server request doesn't carry unless it is set.
        headers: { referer: SITE_URL },
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 24 * 60 * 60 },
      }
    );
    if (!response.ok) throw new Error(`Mapbox answered ${response.status}`);
    const {
      features,
    }: {
      features: {
        properties: {
          name: string;
          coordinates: { latitude: number; longitude: number };
          context?: { country?: { name?: string } };
        };
      }[];
    } = await response.json();
    return NextResponse.json(
      features.map(({ properties }) => {
        // "Berlin, Germany" rather than the full address chain.
        const country = properties.context?.country?.name;
        return {
          name:
            country && country !== properties.name
              ? `${properties.name}, ${country}`
              : properties.name,
          lat: properties.coordinates.latitude,
          lng: properties.coordinates.longitude,
        };
      })
    );
  } catch (error) {
    console.error('Geocoding failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 502 });
  }
}
