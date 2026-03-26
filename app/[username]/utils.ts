import { getPage, getUserIdByUsername, getUserProfile } from '@/lib/server';
import { unstable_cache } from 'next/cache';

export async function getUserData(username: string) {
  const user_id = await getUserIdByUsername(username);
  if (!user_id)
    return { user_id: undefined, page: undefined, userData: undefined };

  const [page, userProfile] = await Promise.all([
    getPage(user_id),
    getUserProfile(user_id),
  ]);

  const getCachedUser = unstable_cache(
    async () => {
      return {
        id: user_id,
        email: user_id,
        name: userProfile?.name || page?.name,
        // Use custom uploaded image if available, fallback to Google profile image
        image: userProfile?.image,
      };
    },
    [user_id],
    {
      tags: ['users'],
      revalidate: 60, // 1 minute in seconds
    }
  );
  const userData = await getCachedUser();

  return { user_id, page, userData };
}
