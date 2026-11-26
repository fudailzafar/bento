import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, withUser } from '@/lib/server/api';
import { rateLimit } from '@/lib/server/rate-limit';
import { readJson } from '@/lib/server/request';
import { getR2PresignedUploadUrl } from '@/lib/server/r2';
import { extensionFor, maxBytesFor, mediaKind } from '@/lib/media-types';

const UploadRequest = z.object({
  contentType: z.string().max(100),
  size: z.number().int().positive(),
});

// Signs a one-off upload address for an image or video. The file's type and
// exact size are part of the signature, the name is ours, and the extension
// comes from the type.
export const POST = withUser(
  async (user, request) => {
    rateLimit('upload-url', user.id, { limit: 60, windowMs: 60 * 60_000 });
    const { contentType, size } = await readJson(request, UploadRequest);

    const kind = mediaKind(contentType);
    if (!kind) fail(400, 'Only JPG, PNG, GIF, WebP, MP4, WebM and MOV files');
    if (size > maxBytesFor(kind)) {
      fail(
        400,
        kind === 'video'
          ? 'Video size must be less than 25MB'
          : 'Image size must be less than 5MB'
      );
    }

    const key = `block-images/${user.id}-${crypto.randomUUID()}.${extensionFor(contentType)}`;
    const { uploadUrl, publicUrl } = await getR2PresignedUploadUrl({
      key,
      contentType,
      contentLength: size,
    });
    return NextResponse.json({ uploadUrl, publicUrl, key });
  },
  {
    failure: 'Failed to generate upload URL',
    log: 'Error generating presigned upload URL:',
  }
);
