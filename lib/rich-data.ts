// bento's "smart widgets": links whose tile shows live data pulled from the
// platform. These are the platforms with a public, key-free source.

export interface GithubData {
  kind: 'github';
  handle: string;
  total: number;
  // The first week's Sunday, as YYYY-MM-DD.
  start: string;
  // Contribution levels (0-4), one array of 7 days per week, oldest first.
  weeks: number[][];
}

export interface YoutubeData {
  kind: 'youtube';
  channelName: string;
  // As YouTube writes it, e.g. "21.4M".
  subscribers?: string;
  videos: { id: string; title: string; thumbnail: string }[];
}

export interface SpotifyTrack {
  title: string;
  subtitle?: string;
  // Milliseconds.
  duration?: number;
  // 30-second preview clip.
  preview?: string;
}

export interface SpotifyData {
  kind: 'spotify';
  type: 'track' | 'album' | 'playlist' | 'artist' | 'episode' | 'show';
  title: string;
  subtitle?: string;
  cover?: string;
  preview?: string;
  duration?: number;
  tracks: SpotifyTrack[];
}

export type RichData = GithubData | YoutubeData | SpotifyData;

export type RichSource =
  | { kind: 'github'; handle: string }
  | { kind: 'youtube'; path: string }
  | { kind: 'spotify'; type: SpotifyData['type']; id: string };

// GitHub paths that are site pages, not people.
const GITHUB_PAGES = new Set([
  'about',
  'collections',
  'enterprise',
  'events',
  'explore',
  'features',
  'login',
  'marketplace',
  'new',
  'notifications',
  'orgs',
  'pricing',
  'pulls',
  'issues',
  'settings',
  'signup',
  'sponsors',
  'topics',
  'trending',
]);

const SPOTIFY_TYPES = [
  'track',
  'album',
  'playlist',
  'artist',
  'episode',
  'show',
] as const;

// Which smart widget a link gets, if any. Only fixed hosts and checked ids
// come out of here, so the server never fetches an address a visitor chose.
export function richSourceFor(url: string): RichSource | null {
  let parsed: URL;
  try {
    parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www|m)\./, '');
  const path = parsed.pathname.split('/').filter(Boolean);

  if (host === 'github.com' && path.length === 1) {
    const handle = path[0];
    if (
      /^[a-z\d](?:[a-z\d-]{0,38})$/i.test(handle) &&
      !GITHUB_PAGES.has(handle.toLowerCase())
    ) {
      return { kind: 'github', handle };
    }
  }

  if (host === 'youtube.com' && path.length >= 1) {
    const [first, second] = path;
    if (/^@[\w.-]{1,100}$/.test(first)) {
      return { kind: 'youtube', path: first };
    }
    if (
      ['channel', 'c', 'user'].includes(first) &&
      second &&
      /^[\w.-]{1,100}$/.test(second)
    ) {
      return { kind: 'youtube', path: `${first}/${second}` };
    }
  }

  if (host === 'open.spotify.com') {
    // Skip a locale prefix such as /intl-de/.
    const parts = path[0]?.startsWith('intl-') ? path.slice(1) : path;
    const [type, id] = parts;
    if (
      (SPOTIFY_TYPES as readonly string[]).includes(type) &&
      /^[A-Za-z0-9]{22}$/.test(id ?? '')
    ) {
      return { kind: 'spotify', type: type as SpotifyData['type'], id };
    }
  }

  return null;
}

// "3:20", or "1h 12min" for long episodes, as bento showed durations.
export function formatDuration(ms?: number) {
  if (!ms) return '';
  const total = Math.round(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours) return `${hours}h ${minutes}min`;
  return `${minutes}:${String(total % 60).padStart(2, '0')}`;
}
