import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Supabase sets app_metadata.provider to 'email' for password signups,
    // or the OAuth provider name (e.g. 'google') otherwise.
    const provider = user.app_metadata?.provider === 'email' ? 'credentials' : 'google';

    return NextResponse.json({
      email: user.email,
      provider,
      name: user.user_metadata?.name || null,
      image: user.user_metadata?.avatar_url || null,
    });
  } catch (error) {
    console.error('Error getting auth info:', error);
    return NextResponse.json(
      { error: 'Failed to get auth info' },
      { status: 500 }
    );
  }
}
