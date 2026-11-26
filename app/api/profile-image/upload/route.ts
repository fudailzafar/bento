import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/server/api';
import { getUserProfile, storeUserProfile } from '@/lib/server';
import { uploadToR2 } from '@/lib/server/r2';
import { rateLimit } from '@/lib/server/rate-limit';
import { MAX_IMAGE_BYTES, extensionFor, mediaKind } from '@/lib/media-types';

export const POST = withUser(
  async (user, request) => {
    rateLimit('profile-image', user.id, { limit: 20, windowMs: 60 * 60_000 });
    const declared = Number(request.headers.get('content-length'));
    if (declared > MAX_IMAGE_BYTES + 64 * 1024) fail(413, 'File is too large');

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) fail(400, 'No file provided');
    if (mediaKind(file.type) !== 'image') {
      fail(400, 'Only JPG, PNG, GIF, WebP, AVIF and HEIC images are allowed');
    }
    if (file.size > MAX_IMAGE_BYTES)
      fail(400, 'File size must be less than 5MB');

    const key = `profile-images/${user.id}-${crypto.randomUUID()}.${extensionFor(file.type)}`;

    const imageUrl = await uploadToR2({
      key,
      body: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    });

    const userProfile = await getUserProfile(user.id);
    await storeUserProfile(user.id, {
      id: user.id,
      email: user.email,
      name: userProfile?.name || user.name || '',
      image: imageUrl,
    });

    return NextResponse.json({ imageUrl });
  },
  { failure: 'Failed to upload image', log: 'Error uploading profile image:' }
);
