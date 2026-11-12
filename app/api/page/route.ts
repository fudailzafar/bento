import { getEditablePage, savePage, PageConflictError } from '@/lib/server';
import { PageData, SavePageSchema } from '@/lib';
import { getCurrentUser } from '@/lib/server/session';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export type GetPageResponse =
  { page?: PageData; version: number } | { error: string };
export type PostPageResponse =
  | { success: true; version: number }
  | { error: string; details?: z.ZodError['errors'] };

export async function GET(): Promise<NextResponse<GetPageResponse>> {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(await getEditablePage(user.id));
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
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { page, version } = SavePageSchema.parse(await request.json());
    return NextResponse.json({
      success: true,
      version: await savePage(user.id, page, version),
    });
  } catch (error) {
    if (error instanceof PageConflictError) {
      return NextResponse.json({ error: 'conflict' }, { status: 409 });
    }
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
