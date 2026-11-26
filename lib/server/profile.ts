import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getPage, getUserIdByUsername, getUserProfile } from './db-actions';
import { profileTag } from './profile-cache';

// How long a cached profile may be served without a save clearing it.
const PROFILE_TTL_SECONDS = 300;

async function loadProfile(username: string) {
  const user_id = await getUserIdByUsername(username);
  if (!user_id) {
    return { user_id: undefined, page: undefined, userData: undefined };
  }
  const [page, profile] = await Promise.all([
    getPage(user_id),
    getUserProfile(user_id),
  ]);
  return {
    user_id,
    page,
    userData: {
      id: user_id,
      name: profile?.name || page?.name,
      // The uploaded picture, else the sign-in provider's.
      image: profile?.image,
    },
  };
}

// A profile by username, read from the data cache and, within one request,
// only once (the page and its metadata share it).
export const getProfile = cache((username: string) =>
  unstable_cache(() => loadProfile(username), ['profile', username], {
    tags: [profileTag(username)],
    revalidate: PROFILE_TTL_SECONDS,
  })()
);
