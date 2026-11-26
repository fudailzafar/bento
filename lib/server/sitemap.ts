import { prisma } from './db';

// Profiles are listed in sitemaps of this many URLs each (the limit is 50,000).
export const SITEMAP_CHUNK = 5000;

export async function countPublicProfiles(): Promise<number> {
  return prisma.user.count({ where: { username: { not: null } } });
}

export async function sitemapChunkCount(): Promise<number> {
  return Math.max(1, Math.ceil((await countPublicProfiles()) / SITEMAP_CHUNK));
}

// One chunk of profiles, in a stable order so chunks never overlap.
export async function listPublicProfiles(chunk: number) {
  const users = await prisma.user.findMany({
    where: { username: { not: null } },
    orderBy: { username: 'asc' },
    skip: chunk * SITEMAP_CHUNK,
    take: SITEMAP_CHUNK,
    select: { username: true, page: { select: { updatedAt: true } } },
  });
  return users.flatMap((user) =>
    user.username
      ? [
          {
            username: user.username,
            lastModified: user.page?.updatedAt ?? new Date(),
          },
        ]
      : []
  );
}
