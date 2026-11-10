// Client helpers for widget media: uploads (images and bento's looping
// videos) and the link preview lookup.

const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

export function isVideoUrl(url?: string) {
  return !!url && /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

export function isVideoFile(file: Blob) {
  return VIDEO_TYPES.includes(file.type);
}

// Checks type and size before uploading; returns an error message or null.
export function checkMediaFile(file: Blob): string | null {
  if (isVideoFile(file)) {
    return file.size > MAX_VIDEO_BYTES
      ? 'Video size must be less than 25MB'
      : null;
  }
  if (!file.type.startsWith('image/')) {
    return 'Please upload an image or video file';
  }
  return file.size > MAX_IMAGE_BYTES
    ? 'Image size must be less than 5MB'
    : null;
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
  const res = await fetch('/api/media/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: fileName,
      contentType: file.type,
      size: file.size,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to request upload URL');
  }

  const { uploadUrl, publicUrl } = await res.json();

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

// A pasted string that looks like a web address (no spaces, has a dot).
export function asUrl(text: string): string | null {
  const value = text.trim();
  if (!value || /\s/.test(value)) return null;
  if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/i.test(value)) {
    return null;
  }
  return value.startsWith('http') ? value : `https://${value}`;
}
