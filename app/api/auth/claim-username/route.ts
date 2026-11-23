import { createUsernameLookup, checkUsernameAvailability } from '@/lib/server';
import { fail, withUser } from '@/lib/server/api';
import { NextResponse } from 'next/server';

export const POST = withUser(
  async (user, request) => {
    const { username } = await request.json();

    if (!username || username.length < 3) {
      fail(400, 'Username must be at least 3 characters');
    }

    const { available } = await checkUsernameAvailability(username);
    if (!available) fail(400, 'Username is not available');

    const success = await createUsernameLookup({ userId: user.id, username });
    if (!success) fail(500, 'Failed to claim username');

    return NextResponse.json({ success: true, username }, { status: 200 });
  },
  { log: 'Claim username error:' }
);
