import { createClient } from '@/lib/supabase/client';

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

// Uploads straight to Supabase storage from the browser: Vercel caps API
// request bodies at 4.5MB, below the video limit. The bucket policy only lets
// a user write files named after their own id.
export async function uploadBlockMedia(
  file: Blob,
  name = 'image.jpg',
  onProgress?: (fraction: number) => void
): Promise<string> {
  const invalid = checkMediaFile(file);
  if (invalid) throw new Error(invalid);
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in again');
  const fileName = file instanceof File ? file.name : name;
  const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `block-images/${user.id}-${Date.now()}.${ext}`;
  if (onProgress) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    await putWithProgress(path, file, session?.access_token, onProgress);
    return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
  }
  const { error } = await supabase.storage
    .from('images')
    .upload(path, file, { cacheControl: '3600', contentType: file.type });
  if (error) throw new Error('Failed to upload file');
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
}

// The storage upload again, over XHR, which reports how much has been sent.
function putWithProgress(
  path: string,
  file: Blob,
  token: string | undefined,
  onProgress: (fraction: number) => void
) {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/images/${path}`
    );
    xhr.setRequestHeader('apikey', key);
    xhr.setRequestHeader('Authorization', `Bearer ${token ?? key}`);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('cache-control', 'max-age=3600');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error('Failed to upload file'));
    xhr.onerror = () => reject(new Error('Failed to upload file'));
    xhr.send(file);
  });
}

interface LinkPreview {
  title?: string;
  description?: string;
  image?: string;
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
