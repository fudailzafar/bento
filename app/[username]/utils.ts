import { getResume, getUserIdByUsername, getUserProfile } from '@/lib/server';
import { unstable_cache } from 'next/cache';

export async function getUserData(username: string) {
  const user_id = await getUserIdByUsername(username);
  if (!user_id)
    return { user_id: undefined, resume: undefined, userData: undefined };

  const [resume, userProfile] = await Promise.all([
    getResume(user_id),
    getUserProfile(user_id),
  ]);

  if (!resume?.resumeData || resume.status !== 'live') {
    return { user_id, resume: undefined, userData: userProfile };
  }

  // Create cached user data combining profile and resume info
  const getCachedUser = unstable_cache(
    async () => {
      return {
        id: user_id,
        email: user_id,
        name: userProfile?.name || resume?.resumeData?.header?.name,
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

  return { user_id, resume, userData };
}
