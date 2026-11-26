import {
  PRIVATE_ROUTES,
  isReservedUsername,
  isValidUsername,
} from './lib/routes';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Better-Auth uses `better-auth.session_token` cookie
  const sessionToken =
    req.cookies.get('better-auth.session_token')?.value ||
    req.cookies.get('__Secure-better-auth.session_token')?.value;

  // Allow access to auth APIs and public endpoints
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/check-username') ||
    pathname.startsWith('/api/track') ||
    pathname.startsWith('/api/rich-data') ||
    // Vercel Cron: no session, the route checks its own secret.
    pathname.startsWith('/api/cron')
  ) {
    return NextResponse.next();
  }

  // If accessing a protected route without session token -> redirect to login
  if (PRIVATE_ROUTES.some((route) => pathname.startsWith(`/${route}`))) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // /username: anyone without a session gets the cached public page. A
  // signed-in visitor is shown /self/username instead, rendered per request,
  // where the owner gets the editor. The address in the browser stays put.
  const [, segment, ...rest] = pathname.split('/');
  if (
    sessionToken &&
    segment &&
    rest.length === 0 &&
    isValidUsername(segment) &&
    !isReservedUsername(segment) &&
    !PRIVATE_ROUTES.includes(segment)
  ) {
    return NextResponse.rewrite(new URL(`/self/${segment}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/preview/:path*', '/api/:path*', '/:username'],
};
