import { SITE_URL } from '@/lib/site';

// Place search and reverse lookup through Photon (photon.komoot.io), the free
// OpenStreetMap geocoder. No key; it asks for fair use, so results are cached
// for a day and callers are signed-in users only.

const PHOTON = 'https://photon.komoot.io';

type Feature = {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    street?: string;
  };
};

export type Place = { name: string; lat: number; lng: number };

function toPlace({ geometry, properties: p }: Feature): Place {
  // "Berlin, Germany" rather than the full address chain.
  const head = p.name || p.city || p.street || p.state || p.country || '';
  const name = p.country && p.country !== head ? `${head}, ${p.country}` : head;
  return { name, lat: geometry.coordinates[1], lng: geometry.coordinates[0] };
}

async function photon(
  path: 'api' | 'reverse',
  params: Record<string, string>
): Promise<Place[]> {
  const response = await fetch(
    `${PHOTON}/${path}?${new URLSearchParams({ ...params, lang: 'en' })}`,
    {
      headers: { 'user-agent': `bento-clone (${SITE_URL})` },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 24 * 60 * 60 },
    }
  );
  if (!response.ok) throw new Error(`Photon answered ${response.status}`);
  const { features }: { features: Feature[] } = await response.json();
  return features.map(toPlace).filter((place) => place.name);
}

export const searchPlaces = (q: string, limit = 5) =>
  photon('api', { q, limit: String(limit) });

export const placeAt = async (lat: number, lng: number) =>
  (
    await photon('reverse', {
      lat: String(lat),
      lon: String(lng),
      limit: '1',
    })
  )[0];
