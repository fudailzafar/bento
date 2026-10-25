// Reading a map link (Google, Apple or OpenStreetMap, a share link, or the
// embed code Google gives) into a place for a map widget.

export type MapLink = {
  lat?: number;
  lng?: number;
  // A place name or search text from the link, when it has one.
  name?: string;
};

const SHORT_HOSTS = /^(maps\.app\.goo\.gl|goo\.gl|g\.co)$/i;

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// The src of a pasted <iframe>, else the text itself.
export function unwrapEmbed(text: string) {
  const src = text.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1];
  return (src ?? text).trim().replace(/&amp;/g, '&');
}

// Short links must be followed to find the place.
export function isShortMapsLink(url: string) {
  const host = hostOf(url);
  if (!SHORT_HOSTS.test(host)) return false;
  const { pathname } = new URL(url);
  return host !== 'goo.gl' || pathname.startsWith('/maps');
}

export function isMapsUrl(raw: string) {
  const url = unwrapEmbed(raw);
  const host = hostOf(url);
  if (!host) return false;
  if (isShortMapsLink(url)) return true;
  const { pathname } = new URL(url);
  if (/^maps\.google\.[a-z.]+$/.test(host)) return true;
  if (/^google\.[a-z.]+$/.test(host)) return pathname.startsWith('/maps');
  if (host === 'maps.apple.com') return true;
  if (host === 'openstreetmap.org') return true;
  return false;
}

const num = '(-?\\d{1,3}(?:\\.\\d+)?)';

export function parseMapsUrl(raw: string): MapLink | null {
  const url = unwrapEmbed(raw);
  if (!isMapsUrl(url)) return null;
  let decoded = url;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    // Keep the raw text.
  }
  const link = new URL(url);
  const params = link.searchParams;

  // The place's own pin beats the map's centre.
  let match =
    decoded.match(new RegExp(`!3d${num}!4d${num}`)) ??
    decoded.match(new RegExp(`!2d${num}!3d${num}`)); // embed: lng first
  let lat: number | undefined;
  let lng: number | undefined;
  if (match) {
    const embed = decoded.includes('!2d') && !decoded.match(/!4d/);
    [lat, lng] = embed
      ? [Number(match[2]), Number(match[1])]
      : [Number(match[1]), Number(match[2])];
  }
  if (lat === undefined) {
    for (const key of ['ll', 'q', 'query', 'center', 'daddr', 'sll']) {
      const m = params.get(key)?.match(new RegExp(`^${num}\\s*,\\s*${num}$`));
      if (m) {
        [lat, lng] = [Number(m[1]), Number(m[2])];
        break;
      }
    }
  }
  if (lat === undefined) {
    const m = params.has('mlat')
      ? [null, params.get('mlat'), params.get('mlon')]
      : (link.hash.match(new RegExp(`map=\\d+/${num}/${num}`)) ??
        decoded.match(new RegExp(`@${num},${num}`)));
    if (m && m[1] != null && m[2] != null) {
      [lat, lng] = [Number(m[1]), Number(m[2])];
    }
  }

  // A name: /maps/place/<name>/, or text in q / query / address.
  let name: string | undefined;
  const place = link.pathname.match(/\/maps\/place\/([^/]+)/)?.[1];
  const search = link.pathname.match(/\/maps\/search\/([^/]+)/)?.[1];
  const text = params.get('q') ?? params.get('query') ?? params.get('address');
  const candidate =
    (place && decodeURIComponent(place.replace(/\+/g, ' '))) ||
    (search && decodeURIComponent(search.replace(/\+/g, ' '))) ||
    text ||
    undefined;
  if (candidate && !new RegExp(`^${num}\\s*,\\s*${num}$`).test(candidate)) {
    name = candidate.trim();
  }

  const valid =
    lat !== undefined &&
    lng !== undefined &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180;
  if (!valid && !name) return null;
  return valid ? { lat, lng, name } : { name };
}
