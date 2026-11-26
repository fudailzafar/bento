// The files a profile may hold, checked in the browser before an upload and
// again on the server before an upload address is signed.

export const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/heic': 'heic',
  'image/heif': 'heif',
} as const;

export const VIDEO_TYPES = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
} as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

export type MediaKind = 'image' | 'video';

export function mediaKind(contentType: string): MediaKind | null {
  if (contentType in IMAGE_TYPES) return 'image';
  if (contentType in VIDEO_TYPES) return 'video';
  return null;
}

// The extension comes from the type, never from the file's own name.
export function extensionFor(contentType: string): string | null {
  return (
    (IMAGE_TYPES as Record<string, string>)[contentType] ??
    (VIDEO_TYPES as Record<string, string>)[contentType] ??
    null
  );
}

export const maxBytesFor = (kind: MediaKind) =>
  kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
