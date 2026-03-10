import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, storeUserProfile } from '@/lib/server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
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

    // Reset to default Google image (if available) or null
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
