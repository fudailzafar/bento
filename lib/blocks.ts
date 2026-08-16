import { z } from 'zod';

export const BlockTypeEnum = z.enum([
  'LINK',
  'IMAGE',
  'TEXT',
  'MAP',
  'SECTION_TITLE',
]);
export type BlockType = z.infer<typeof BlockTypeEnum>;

export const LinkBlockData = z.object({
  url: z.string(),
  title: z.string(),
  icon: z.string().optional(),
});
export type LinkBlockData = z.infer<typeof LinkBlockData>;

export const ImageBlockData = z.object({
  url: z.string(),
  alt: z.string().optional(),
});
export type ImageBlockData = z.infer<typeof ImageBlockData>;

export const TextBlockData = z.object({
  content: z.string(),
});
export type TextBlockData = z.infer<typeof TextBlockData>;

export const MapBlockData = z.object({
  location: z.string(),
  label: z.string().optional(),
});
export type MapBlockData = z.infer<typeof MapBlockData>;

export const SectionTitleBlockData = z.object({
  title: z.string(),
});
export type SectionTitleBlockData = z.infer<typeof SectionTitleBlockData>;

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
