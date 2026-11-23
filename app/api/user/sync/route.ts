import { NextResponse } from 'next/server';
import { withUser } from '@/lib/server/api';
import { createUsernameLookup } from '@/lib/server';

export const POST = withUser(
  async (user, request) => {
    const { username } = await request.json();
    if (username) await createUsernameLookup({ userId: user.id, username });
    return NextResponse.json({ success: true });
  },
  { failure: 'Internal error', log: 'Sync error:' }
);
