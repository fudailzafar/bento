import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/server/api';
import { getLinkPreview } from '@/lib/server/link-preview';

// Link tile previews for the editor; signed-in users only.
export const GET = withUser(async (_user, request) => {
  const preview = await getLinkPreview(
    request.nextUrl.searchParams.get('url') ?? ''
  );
  if (!preview) fail(400, 'Invalid URL');
  return NextResponse.json(preview, {
    headers: { 'cache-control': 'private, max-age=3600' },
  });
});
