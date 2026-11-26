import { NextResponse } from 'next/server';
import { fail, withUser } from '@/lib/server/api';
import { rateLimit } from '@/lib/server/rate-limit';
import { getLinkPreview } from '@/lib/server/link-preview';

// Link tile previews for the editor; signed-in users only.
export const GET = withUser(async (user, request) => {
  rateLimit('link-preview', user.id, { limit: 120, windowMs: 60000 });
  const preview = await getLinkPreview(
    request.nextUrl.searchParams.get('url') ?? ''
  );
  if (!preview) fail(400, 'Invalid URL');
  return NextResponse.json(preview, {
    headers: { 'cache-control': 'private, max-age=3600' },
  });
});
