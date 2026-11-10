import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server/session';
import { getLinkPreview } from '@/lib/server/link-preview';

// Link tile previews for the editor; signed-in users only.
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const preview = await getLinkPreview(
    request.nextUrl.searchParams.get('url') ?? ''
  );
  if (!preview) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  return NextResponse.json(preview, {
    headers: { 'cache-control': 'private, max-age=3600' },
  });
}
