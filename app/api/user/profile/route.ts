import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { storeUserProfile, getUserProfile } from '@/lib/server';
import { NextResponse } from 'next/server';

// GET endpoint to retrieve user profile
export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserProfile(session.user.email);
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Store/update user profile with data from session
    await storeUserProfile(session.user.email, {
      id: session.user.email,
      email: session.user.email,
      name: session.user.name || undefined,
      image: session.user.image || undefined,
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
