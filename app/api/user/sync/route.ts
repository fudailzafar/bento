import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/db';
import { getCurrentUser } from '@/lib/server/session';
import { createUsernameLookup } from '@/lib/server';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username } = await req.json();

    if (username) {
      await createUsernameLookup({ userId: user.id, username });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
