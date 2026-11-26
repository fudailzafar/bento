import { PublicProfile, profileMetadata } from './public-profile';

// Profiles are served from the cache: this route reads no cookies, so the
// first visit builds the page and later ones reuse it until a save clears it
// (or five minutes pass). A signed-in visitor is sent to /self/[username] by
// the middleware, which is where who they are gets looked at.
export const revalidate = 300;
export const maxDuration = 40;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return profileMetadata((await params).username);
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return <PublicProfile username={(await params).username} />;
}
