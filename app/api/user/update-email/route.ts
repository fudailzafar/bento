import { getCurrentUser } from '@/lib/server/session';
import { prisma } from '@/lib/server/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newEmail } = await request.json();

    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already in use
    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    });

    return NextResponse.json({
      success: true,
      newEmail,
      pendingConfirmation: false,
    });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
