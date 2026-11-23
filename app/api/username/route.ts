import { getUsernameById, updateUsername } from '@/lib/server';
import { fail, withUser } from '@/lib/server/api';
import { NextResponse } from 'next/server';

// API Response Types
export type GetResponse = { username?: string | null } | { error: string };
export type PostResponse = { success: true } | { error: string };

// GET endpoint to retrieve username
export const GET = withUser(
  async (user) =>
    NextResponse.json({ username: await getUsernameById(user.id) }),
  { log: 'Error retrieving username:' }
);

// POST endpoint to update username
export const POST = withUser(
  async (user, request) => {
    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      fail(400, 'Username is required');
    }
    if (!(await updateUsername(user.id, username))) {
      fail(400, 'Username already taken');
    }

    return NextResponse.json({ success: true });
  },
  { log: 'Error updating username:' }
);
