import { getCurrentUser } from '@/lib/server/session';
import { prisma } from '@/lib/server/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await prisma.account.findFirst({
      where: { userId: user.id },
    });

    const provider = account?.providerId === 'credential' ? 'credentials' : 'google';

    return NextResponse.json({
      email: user.email,
      provider,
      name: user.name || null,
      image: user.image || null,
    });
  } catch (error) {
    console.error('Error getting auth info:', error);
    return NextResponse.json(
      { error: 'Failed to get auth info' },
      { status: 500 }
    );
  }
}
