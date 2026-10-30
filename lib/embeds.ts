// Links bento played inline instead of showing a link card: YouTube and Vimeo
// videos and SoundCloud players. Spotify links are smart widgets instead.

interface Embed {
  provider: 'youtube' | 'vimeo' | 'soundcloud';
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
