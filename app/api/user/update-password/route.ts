import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { upstashRedis as redis } from '@/lib/server';
import bcrypt from 'bcryptjs';

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
        { error: 'Password updates are only available for credentials users' },
        { status: 403 }
      );
    }

    const { newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Get current credentials
    const credentials = await redis.get<{
      email: string;
      passwordHash: string;
      name?: string;
      createdAt: string;
      updatedAt: string;
    }>(`user:credentials:${userId}`);
    if (!credentials) {
      return NextResponse.json(
        { error: 'User credentials not found' },
        { status: 404 }
      );
    }

    // Hash and store new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await redis.set(`user:credentials:${userId}`, {
      ...credentials,
      passwordHash: hashedPassword,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
