import { storeUserProfile, getUserProfile } from '@/lib/server';
import { getCurrentUser } from '@/lib/server/session';
import { NextResponse } from 'next/server';

// GET endpoint to retrieve user profile
export async function GET(): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserProfile(user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to update user profile
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    // Store/update user profile with data
    await storeUserProfile(user.id, {
      id: user.id,
      email: user.email,
      name: body.name || user.name || undefined,
      image: body.image || user.image || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
