import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getUserData } from './utils';
import { PublicPortfolio } from '@/components/bento';
import { createClient } from '@/lib/supabase/server';
import { ProfileCta, TrackView, type ProfileViewer } from '@/components/common';
import { prisma } from '@/lib/server/db';
import { SelfPortfolioLoader } from '@/components/preview';
import { ClaimUsername } from '@/components/auth';
import { isReservedUsername, isValidUsername } from '@/lib/routes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const { user_id, page, userData } = await getUserData(username);
  const profilePicture = userData?.image;

  if (!user_id || !page) {
    return {
      title: 'Bento - A Portfolio, but Rich and Beautiful.',
      description:
        'Create a beautiful page to show your audience everything you are, create, and sell in one link. Designed in Berlin.',
    };
  }

  return {
    title: `${page.name ?? 'Bento'}`,
    description: page.headline ?? '',
    icons: {
      icon: profilePicture,
      shortcut: profilePicture,
    },
    openGraph: {
      title: `${page.name ?? 'Bento'}`,
      description: page.headline ?? '',
      images: [
        {
          url: `https://bento.me/${username}/og`,
          width: 1200,
          height: 630,
          alt: 'bento.me Profile',
        },
      ],
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { user_id, page, userData } = await getUserData(username);

  // Check if the logged-in user is viewing their own profile
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === user_id;

  // If user is viewing their own profile, show preview/edit mode with initialization
  if (isOwnProfile && user_id) {
    return <SelfPortfolioLoader userId={user_id} />;
  }

  // If profile is not found, render Claim Username UI
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

  // A signed-in visitor gets bento's "My Bento" link instead of the sign-up CTA.
  const viewerRow = user
    ? await prisma.user.findUnique({
        where: { id: user.id },
        select: { username: true, image: true },
      })
    : null;
  const viewer: ProfileViewer = viewerRow?.username
    ? { username: viewerRow.username, image: viewerRow.image }
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: page.name,
    image: profilePicture,
    jobTitle: page.headline,
    description: page.bio,
    email: page.email && `mailto:${page.email}`,
    url: `https://bento.me/${username}`,
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

export const maxDuration = 40;
