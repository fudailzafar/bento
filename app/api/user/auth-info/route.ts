import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { upstashRedis as redis } from '@/lib/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;

    // Get user profile data
    const userProfile = await redis.get<{
      id: string;
      email: string;
      name?: string;
      image?: string;
    }>(`user:id:${userId}`);

    // Check if user has credentials stored (credentials user)
    const hasCredentials = await redis.exists(`user:credentials:${userId}`);

    return NextResponse.json({
      email: session.user.email,
      provider: hasCredentials ? 'credentials' : 'google',
      name: userProfile?.name || null,
      image: userProfile?.image || null,
    });
  } catch (error) {
    console.error('Error getting auth info:', error);
    return NextResponse.json(
      { error: 'Failed to get auth info' },
      { status: 500 }
    );
  }
}
