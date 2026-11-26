import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { PublicPortfolio } from '@/components/bento';
import { ProfileCta, TrackView, type ProfileViewer } from '@/components/common';
import { ClaimUsername } from '@/components/auth';
import { isReservedUsername, isValidUsername } from '@/lib/routes';
import { getProfile } from '@/lib/server/profile';
import { SITE_URL } from '@/lib/site';

const DEFAULT_DESCRIPTION =
  'Create a beautiful page to show your audience everything you are, create, and sell in one link. Designed in Berlin.';

export async function profileMetadata(username: string): Promise<Metadata> {
  const { user_id, page, userData } = await getProfile(username);
  const profilePicture = userData?.image;

  if (!user_id || !page) {
    return {
      title: 'Bento - A Portfolio, but Rich and Beautiful.',
      description: DEFAULT_DESCRIPTION,
    };
  }

  return {
    title: `${page.name ?? 'Bento'}`,
    description: page.headline ?? '',
    icons: { icon: profilePicture, shortcut: profilePicture },
    openGraph: {
      title: `${page.name ?? 'Bento'}`,
      description: page.headline ?? '',
      images: [
        {
          url: `${SITE_URL}/${username}/og`,
          width: 1200,
          height: 630,
          alt: 'bento.me Profile',
        },
      ],
    },
  };
}

// What anyone sees at /username. It reads only the cached profile, so the
// page can be served without a database query or a session lookup; `viewer`
// is passed by the signed-in route only.
export async function PublicProfile({
  username,
  viewer = null,
}: {
  username: string;
  viewer?: ProfileViewer;
}) {
  const { user_id, page, userData } = await getProfile(username);

  if (!user_id) {
    return (
      <ClaimUsername
        username={username}
        unavailable={isReservedUsername(username) || !isValidUsername(username)}
      />
    );
  }

  if (!page) redirect(`/?idNotFound=${user_id}`);

  const profilePicture = userData?.image;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: page.name,
    image: profilePicture,
    jobTitle: page.headline,
    description: page.bio,
    email: page.email && `mailto:${page.email}`,
    url: `${SITE_URL}/${username}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPortfolio page={page} profilePicture={profilePicture} />
      <ProfileCta viewer={viewer} />
      <TrackView username={username} />
    </>
  );
}
