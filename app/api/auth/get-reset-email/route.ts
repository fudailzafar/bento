import { NextRequest, NextResponse } from 'next/server';
import { upstashRedis } from '@/lib/server/redis';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Get reset token data from Redis
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
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Return the email associated with the token
    return NextResponse.json({ email: resetData.email });
  } catch (error) {
    console.error('Get reset email error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
