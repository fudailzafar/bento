import { getPage, savePage } from '@/lib/server';
import { PageData } from '@/lib';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

import { z } from 'zod';

export type GetPageResponse = { page?: PageData } | { error: string };
export type PostPageResponse =
  | { success: true }
  | { error: string; details?: z.ZodError['errors'] };

export async function GET(): Promise<NextResponse<GetPageResponse>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const page = await getPage(user.id);
    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error retrieving page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<PostPageResponse>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await savePage(user.id, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error storing page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
