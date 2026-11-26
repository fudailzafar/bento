import { prisma } from './db';

// Profile statistics. Visits and clicks are counted per day (UTC), one row per
// page and day, so a busy profile adds one row a day, not one per visit.

const TODAY = `(now() at time zone 'utc')::date`;

export async function recordView(pageId: string) {
  await prisma.$executeRawUnsafe(
    `INSERT INTO "PageViewDaily" ("pageId", "day", "count")
     VALUES ($1, ${TODAY}, 1)
     ON CONFLICT ("pageId", "day")
     DO UPDATE SET "count" = "PageViewDaily"."count" + 1`,
    pageId
  );
}

export async function recordClick(pageId: string, blockId: string) {
  await prisma.$executeRawUnsafe(
    `INSERT INTO "BlockClickDaily" ("pageId", "blockId", "day", "count")
     VALUES ($1, $2, ${TODAY}, 1)
     ON CONFLICT ("pageId", "blockId", "day")
     DO UPDATE SET "count" = "BlockClickDaily"."count" + 1`,
    pageId,
    blockId
  );
}

// What a visit to /username should be counted against: the page, its owner
// and, for a click, whether the block belongs to it.
export async function findTrackTarget(
  username: string,
  blockId?: string
): Promise<{ ownerId: string; pageId: string; blockId?: string } | null> {
  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true, page: { select: { id: true } } },
  });
  const pageId = owner?.page?.id;
  if (!owner || !pageId) return null;
  if (!blockId) return { ownerId: owner.id, pageId, blockId: undefined };
  const block = await prisma.block.findFirst({
    where: { id: blockId, pageId },
    select: { id: true },
  });
  return block ? { ownerId: owner.id, pageId, blockId: block.id } : null;
}

export interface Analytics {
  viewsYesterday: number;
  views: number;
  clicks: Record<string, number>;
}

export async function getAnalytics(userId: string): Promise<Analytics> {
  const page = await prisma.page.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!page) return { viewsYesterday: 0, views: 0, clicks: {} };

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const [total, last, clicks] = await Promise.all([
    prisma.pageViewDaily.aggregate({
      where: { pageId: page.id },
      _sum: { count: true },
    }),
    prisma.pageViewDaily.findUnique({
      where: { pageId_day: { pageId: page.id, day: yesterday } },
      select: { count: true },
    }),
    prisma.blockClickDaily.groupBy({
      by: ['blockId'],
      where: { pageId: page.id },
      _sum: { count: true },
    }),
  ]);

  return {
    viewsYesterday: last?.count ?? 0,
    views: total._sum.count ?? 0,
    clicks: Object.fromEntries(
      clicks.map((row) => [row.blockId, row._sum.count ?? 0])
    ),
  };
}

// Clicks kept for blocks that are no longer on the page.
export async function dropClicksOfRemovedBlocks(
  pageId: string,
  keepBlockIds: string[]
) {
  await prisma.blockClickDaily.deleteMany({
    where: { pageId, blockId: { notIn: keepBlockIds } },
  });
}
