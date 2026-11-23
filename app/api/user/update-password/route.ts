import { auth } from '@/lib/server/auth';
import { fail, withUser } from '@/lib/server/api';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = withUser(
  async (_user, request) => {
    const { newPassword, currentPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      fail(400, 'Password must be at least 6 characters');
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
  },
  {
    // The auth library's own message tells the user what was wrong.
    failure: (error) =>
      (error as { message?: string })?.message || 'Failed to update password',
    log: 'Error updating password:',
  }
);
