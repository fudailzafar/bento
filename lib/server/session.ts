import { auth } from '@/lib/server/auth';
import { headers } from 'next/headers';

export interface AuthSessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  username?: string | null;
}

export async function getCurrentUser(): Promise<AuthSessionUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    return session.user as unknown as AuthSessionUser;
  } catch (error) {
    console.error('Error fetching current session user:', error);
    return null;
  }
}

