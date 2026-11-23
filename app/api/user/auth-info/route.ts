import { prisma } from '@/lib/server/db';
import { withUser } from '@/lib/server/api';
import { NextResponse } from 'next/server';

export const GET = withUser(
  async (user) => {
    const account = await prisma.account.findFirst({
      where: { userId: user.id },
    });
    const provider =
      account?.providerId === 'credential' ? 'credentials' : 'google';

    return NextResponse.json({
      email: user.email,
      provider,
      name: user.name || null,
      image: user.image || null,
    });
  },
  { failure: 'Failed to get auth info', log: 'Error getting auth info:' }
);
