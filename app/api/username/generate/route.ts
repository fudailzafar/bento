import { createUsernameLookup, getUsernameById } from '@/lib/server';
import { fail, withUser } from '@/lib/server/api';
import { NextResponse } from 'next/server';
import { MAX_USERNAME_LENGTH } from '@/lib';

const SALT_LENGTH = 6;
const createSalt = () =>
  Math.random()
    .toString(36)
    .substring(2, 2 + SALT_LENGTH);

export const POST = withUser(
  async (user) => {
    const userId = user.id;

    // Check if they already have one
    const foundUsername = await getUsernameById(userId);
    if (foundUsername) {
      return NextResponse.json({ success: true, username: foundUsername });
    }

    // A desired username on the user object
    const chosen = user.username;
    if (typeof chosen === 'string' && chosen) {
      if (await createUsernameLookup({ userId, username: chosen })) {
        return NextResponse.json({ success: true, username: chosen });
      }
    }

    const baseName = user.name || user.email.split('@')[0] || 'user';
    const generatedUsername =
      (
        baseName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') + '-'
      ).slice(0, MAX_USERNAME_LENGTH - SALT_LENGTH) + createSalt();

    if (
      !(await createUsernameLookup({ userId, username: generatedUsername }))
    ) {
      fail(500, 'Failed to generate username');
    }

    return NextResponse.json({ success: true, username: generatedUsername });
  },
  { log: 'Generate username error:' }
);
