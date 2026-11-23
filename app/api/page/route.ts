import { getEditablePage, savePage, PageConflictError } from '@/lib/server';
import { PageData, SavePageSchema } from '@/lib';
import { withUser } from '@/lib/server/api';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export type GetPageResponse =
  { page?: PageData; version: number } | { error: string };
export type PostPageResponse =
  | { success: true; version: number }
  | { error: string; details?: z.ZodError['errors'] };

export const GET = withUser(
  async (user) => NextResponse.json(await getEditablePage(user.id)),
  { log: 'Error retrieving page:' }
);

export const POST = withUser(
  async (user, request) => {
    const { page, version } = SavePageSchema.parse(await request.json());
    return NextResponse.json({
      success: true,
      version: await savePage(user.id, page, version),
    });
  },
  {
    log: 'Error storing page:',
    onError: (error) => {
      if (error instanceof PageConflictError) {
        return NextResponse.json({ error: 'conflict' }, { status: 409 });
      }
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid data format', details: error.errors },
          { status: 400 }
        );
      }
    },
  }
);
