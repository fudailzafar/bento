import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { upstashRedis as redis } from '@/lib/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

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
      email: user.email,
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
