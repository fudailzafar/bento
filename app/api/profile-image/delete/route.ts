import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server/session';
import { getUserProfile, storeUserProfile } from '@/lib/server';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const userProfile = await getUserProfile(user.id);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const defaultImage = user.image || null;

    await storeUserProfile(user.id, {
      id: user.id,
      email: user.email,
      name: userProfile.name || user.name || '',
      image: defaultImage || undefined,
    });

    return NextResponse.json({ success: true, defaultImage });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
