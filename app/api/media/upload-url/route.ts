import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server/session';
import { getR2PresignedUploadUrl } from '@/lib/server/r2';

const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, contentType, size } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and contentType are required' },
        { status: 400 }
      );
    }

    const isVideo = VIDEO_TYPES.includes(contentType);
    const isImage = contentType.startsWith('image/');

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Only image and video files are allowed' },
        { status: 400 }
      );
    }

    if (isVideo && size > MAX_VIDEO_BYTES) {
      return NextResponse.json(
        { error: 'Video size must be less than 25MB' },
        { status: 400 }
      );
    }

    if (isImage && size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    const ext = filename.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const key = `block-images/${user.id}-${Date.now()}.${ext}`;

    const { uploadUrl, publicUrl } = await getR2PresignedUploadUrl({
      key,
      contentType,
    });

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
