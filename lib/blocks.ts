import { z } from 'zod';

export const BlockTypeEnum = z.enum([
  'LINK',
  'IMAGE',
  'TEXT',
  'MAP',
  'SECTION_TITLE',
]);
export type BlockType = z.infer<typeof BlockTypeEnum>;

const LinkBlockData = z.object({
  url: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  // Open Graph details fetched when the link is added.
  image: z.string().optional(),
  // The owner's own preview picture: unset uses the website's, an empty
  // string means the picture was deleted.
  customImage: z.string().optional(),
  // The site's icon, fetched when the link is added; empty when it has none.
  favicon: z.string().optional(),
  description: z.string().optional(),
  // For platforms with no public data (Instagram, TikTok, Dribbble, Behance,
  // Figma, X), the owner's own preview pictures and bio.
  images: z.array(z.string()).max(6).optional(),
  bio: z.string().max(280).optional(),
});
type LinkBlockData = z.infer<typeof LinkBlockData>;

const ImageBlockData = z.object({
  url: z.string(),
  alt: z.string().optional(),
  // bento's media widget also plays short looping videos.
  kind: z.enum(['image', 'video']).optional(),
  // The uncropped upload, so a crop can be redone.
  original: z.string().optional(),
  // bento's caption pill in the bottom-left corner.
  caption: z.string().optional(),
  // Where the tile links to (bento's linkable widgets).
  href: z.string().optional(),
});
type ImageBlockData = z.infer<typeof ImageBlockData>;

const TextBlockData = z.object({
  content: z.string(),
  href: z.string().optional(),
  // bento's note colours and alignment.
  color: z.string().optional(),
  align: z.enum(['left', 'center', 'right']).optional(),
  valign: z.enum(['top', 'middle', 'bottom']).optional(),
});
type TextBlockData = z.infer<typeof TextBlockData>;

const MapBlockData = z.object({
  location: z.string(),
  label: z.string().optional(),
  // Where the map centres, set when a place is picked.
  lat: z.number().optional(),
  lng: z.number().optional(),
});
type MapBlockData = z.infer<typeof MapBlockData>;

const SectionTitleBlockData = z.object({
  title: z.string(),
});
type SectionTitleBlockData = z.infer<typeof SectionTitleBlockData>;

const BLOCK_DATA_SCHEMAS = {
  LINK: LinkBlockData,
  IMAGE: ImageBlockData,
  TEXT: TextBlockData,
  MAP: MapBlockData,
  SECTION_TITLE: SectionTitleBlockData,
} as const;

export function parseBlockData(type: BlockType, data: unknown) {
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
      return {
        location: '',
        label: 'Where I live',
      } satisfies MapBlockData;
    case 'SECTION_TITLE':
      return { title: 'Section' } satisfies SectionTitleBlockData;
  }
}

export const BlockSchema = z.object({
  id: z.string(),
  type: BlockTypeEnum,
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  // The phone layout: its own position and size (2 columns). Unset until the
  // phone layout is first edited; then it is derived from the desktop one.
  mx: z.number().nullish(),
  my: z.number().nullish(),
  mw: z.number().nullish(),
  mh: z.number().nullish(),
  data: z.record(z.string(), z.any()),
});
export type Block = z.infer<typeof BlockSchema>;

export const PageDataSchema = z.object({
  name: z.string().nullish(),
  headline: z.string().nullish(),
  bio: z.string().nullish(),
  website: z.string().nullish(),
  email: z.string().nullish(),
  twitter: z.string().nullish(),
  linkedin: z.string().nullish(),
  github: z.string().nullish(),
  blocks: z.array(BlockSchema).optional().default([]),
});
export type PageData = z.infer<typeof PageDataSchema>;
