import { z } from 'zod';

export const BlockTypeEnum = z.enum([
  'LINK',
  'IMAGE',
  'TEXT',
  'MAP',
  'SECTION_TITLE',
]);
export type BlockType = z.infer<typeof BlockTypeEnum>;

// Limits on what a saved page may hold, so one account cannot store an
// unbounded amount.
export const MAX_BLOCKS = 200;
const URL_MAX = 2048;

const LinkBlockData = z.object({
  url: z.string().max(URL_MAX),
  title: z.string().max(300),
  icon: z.string().max(100).optional(),
  // Open Graph details fetched when the link is added.
  image: z.string().max(URL_MAX).optional(),
  // The owner's own preview picture: unset uses the website's, an empty
  // string means the picture was deleted.
  customImage: z.string().max(URL_MAX).optional(),
  // The site's icon, fetched when the link is added; empty when it has none.
  favicon: z.string().max(URL_MAX).optional(),
  description: z.string().max(2000).optional(),
  // For platforms with no public data (Instagram, TikTok, Dribbble, Behance,
  // Figma, X), the owner's own preview pictures and bio.
  images: z.array(z.string().max(URL_MAX)).max(6).optional(),
  bio: z.string().max(280).optional(),
});
type LinkBlockData = z.infer<typeof LinkBlockData>;

const ImageBlockData = z.object({
  url: z.string().max(URL_MAX),
  alt: z.string().max(300).optional(),
  // bento's media widget also plays short looping videos.
  kind: z.enum(['image', 'video']).optional(),
  // Where the picture sits in its frame (bento's crop), 0 to 1.
  posX: z.number().min(0).max(1).optional(),
  posY: z.number().min(0).max(1).optional(),
  // Older crops re-uploaded the picture; their uncropped upload.
  original: z.string().max(URL_MAX).optional(),
  // bento's caption pill in the bottom-left corner.
  caption: z.string().max(500).optional(),
  // Where the tile links to (bento's linkable widgets).
  href: z.string().max(URL_MAX).optional(),
});
type ImageBlockData = z.infer<typeof ImageBlockData>;

const TextBlockData = z.object({
  content: z.string().max(20_000),
  href: z.string().max(URL_MAX).optional(),
  // bento's note colours and alignment.
  color: z.string().max(20).optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  valign: z.enum(['top', 'middle', 'bottom']).optional(),
});
type TextBlockData = z.infer<typeof TextBlockData>;

const MapBlockData = z.object({
  location: z.string().max(300),
  label: z.string().max(300).optional(),
  // Where the map centres, set when a place is picked.
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});
type MapBlockData = z.infer<typeof MapBlockData>;

const SectionTitleBlockData = z.object({
  title: z.string().max(300),
});
type SectionTitleBlockData = z.infer<typeof SectionTitleBlockData>;

const BLOCK_DATA_SCHEMAS = {
  LINK: LinkBlockData,
  IMAGE: ImageBlockData,
  TEXT: TextBlockData,
  MAP: MapBlockData,
  SECTION_TITLE: SectionTitleBlockData,
} as const;

export function parseBlockData<T extends BlockType>(
  type: T,
  data: unknown
): z.infer<(typeof BLOCK_DATA_SCHEMAS)[T]> {
  return BLOCK_DATA_SCHEMAS[type].parse(data);
}

export function defaultBlockData(type: BlockType) {
  switch (type) {
    case 'LINK':
      return { url: '', title: 'New link' } satisfies LinkBlockData;
    case 'IMAGE':
      return { url: '' } satisfies ImageBlockData;
    case 'TEXT':
      return { content: '' } satisfies TextBlockData;
    case 'MAP':
      // A new map starts on Berlin until a place is picked.
      return {
        location: 'Berlin, Germany',
        lat: 52.52,
        lng: 13.405,
      } satisfies MapBlockData;
    case 'SECTION_TITLE':
      return { title: 'Section' } satisfies SectionTitleBlockData;
  }
}

export const BlockSchema = z.object({
  id: z.string().min(1).max(64),
  type: BlockTypeEnum,
  x: z.number().int().min(0).max(1000),
  y: z.number().int().min(0).max(100_000),
  w: z.number().int().min(1).max(12),
  h: z.number().int().min(1).max(12),
  // The phone layout: its own position and size (2 columns). Unset until the
  // phone layout is first edited; then it is derived from the desktop one.
  mx: z.number().int().min(0).max(1000).nullish(),
  my: z.number().int().min(0).max(100_000).nullish(),
  mw: z.number().int().min(1).max(12).nullish(),
  mh: z.number().int().min(1).max(12).nullish(),
  data: z.record(z.string(), z.any()),
});
export type Block = z.infer<typeof BlockSchema>;

export const PageDataSchema = z.object({
  name: z.string().max(200).nullish(),
  headline: z.string().max(500).nullish(),
  bio: z.string().max(5000).nullish(),
  website: z.string().max(URL_MAX).nullish(),
  email: z.string().max(320).nullish(),
  twitter: z.string().max(300).nullish(),
  linkedin: z.string().max(300).nullish(),
  github: z.string().max(300).nullish(),
  blocks: z.array(BlockSchema).max(MAX_BLOCKS).optional().default([]),
});
export type PageData = z.infer<typeof PageDataSchema>;

// A save names the version of the page it was edited from (0: no page yet).
export const SavePageSchema = z.object({
  page: PageDataSchema,
  version: z.number().int().min(0),
});
