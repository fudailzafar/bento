'use server';

import { getCurrentUser } from '@/lib/server/session';
import {
  createUsernameLookup,
  getPage,
  getUsernameById,
  savePage,
} from '@/lib/server';
import { redirect } from 'next/navigation';
import { MAX_USERNAME_LENGTH } from '@/lib';
import PreviewWrapper from './preview-wrapper';

async function InitializeAndPreview({ userId }: { userId: string }) {
  const user = await getCurrentUser();

  const page = await getPage(userId);

  // First visit — seed an empty page with no blocks, matching bento.me's onboarding
  if (!page) {
    await savePage(userId, { name: user?.name || undefined, blocks: [] }, 0);
  }

  // Set a username the first time only, for a brand-new user
  const foundUsername = await getUsernameById(userId);

  if (!foundUsername) {
    const saltLength = 6;
    const createSalt = () =>
      Math.random()
        .toString(36)
        .substring(2, 2 + saltLength);

    const baseName = user?.name || user?.email?.split('@')[0] || 'user';

    const username =
      (
        baseName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-') + '-'
      ).slice(0, MAX_USERNAME_LENGTH - saltLength) + createSalt();

    const creation = await createUsernameLookup({ userId, username });

    if (!creation) redirect('/?error=usernameCreationFailed');
  }

  return <PreviewWrapper />;
}

export default async function SelfPortfolioLoader({
  userId,
}: {
  userId: string;
}) {
  return <InitializeAndPreview userId={userId} />;
}
