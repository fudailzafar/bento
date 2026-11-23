import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/server/api';
import { getR2PresignedUploadUrl } from '@/lib/server/r2';

const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

export const POST = withUser(
  async (user, request) => {
    const { filename, contentType, size } = await request.json();

    if (!filename || !contentType) {
      fail(400, 'Filename and contentType are required');
    }

    const isVideo = VIDEO_TYPES.includes(contentType);
    const isImage = contentType.startsWith('image/');

    if (!isVideo && !isImage)
      fail(400, 'Only image and video files are allowed');
    if (isVideo && size > MAX_VIDEO_BYTES) {
      fail(400, 'Video size must be less than 25MB');
    }
    if (isImage && size > MAX_IMAGE_BYTES) {
      fail(400, 'Image size must be less than 5MB');
    }

    const ext =
      filename.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const key = `block-images/${user.id}-${Date.now()}.${ext}`;

    const { uploadUrl, publicUrl } = await getR2PresignedUploadUrl({
      key,
      contentType,
    });

    return NextResponse.json({ uploadUrl, publicUrl, key });
  },
  {
    failure: 'Failed to generate upload URL',
    log: 'Error generating presigned upload URL:',
  }
);
