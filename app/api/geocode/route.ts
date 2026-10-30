import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Place search for the map widget, through OpenStreetMap's Nominatim.
// Signed-in users only, so the editor is the only caller.
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

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: query,
        format: 'jsonv2',
        limit: '5',
        addressdetails: '1',
        'accept-language': 'en',
      })}`,
      {
        // Nominatim's usage policy asks for an identifying user agent.
        headers: { 'user-agent': 'Portfoliofy (https://portfoliofy.me)' },
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 24 * 60 * 60 },
      }
    );
    if (!response.ok) throw new Error(`Nominatim answered ${response.status}`);
    const places: {
      name?: string;
      display_name: string;
      lat: string;
      lon: string;
      address?: { country?: string };
    }[] = await response.json();
    return NextResponse.json(
      places.map((place) => {
        // "Berlin, Germany" rather than the full address chain.
        const name = place.name || place.display_name.split(',')[0];
        const country = place.address?.country;
        return {
          name: country && country !== name ? `${name}, ${country}` : name,
          lat: Number(place.lat),
          lng: Number(place.lon),
        };
      })
    );
  } catch (error) {
    console.error('Geocoding failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 502 });
  }
}
