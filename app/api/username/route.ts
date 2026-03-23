import { prisma } from '@/lib/server/db';
import { getUsernameById, updateUsername } from '@/lib/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// API Response Types
export type GetResponse = { username?: string | null } | { error: string };
export type PostResponse = { success: true } | { error: string };

// GET endpoint to retrieve username
export async function GET(): Promise<NextResponse<GetResponse>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const username = await getUsernameById(user.id);
    return NextResponse.json({ username });
  } catch (error) {
    console.error('Error retrieving username:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to update username
export async function POST(
  request: Request
): Promise<NextResponse<PostResponse>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Ensure the Prisma User record exists before updating the username
    // Since Supabase handles auth, we need to sync the user to our public.User table
    await prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        image: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      },
      update: {}, // Do nothing if it already exists, updateUsername handles the username
    });

    const success = await updateUsername(user.id, username);

    if (!success) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating username:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
