import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server/session';
import { getUserProfile, storeUserProfile } from '@/lib/server';
import { uploadToR2 } from '@/lib/server/r2';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const key = `profile-images/${user.id}-${Date.now()}.${fileExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageUrl = await uploadToR2({
      key,
      body: buffer,
      contentType: file.type,
    });

    // Update user profile with new image
    const userProfile = await getUserProfile(user.id);
    await storeUserProfile(user.id, {
      id: user.id,
      email: user.email,
      name: userProfile?.name || user.name || '',
      image: imageUrl,
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
