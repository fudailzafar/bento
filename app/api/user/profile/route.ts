import { createClient } from '@/lib/supabase/server';
import { storeUserProfile, getUserProfile } from '@/lib/server';
import { NextResponse } from 'next/server';

// GET endpoint to retrieve user profile
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserProfile(user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to update user profile
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Store/update user profile with data from session
    await storeUserProfile(user.id, {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || undefined,
      image: user.user_metadata?.avatar_url || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
