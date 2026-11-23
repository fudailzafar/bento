import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/server/api';
import { getUserProfile, storeUserProfile } from '@/lib/server';
import { uploadToR2 } from '@/lib/server/r2';

export const POST = withUser(
  async (user, request) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) fail(400, 'No file provided');
    if (!file.type.startsWith('image/')) {
      fail(400, 'Only image files are allowed');
    }
    if (file.size > 5 * 1024 * 1024)
      fail(400, 'File size must be less than 5MB');

    const fileExt = file.name.split('.').pop() || 'png';
    const key = `profile-images/${user.id}-${Date.now()}.${fileExt}`;

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
