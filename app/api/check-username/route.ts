import { NextResponse } from 'next/server';
import { checkUsernameAvailability } from '@/lib/server';
import { fail, publicApi } from '@/lib/server/api';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';

// API Response Types
export type GetResponse = { available: boolean } | { error: string };

// Whether a username is free. Answers GET and POST alike, and is open to
// anyone (the sign-up form asks before an account exists), so it is limited
// per caller.
const check = publicApi(
  async (request) => {
    rateLimit('check-username', clientIp(request), {
      limit: 30,
      windowMs: 60_000,
    });
    const username = request.nextUrl.searchParams.get('username');
    if (!username) fail(400, 'Username parameter is required');
    const { available } = await checkUsernameAvailability(username);
    return NextResponse.json({ available });
  },
  { log: 'Error checking username availability:' }
);

export const GET = check;
export const POST = check;
