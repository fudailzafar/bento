// Client helpers for widget media: uploads (images and bento's looping
// videos) and the link preview lookup.

import { apiFetch } from './api-client';
import { contactLink } from './contact-link';
import { findPlatform } from './platforms';
import { withProtocol } from './url';
import { maxBytesFor, mediaKind } from './media-types';

export function isVideoUrl(url?: string) {
  return !!url && /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

// Whether a media widget's file is a video.
export function isVideoMedia(media: { url?: string; kind?: string }) {
  return media.kind === 'video' || isVideoUrl(media.url);
}

// A picture's or video's natural size, loaded once per address. Never settles
// when the file can't be read.
const sizes = new Map<string, Promise<{ w: number; h: number }>>();
export function mediaSize(src: string, video: boolean) {
  const known = sizes.get(src);
  if (known) return known;
  const size = new Promise<{ w: number; h: number }>((resolve) => {
    if (video) {
      const el = document.createElement('video');
      el.preload = 'metadata';
      el.muted = true;
      el.onloadedmetadata = () =>
        resolve({ w: el.videoWidth, h: el.videoHeight });
      // A failed load may work next time.
      el.onerror = () => sizes.delete(src);
      el.src = src;
    } else {
      const el = new Image();
      el.onload = () => resolve({ w: el.naturalWidth, h: el.naturalHeight });
      el.onerror = () => sizes.delete(src);
      el.src = src;
    }
  });
  sizes.set(src, size);
  return size;
}

export function isVideoFile(file: Blob) {
  return mediaKind(file.type) === 'video';
}

// Checks type and size before uploading; returns an error message or null.
export function checkMediaFile(file: Blob): string | null {
  const kind = mediaKind(file.type);
  if (!kind)
    return 'Please upload a JPG, PNG, GIF, WebP, MP4, WebM or MOV file';
  if (file.size > maxBytesFor(kind)) {
    return kind === 'video'
      ? 'Video size must be less than 25MB'
      : 'Image size must be less than 5MB';
  }
  return null;
}

// Uploads directly to Cloudflare R2 using presigned URLs.
// This bypasses Vercel's 4.5MB request body limit, allowing smooth direct uploads.
export async function uploadBlockMedia(
  file: Blob,
  name = 'image.jpg',
  onProgress?: (fraction: number) => void
): Promise<string> {
  const invalid = checkMediaFile(file);
  if (invalid) throw new Error(invalid);

  const fileName = file instanceof File ? file.name : name;

  // 1. Request presigned URL from backend
  const { uploadUrl, publicUrl } = await apiFetch<{
    uploadUrl: string;
    publicUrl: string;
  }>(
    '/api/media/upload-url',
    {
      method: 'POST',
      json: { filename: fileName, contentType: file.type, size: file.size },
    },
    'Failed to request upload URL'
  );

  // 2. Upload file directly to Cloudflare R2
  await putDirectToR2(uploadUrl, file, onProgress);

  return publicUrl;
}

// Uploads to Cloudflare R2 via presigned URL with progress reporting.
function putDirectToR2(
  uploadUrl: string,
  file: Blob,
  onProgress?: (fraction: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(e.loaded / e.total);
      };
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error('Failed to upload file to storage'));
    xhr.onerror = () => reject(new Error('Failed to upload file to storage'));
    xhr.send(file);
  });
}

interface LinkPreview {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
}

export async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  // An email or phone link has no page to fetch: its tile is titled with the
  // address or number.
  const contact = contactLink(url);
  if (contact) return { title: contact.label };
  try {
    const response = await fetch(
      `/api/link-preview?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) return {};
    return (await response.json()) as LinkPreview;
  } catch {
    return {};
  }
}

// What a link tile takes from its page once fetched: the picture, the
// description, the site's icon ('' when it has none), and its title unless
// the link is a known platform or the owner already named it.
export async function fetchLinkPatch(
  url: string,
  { keepTitle = false }: { keepTitle?: boolean } = {}
) {
  const preview = await fetchLinkPreview(url);
  return {
    image: preview.image,
    description: preview.description,
    favicon: preview.icon ?? '',
    ...(!keepTitle && preview.title && !findPlatform(url)
      ? { title: preview.title }
      : {}),
  };
}

// A pasted string that looks like a web address (no spaces, has a dot).
export function asUrl(text: string): string | null {
  const contact = contactLink(text);
  if (contact) return contact.href;
  const value = text.trim();
  if (!value || /\s/.test(value)) return null;
  if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/i.test(value)) {
    return null;
  }
  return withProtocol(value);
}
