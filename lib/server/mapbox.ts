import { SITE_URL } from '@/lib/site';

const TOKEN =
  process.env.MAPBOX_SERVER_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Feature = {
  properties: {
    name: string;
    coordinates: { latitude: number; longitude: number };
    context?: { country?: { name?: string } };
  };
};

export type Place = { name: string; lat: number; lng: number };

function toPlace({ properties }: Feature): Place {
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
}

// Mapbox's Geocoding API, the "permanent" kind since places are saved.
async function geocode(
  path: 'forward' | 'reverse',
  params: Record<string, string>
): Promise<Place[]> {
  if (!TOKEN) throw new Error('No Mapbox token');
  const response = await fetch(
    `https://api.mapbox.com/search/geocode/v6/${path}?${new URLSearchParams({
      ...params,
      language: 'en',
      permanent: 'true',
      access_token: TOKEN,
    })}`,
    {
      // A token limited to certain URLs checks the referrer.
      headers: { referer: SITE_URL },
      signal: AbortSignal.timeout(6000),
    }
  );
  if (!response.ok) throw new Error(`Mapbox answered ${response.status}`);
  const { features }: { features: Feature[] } = await response.json();
  return features.map(toPlace);
}

export const searchPlaces = (q: string, limit = 5) =>
  geocode('forward', { q, limit: String(limit) });

export const placeAt = async (lat: number, lng: number) =>
  (
    await geocode('reverse', {
      latitude: String(lat),
      longitude: String(lng),
      limit: '1',
    })
  )[0];
