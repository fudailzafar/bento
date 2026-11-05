import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchPlaces } from '@/lib/server/places';

// Place search for the map widget, through the free Photon geocoder. Signed-in
// users only, so the editor is the only caller.
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
    return NextResponse.json(await searchPlaces(query));
  } catch (error) {
    console.error('Geocoding failed:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 502 });
  }
}
