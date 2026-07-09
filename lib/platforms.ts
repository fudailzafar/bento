// Link platforms as bento.me styled them: tile tint (bg / hover / active),
// brand icon, and the call-to-action pill. Colours come from bento's widget
// CSS variables and button classes in its archived profile pages.

interface Platform {
  id: string;
  name: string;
  hosts: string[];
  // Tile background tints; omitted = plain white tile.
  bg?: string;
  hover?: string;
  active?: string;
  // Key into PLATFORM_ICONS; omitted = site favicon.
  icon?: string;
  button?: { label: string; className: string; play?: boolean };
  // Show "@name" (or "name") taken from the URL path.
  handle?: 'at' | 'plain';
  // Post previews bento showed on wider tiles (empty placeholders here).
  posts?: boolean;
}

const WHITE = { hover: '#FBFBFB', active: '#EFEFEF' };

const PLATFORMS: Platform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    hosts: ['twitter.com', 'x.com'],
    bg: '#F5FAFE',
    hover: '#F0F7FD',
    active: '#E9F4FC',
    icon: 'twitter',
    handle: 'at',
    button: {
      label: 'Follow',
      className:
        'rounded-full bg-[#55ACEE] text-white hover:bg-[#4698D7] active:bg-[#4698D7]',
    },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    hosts: ['instagram.com'],
    ...WHITE,
    icon: 'instagram',
    handle: 'at',
    posts: true,
    button: {
      label: 'Follow',
      className:
        'rounded-lg bg-[#4093EF] text-white hover:bg-[#2875CA] active:bg-[#3383DC] active:text-white/80',
    },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    hosts: ['youtube.com', 'youtu.be', 'm.youtube.com'],
    bg: '#FFF0F0',
    hover: '#FFE8E8',
    active: '#FFDBDB',
    icon: 'youtube',
    handle: 'at',
    posts: true,
    button: {
      label: 'Subscribe',
      className:
        'rounded-full bg-[#FF0000] text-white hover:bg-[#EB0404] active:bg-[#DE0000] active:text-white/90',
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    hosts: ['linkedin.com'],
    bg: '#F0F6F9',
    hover: '#E9F4FA',
    active: '#DFEFF8',
    icon: 'linkedin',
  },
  {
    id: 'github',
    name: 'GitHub',
    hosts: ['github.com'],
    icon: 'github',
    handle: 'plain',
    button: {
      label: 'Follow',
      className:
        'rounded-[6px] border border-[rgba(27,31,36,.15)] bg-[#f6f8fa] !px-[21px] text-[#24292f] shadow-[0_1px_0_rgba(27,31,36,.04),inset_0_1px_0_hsla(0,0%,100%,.25)] hover:bg-[#f3f4f6] active:bg-[#ebecf0]',
    },
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    hosts: ['dribbble.com'],
    bg: '#FFF3FC',
    hover: '#FFEEFB',
    active: '#FFE9F9',
    icon: 'dribbble',
    posts: true,
    button: {
      label: 'Follow',
      className:
        'rounded-full border border-[#e7e7e9] bg-white text-black hover:bg-[#FFFAFE] active:bg-[#FFF4FC]',
    },
  },
  {
    id: 'behance',
    name: 'Behance',
    hosts: ['behance.net'],
    bg: '#F3F6FE',
    hover: '#EDF2FD',
    active: '#E5ECFC',
    posts: true,
    button: {
      label: 'Follow',
      className:
        'rounded-[18px] bg-[#2F65EE] text-white hover:bg-[#003ecb] active:bg-[#002f9a] active:text-white/80',
    },
  },
  {
    id: 'figma',
    name: 'Figma',
    hosts: ['figma.com'],
    ...WHITE,
    icon: 'figma',
    handle: 'at',
    posts: true,
    button: {
      label: 'Follow',
      className:
        'rounded-[4px] bg-[#4497F7] !font-normal text-white hover:bg-[#007be5] active:bg-[#007be5] active:text-white/80',
    },
  },
  {
    id: 'spotify',
    name: 'Spotify',
    hosts: ['open.spotify.com', 'spotify.com'],
    bg: '#EDFCF3',
    hover: '#E7F9EE',
    active: '#DBF3E5',
    icon: 'spotify',
    button: {
      label: 'Play',
      play: true,
      className:
        'min-w-[86px] rounded-[18px] bg-[#1ED760] text-white hover:bg-[#1fdf64] active:scale-[.95] active:bg-[#169c46] active:text-white/80',
    },
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    hosts: ['tiktok.com'],
    ...WHITE,
    icon: 'tiktok',
    handle: 'at',
    button: {
      label: 'Follow',
      className:
        'rounded-[4px] bg-[#FE2C55] text-white hover:bg-[#EF2950] active:bg-[#E0274B]',
    },
  },
  {
    id: 'substack',
    name: 'Substack',
    hosts: ['substack.com'],
    bg: '#FFF6F2',
    hover: '#FDEDE6',
    active: '#FCE5DB',
    icon: 'substack',
  },
  {
    id: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    hosts: ['buymeacoffee.com'],
    bg: '#FFFDEB',
    hover: '#FFFBE0',
    active: '#FFF8D3',
  },
  { id: 'twitch', name: 'Twitch', hosts: ['twitch.tv'], icon: 'twitch' },
  {
    id: 'facebook',
    name: 'Facebook',
    hosts: ['facebook.com'],
    icon: 'facebook',
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    hosts: ['producthunt.com'],
    icon: 'producthunt',
  },
  { id: 'readcv', name: 'Read.cv', hosts: ['read.cv'], icon: 'readcv' },
  { id: 'codepen', name: 'CodePen', hosts: ['codepen.io'], icon: 'codepen' },
  {
    id: 'applemusic',
    name: 'Apple Music',
    hosts: ['music.apple.com'],
    icon: 'applemusic',
  },
];

export function hostOf(url: string): string {
  try {
    return new URL(
      url.startsWith('http') ? url : `https://${url}`
    ).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function findPlatform(url: string): Platform | undefined {
  const host = hostOf(url);
  if (!host) return undefined;
  return PLATFORMS.find((p) =>
    p.hosts.some((h) => host === h || host.endsWith(`.${h}`))
  );
}

// "@name" / "name" from the first path segment, as bento showed under the title.
export function handleFrom(
  url: string,
  style: 'at' | 'plain'
): string | undefined {
  try {
    const segment = new URL(
      url.startsWith('http') ? url : `https://${url}`
    ).pathname
      .split('/')
      .filter(Boolean)[0];
    if (!segment || ['in', 'channel', 'c', 'user', 'company'].includes(segment))
      return undefined;
    const name = segment.replace(/^@/, '');
    return style === 'at' ? `@${name}` : name;
  } catch {
    return undefined;
  }
}
