// Links bento played inline instead of showing a link card: YouTube and Vimeo
// videos, Spotify and SoundCloud players.

export interface Embed {
  provider: 'youtube' | 'vimeo' | 'spotify' | 'soundcloud';
  src: string;
}

export function embedFor(url: string): Embed | null {
  let parsed: URL;
  try {
    parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www|m)\./, '');
  const path = parsed.pathname.split('/').filter(Boolean);

  if (host === 'youtube.com' || host === 'youtu.be') {
    const id =
      host === 'youtu.be'
        ? path[0]
        : path[0] === 'shorts' || path[0] === 'embed'
          ? path[1]
          : parsed.searchParams.get('v');
    if (id && /^[\w-]{6,}$/.test(id)) {
      return {
        provider: 'youtube',
        src: `https://www.youtube-nocookie.com/embed/${id}`,
      };
    }
  }

  if (host === 'vimeo.com' && /^\d+$/.test(path[0] ?? '')) {
    return {
      provider: 'vimeo',
      src: `https://player.vimeo.com/video/${path[0]}`,
    };
  }

  if (host === 'open.spotify.com') {
    // Skip a locale prefix such as /intl-de/.
    const parts = path[0]?.startsWith('intl-') ? path.slice(1) : path;
    const [kind, id] = parts;
    if (
      ['track', 'album', 'playlist', 'episode', 'show', 'artist'].includes(
        kind
      ) &&
      id
    ) {
      return {
        provider: 'spotify',
        src: `https://open.spotify.com/embed/${kind}/${id}`,
      };
    }
  }

  if (host === 'soundcloud.com' && path.length >= 2) {
    return {
      provider: 'soundcloud',
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        `https://soundcloud.com/${path.join('/')}`
      )}&visual=true&hide_related=true`,
    };
  }

  return null;
}
