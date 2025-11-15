import { NextRequest, NextResponse } from 'next/server';
import { upstashRedis } from '@/lib/server/redis';
import bcrypt from 'bcryptjs';

export const maxDuration = 40;

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Get reset token data
    const resetData = await upstashRedis.get<{
      userId: string;
      email: string;
      expiresAt: number;
    }>(`password-reset:${token}`);

    if (!resetData) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (Date.now() > resetData.expiresAt) {
      await upstashRedis.del(`password-reset:${token}`);
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get current credentials
    const credentials = await upstashRedis.get<{
      email: string;
      passwordHash: string;
    }>(`user:credentials:${resetData.userId}`);

    if (!credentials) {
      return NextResponse.json(
        { error: 'Cannot reset password for this account' },
        { status: 400 }
      );
    }

    // Update password
    await upstashRedis.set(`user:credentials:${resetData.userId}`, {
      ...credentials,
      passwordHash,
    });

    // Delete used token
    await upstashRedis.del(`password-reset:${token}`);

    return NextResponse.json({
      message: 'Password successfully reset',
    });
  } catch (error) {
    console.error('Confirm reset error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
