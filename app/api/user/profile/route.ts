import { storeUserProfile, getUserProfile } from '@/lib/server';
import { withUser } from '@/lib/server/api';
import { NextResponse } from 'next/server';

// GET endpoint to retrieve user profile
export const GET = withUser(
  async (user) => NextResponse.json({ profile: await getUserProfile(user.id) }),
  { log: 'Error retrieving user profile:' }
);

// POST endpoint to update user profile
export const POST = withUser(
  async (user, request) => {
    const body = await request.json().catch(() => ({}));

    await storeUserProfile(user.id, {
      id: user.id,
      email: user.email,
      name: body.name || user.name || undefined,
      image: body.image || user.image || undefined,
    });

    return NextResponse.json({ success: true });
  },
  { log: 'Error storing user profile:' }
);
