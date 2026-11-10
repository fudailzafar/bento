import { PRIVATE_ROUTES } from './lib';
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
    pathname.startsWith('/api/rich-data')
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

  return NextResponse.next();
}

export const config = {
  matcher: ['/preview/:path*', '/api/:path*'],
};
