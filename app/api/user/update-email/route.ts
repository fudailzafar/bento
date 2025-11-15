import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { upstashRedis as redis } from '@/lib/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;

    // Check if user has credentials (credentials user)
    const hasCredentials = await redis.exists(`user:credentials:${userId}`);
    if (!hasCredentials) {
      return NextResponse.json(
        { error: 'Email updates are only available for credentials users' },
        { status: 403 }
      );
    }

    const { newEmail } = await request.json();

    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if new email already exists
    const existingUser = await redis.exists(`user:id:${newEmail}`);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Get old user data
    const oldUserData = await redis.get<{
      id: string;
      email: string;
      name?: string;
      image?: string;
      createdAt?: string;
      updatedAt?: string;
    }>(`user:id:${userId}`);
    const credentials = await redis.get(`user:credentials:${userId}`);
    const username = await redis.get(`user:name:${userId}`);

    // Create new user entries with new email
    await redis.set(`user:id:${newEmail}`, {
      id: newEmail,
      email: newEmail,
      name: oldUserData?.name || '',
      image: oldUserData?.image || '',
      createdAt: oldUserData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (credentials) {
      await redis.set(`user:credentials:${newEmail}`, credentials);
    }

    if (username) {
      await redis.set(`user:name:${newEmail}`, username);
      // Update username mapping to point to new email
      await redis.set(`user:name:${username}`, newEmail);
    }

    // Get resume data if exists
    const resumeData = await redis.get(`resume:${userId}`);
    if (resumeData) {
      await redis.set(`resume:${newEmail}`, resumeData);
      await redis.del(`resume:${userId}`);
    }

    // Delete old user entries
    await redis.del(`user:id:${userId}`);
    await redis.del(`user:credentials:${userId}`);
    await redis.del(`user:name:${userId}`);

    return NextResponse.json({ success: true, newEmail });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to Update My Email' },
      { status: 500 }
    );
  }
}
