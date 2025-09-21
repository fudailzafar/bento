import { getResume } from '@/lib/server/redis-actions';
import { unstable_cache } from 'next/cache';

export const getCachedUser = async (userId: string) => {
  return unstable_cache(
    async () => {
      // With NextAuth, userId is now the email address
      // Return basic user info structure compatible with NextAuth
      return {
        id: userId,
        email: userId,
        // Additional user data would come from session or database
        // For now, return minimal user info
      };
    },
    [userId],
    {
      tags: ['users'],
      revalidate: 86400, // 1 day in seconds
    },
  )();
};

export const getCachedResume = async (userId: string) => {
  return unstable_cache(
    async () => {
      return await getResume(userId);
    },
    [userId],
    {
      tags: ['resumes'],
      revalidate: 86400, // 1 day in seconds
    },
  );
};
