import { NextResponse } from 'next/server';
import { withUser } from '@/lib/server/api';
import { getAuthInfo } from '@/lib/server/accounts';

export const GET = withUser(
  async (user) => {
    const { provider } = await getAuthInfo(user.id);
    return NextResponse.json({
      email: user.email,
      provider,
      name: user.name || null,
      image: user.image || null,
    });
  },
  { failure: 'Failed to get auth info', log: 'Error getting auth info:' }
);
