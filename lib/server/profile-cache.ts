import { revalidateTag } from 'next/cache';

// Public profiles are cached by username. Anything that changes what a
// profile shows (its page, name, picture or username) clears that entry.

export const profileTag = (username: string) =>
  `profile:${username.toLowerCase()}`;

export function invalidateProfile(...usernames: (string | null | undefined)[]) {
  for (const username of usernames) {
    if (!username) continue;
    try {
      revalidateTag(profileTag(username));
    } catch {
      // Not in a request that can revalidate (a script, or a page render):
      // the entry simply expires on its own.
    }
  }
}
