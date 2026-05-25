import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && session?.user) {
      const user = session.user;
      
      // Sync the user with Prisma
      const { prisma } = await import('@/lib/server/db');
      await prisma.user.upsert({
        where: { id: user.id },
        update: { email: user.email },
        create: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.full_name || '',
        },
      });

      const username = searchParams.get('username');
      if (username) {
        const { createUsernameLookup } = await import('@/lib/server');
        await createUsernameLookup({ userId: user.id, username });
      }

      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=OAuthSignin`);
}
