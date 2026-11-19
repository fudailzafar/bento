import { parseBlockData, type Block } from '@/lib/blocks';
import { findPlatform } from '@/lib/platforms';
import { PLATFORM_ICONS } from '@/lib/platform-icons';

// What the share image draws for one block: a coloured box, a picture, a
// brand icon or a line of text, placed on the page's 4-column grid.
export interface OgTile {
  x: number;
  y: number;
  w: number;
  h: number;
  bg?: string;
  image?: string;
  position?: string;
  icon?: string;
  text?: string;
}

// The card shows the first rows of the page and fades out below them.
const VISIBLE_ROWS = 8;
const MAX_TILES = 10;
// Brand colours for platforms whose icon sits on black or white.
const BRAND_BG: Record<string, string> = { instagram: '#D6249F' };

export async function loadFont(text: string, weight = 700) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`
    )
  ).text();
  const url = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  )?.[1];
  const font = url ? await fetch(url) : undefined;
  if (!font?.ok) throw new Error('failed to load font data');
  return font.arrayBuffer();
}

// The image as a data URL. The renderer only reads PNG, JPEG and GIF, and one
// bad picture fails the whole card, so anything else comes back as null.
export async function loadImage(
  url: string | null | undefined,
  origin: string
) {
  if (!url) return undefined;
  try {
    const res = await fetch(new URL(url, origin), {
      signal: AbortSignal.timeout(3000),
    });
    const type = res.headers.get('content-type')?.split(';')[0] ?? '';
    if (!res.ok || !/^image\/(png|jpe?g|gif)$/.test(type)) return undefined;
    const bytes = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${bytes.toString('base64')}`;
  } catch {
    return undefined;
  }
}

function brandTile(url: string) {
  const platform = findPlatform(url);
  const svg = platform?.icon && PLATFORM_ICONS[platform.icon];
  if (!platform?.icon || !svg) return undefined;
  const fill = svg.match(/<rect[^>]*fill="([^"]+)"/)?.[1];
  return {
    bg: BRAND_BG[platform.icon] ?? fill,
    icon: `data:image/svg+xml,${encodeURIComponent(svg)}`,
  };
}

async function tileOf(block: Block, origin: string): Promise<OgTile> {
  const { x, y, w, h } = block;
  const tile: OgTile = { x, y, w, h };
  try {
    switch (block.type) {
      case 'IMAGE': {
        const data = parseBlockData('IMAGE', block.data);
        tile.image = await loadImage(
          data.kind === 'video' ? '' : data.url,
          origin
        );
        tile.position = `${(data.posX ?? 0.5) * 100}% ${(data.posY ?? 0.5) * 100}%`;
        break;
      }
      case 'LINK': {
        const data = parseBlockData('LINK', block.data);
        const picture = data.customImage ?? data.image ?? data.images?.[0];
        tile.image = h > 1 ? await loadImage(picture, origin) : undefined;
        if (!tile.image) Object.assign(tile, brandTile(data.url));
        if (!tile.image && !tile.icon) tile.text = data.title;
        break;
      }
      case 'TEXT': {
        const data = parseBlockData('TEXT', block.data);
        tile.bg = data.color;
        tile.text = data.content
          .replace(/<[^>]*>/g, ' ')
          .trim()
          .slice(0, 60);
        break;
      }
      case 'MAP':
        tile.bg = '#E4EEE1';
        tile.text = parseBlockData('MAP', block.data).location;
        break;
    }
  } catch {
    // A block with unreadable data is still drawn, as an empty box.
  }
  return tile;
}

export function ogTiles(blocks: Block[], origin: string) {
  const shown = blocks
    .filter((b) => b.type !== 'SECTION_TITLE')
    .sort((a, b) => a.y - b.y || a.x - b.x);
  // Start at the first tile, not at the page's first row (often a title).
  const top = shown[0]?.y ?? 0;
  return Promise.all(
    shown
      .filter((b) => b.y - top < VISIBLE_ROWS)
      .slice(0, MAX_TILES)
      .map((b) => tileOf({ ...b, y: b.y - top }, origin))
  );
}
