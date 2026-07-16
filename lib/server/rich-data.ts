import type {
  GithubData,
  RichData,
  RichSource,
  SpotifyData,
  SpotifyTrack,
  YoutubeData,
} from '@/lib/rich-data';

// Fetches a smart widget's live data from the platform's public pages. Every
// request goes to a fixed host; Next caches responses for six hours.

const REVALIDATE = 6 * 60 * 60;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function getText(url: string) {
  const response = await fetch(url, {
    headers: { 'user-agent': UA, 'accept-language': 'en' },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: REVALIDATE },
  });
  if (!response.ok) throw new Error(`${url} answered ${response.status}`);
  return response.text();
}

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");
}

// GitHub: the contribution calendar GitHub renders on profile pages.
async function github(handle: string): Promise<GithubData> {
  const html = await getText(
    `https://github.com/users/${encodeURIComponent(handle)}/contributions`
  );
  const days = [
    ...html.matchAll(
      /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"/g
    ),
  ]
    .map(([, date, level]) => ({ date, level: Number(level) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!days.length) throw new Error('No contribution calendar');

  // Weeks start on Sunday, as on GitHub; pad the first week's missing days.
  const weeks: number[][] = [];
  let week: number[] = Array(new Date(days[0].date).getUTCDay()).fill(-1);
  for (const day of days) {
    week.push(day.level);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);

  const total = Number(
    html
      .match(/([\d,]+)\s+contributions?\s+in the last year/)?.[1]
      ?.replace(/,/g, '') ?? 0
  );
  const first = new Date(days[0].date);
  first.setUTCDate(first.getUTCDate() - first.getUTCDay());
  const start = first.toISOString().slice(0, 10);
  return { kind: 'github', handle, total, start, weeks };
}

// YouTube: the channel page for its id, name and subscribers, then the
// channel's public feed for the latest videos.
async function youtube(path: string): Promise<YoutubeData> {
  const html = await getText(`https://www.youtube.com/${path}`);
  const channelId =
    html.match(/"externalId":"(UC[\w-]{22})"/)?.[1] ??
    html.match(/youtube\.com\/channel\/(UC[\w-]{22})/)?.[1];
  if (!channelId) throw new Error('No channel id');
  const channelName = decodeEntities(
    html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? ''
  );
  const subscribers = html.match(/([\d.,]+[KMB]?) subscribers/)?.[1];

  const feed = await getText(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
  );
  const videos = [...feed.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => {
      const id = entry.match(/<yt:videoId>([\w-]+)<\/yt:videoId>/)?.[1];
      const title = entry.match(/<title>([^<]*)<\/title>/)?.[1];
      return id
        ? {
            id,
            title: decodeEntities(title ?? ''),
            thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
          }
        : null;
    })
    .filter((video): video is YoutubeData['videos'][number] => !!video)
    .slice(0, 8);
  return { kind: 'youtube', channelName, subscribers, videos };
}

// Spotify: the public embed page carries the entity as JSON.
interface SpotifyEntity {
  title?: string;
  name?: string;
  subtitle?: string;
  duration?: number;
  artists?: { name: string }[];
  audioPreview?: { url?: string };
  visualIdentity?: { image?: { url: string; maxWidth: number }[] };
  trackList?: {
    title: string;
    subtitle?: string;
    duration?: number;
    audioPreview?: { url?: string };
  }[];
}

async function spotify(
  type: SpotifyData['type'],
  id: string
): Promise<SpotifyData> {
  const html = await getText(`https://open.spotify.com/embed/${type}/${id}`);
  const json = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  )?.[1];
  if (!json) throw new Error('No Spotify data');
  const entity: SpotifyEntity | undefined =
    JSON.parse(json)?.props?.pageProps?.state?.data?.entity;
  if (!entity) throw new Error('No Spotify entity');

  const images = [...(entity.visualIdentity?.image ?? [])].sort(
    (a, b) => b.maxWidth - a.maxWidth
  );
  // A show's embed is its latest episode: show it as the show, with that
  // episode listed under it.
  if (type === 'show') {
    return {
      kind: 'spotify',
      type,
      title: entity.subtitle ?? '',
      cover: images[0]?.url,
      preview: entity.audioPreview?.url || undefined,
      tracks: [
        {
          title: entity.title ?? entity.name ?? '',
          duration: entity.duration,
          preview: entity.audioPreview?.url || undefined,
        },
      ],
    };
  }
  const tracks: SpotifyTrack[] = (entity.trackList ?? [])
    .slice(0, 10)
    .map((track) => ({
      title: track.title,
      subtitle: track.subtitle,
      duration: track.duration,
      preview: track.audioPreview?.url || undefined,
    }));
  return {
    kind: 'spotify',
    type,
    title: entity.title ?? entity.name ?? '',
    // An artist's embed subtitle is just "Top tracks".
    subtitle:
      type === 'artist'
        ? undefined
        : (entity.subtitle ?? entity.artists?.map((a) => a.name).join(', ')),
    cover: images[0]?.url,
    preview: entity.audioPreview?.url || undefined,
    duration: entity.duration || undefined,
    tracks,
  };
}

export async function getRichData(source: RichSource): Promise<RichData> {
  switch (source.kind) {
    case 'github':
      return github(source.handle);
    case 'youtube':
      return youtube(source.path);
    case 'spotify':
      return spotify(source.type, source.id);
  }
}
