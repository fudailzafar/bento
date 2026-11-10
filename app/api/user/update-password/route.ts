import { getCurrentUser } from '@/lib/server/session';
import { auth } from '@/lib/server/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPassword, currentPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await auth.api.changePassword({
      headers: await headers(),
      body: {
        newPassword,
        currentPassword: currentPassword || '',
        revokeOtherSessions: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
