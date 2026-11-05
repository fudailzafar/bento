import { prisma } from '@/lib/server/db';
import { createUsernameLookup, getUsernameById } from '@/lib/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { MAX_USERNAME_LENGTH } from '@/lib';

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Email sign-ups have no session until the address is confirmed, so the
    // sync at sign-up could not create this row. Create it now.
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: user.email,
        name: user.user_metadata?.name || '',
        image:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      },
    });

    // Check if they already have one
    const foundUsername = await getUsernameById(userId);
    if (foundUsername) {
      return NextResponse.json(
        { success: true, username: foundUsername },
        { status: 200 }
      );
    }

    // The handle picked at sign-up is kept in the auth metadata; use it if free.
    const chosen = user.user_metadata?.username;
    if (typeof chosen === 'string' && chosen) {
      const claimed = await createUsernameLookup({ userId, username: chosen });
      if (claimed) {
        return NextResponse.json(
          { success: true, username: chosen },
          { status: 200 }
        );
      }
    }

    const saltLength = 6;
    const createSalt = () =>
      Math.random()
        .toString(36)
        .substring(2, 2 + saltLength);

    const baseName =
      user.user_metadata?.name || user.email.split('@')[0] || 'user';

    const generatedUsername =
      (
        baseName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') + '-'
      ).slice(0, MAX_USERNAME_LENGTH - saltLength) + createSalt();

    const creation = await createUsernameLookup({
      userId,
      username: generatedUsername,
    });

    if (!creation) {
      return NextResponse.json(
        { error: 'Failed to generate username' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, username: generatedUsername },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate username error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
