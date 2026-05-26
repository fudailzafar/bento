import { createUsernameLookup, getUsernameById, getResume, storeResume } from '@/lib/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { MAX_USERNAME_LENGTH } from '@/lib';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Check if they already have one
    const foundUsername = await getUsernameById(userId);
    if (foundUsername) {
      return NextResponse.json({ success: true, username: foundUsername }, { status: 200 });
    }

    const saltLength = 6;
    const createSalt = () => Math.random().toString(36).substring(2, 2 + saltLength);

    const updatedResume = await getResume(userId);
    
    // If no resume data exists at all, initialize default structure for name extraction
    const defaultName = user.user_metadata?.name || user.email.split('@')[0] || 'user';
    
    const baseName = updatedResume?.resumeData?.header?.name || defaultName;

    const generatedUsername =
      (
        baseName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') + '-'
      ).slice(0, MAX_USERNAME_LENGTH - saltLength) + createSalt();

    const creation = await createUsernameLookup({
      userId,
      username: generatedUsername,
    });

    if (!creation) {
      return NextResponse.json({ error: 'Failed to generate username' }, { status: 500 });
    }

    return NextResponse.json({ success: true, username: generatedUsername }, { status: 200 });
  } catch (error) {
    console.error('Generate username error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
