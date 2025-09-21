import { PRIVATE_ROUTES } from './lib/routes';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // If accessing a protected route without token → redirect to login
  if (PRIVATE_ROUTES.some((route) => pathname.startsWith(`/${route}`))) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/preview/:path*',
    '/pdf/:path*',
    '/upload/:path*',
    '/api/:path*',
  ],
};
