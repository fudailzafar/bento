import { createUsernameLookup, checkUsernameAvailability } from '@/lib/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username } = await req.json();

    if (!username || username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Check if username is available
    const { available } = await checkUsernameAvailability(username);
    if (!available) {
      return NextResponse.json(
        { error: 'Username is not available' },
        { status: 400 }
      );
    }

    // Create username lookup
    const userId = session.user.email;
    const success = await createUsernameLookup({ userId, username });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to claim username' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, username }, { status: 200 });
  } catch (error) {
    console.error('Claim username error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
