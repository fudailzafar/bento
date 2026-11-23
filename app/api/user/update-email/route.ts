import { prisma } from '@/lib/server/db';
import { fail, withUser } from '@/lib/server/api';
import { NextResponse } from 'next/server';

export const POST = withUser(
  async (user, request) => {
    const { newEmail } = await request.json();

    if (!newEmail || !newEmail.includes('@')) {
      fail(400, 'Invalid email address');
    }

    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (existing) fail(400, 'Email already in use');

    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    return NextResponse.json({
      success: true,
      newEmail,
      pendingConfirmation: false,
    });
  },
  { failure: 'Failed to update email', log: 'Error updating email:' }
);
