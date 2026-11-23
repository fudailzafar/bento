import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/server/api';
import { getUserProfile, storeUserProfile } from '@/lib/server';

export const DELETE = withUser(
  async (user) => {
    const userProfile = await getUserProfile(user.id);
    if (!userProfile) fail(404, 'User profile not found');

    const defaultImage = user.image || null;

    await storeUserProfile(user.id, {
      id: user.id,
      email: user.email,
      name: userProfile.name || user.name || '',
      image: defaultImage || undefined,
    });

    return NextResponse.json({ success: true, defaultImage });
  },
  { failure: 'Failed to delete image', log: 'Error deleting profile image:' }
);
