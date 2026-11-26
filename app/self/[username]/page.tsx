import { notFound } from 'next/navigation';
import {
  PublicProfile,
  profileMetadata,
} from '@/app/[username]/public-profile';
import { SelfPortfolioLoader } from '@/components/preview';
import type { ProfileViewer } from '@/components/common';
import { getCurrentUser } from '@/lib/server/session';
import { getProfile } from '@/lib/server/profile';
import { getViewerCard } from '@/lib/server';

// /username for a signed-in visitor (the middleware rewrites to here): the
// owner gets the editor, anyone else the public page with their own details
// in the corner. It is rendered per request, so it is the only profile route
// that needs a session.
export const maxDuration = 40;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return profileMetadata((await params).username);
}

export default async function SelfOrPublicProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (!username) notFound();

  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getProfile(username),
  ]);

  if (user && profile.user_id === user.id) {
    return <SelfPortfolioLoader userId={user.id} />;
  }

  const viewer: ProfileViewer = user ? await getViewerCard(user.id) : null;
  return <PublicProfile username={username} viewer={viewer} />;
}
