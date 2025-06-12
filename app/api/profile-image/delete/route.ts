import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserProfile, storeUserProfile } from '@/lib/server';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const userProfile = await getUserProfile(session.user.email);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Reset to default Google image (if available) or null
    const defaultImage = session.user.image || null;

    await storeUserProfile(session.user.email, {
      id: session.user.email,
      email: session.user.email,
      name: userProfile.name || session.user.name || '',
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
