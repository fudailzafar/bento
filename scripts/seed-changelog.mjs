// Creates the "changelog" account and its page, so /changelog can be edited in
// the normal editor: sign in as that account and edit the page like any profile.
//
//   CHANGELOG_PASSWORD='choose-a-password' \
//     node --env-file=.env.local scripts/seed-changelog.mjs
//
// Optional: CHANGELOG_EMAIL (default changelog@example.com, a dummy address
// that receives no mail; "forgot password" will not reach anyone). Add --dry to
// check the seed without touching the database. If the account already
// exists the script stops, so it can never overwrite edits; --reseed replaces
// the page's blocks with the seed again.
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'better-auth/crypto';

const USERNAME = 'changelog';
const args = new Set(process.argv.slice(2));
const dry = args.has('--dry');
const reseed = args.has('--reseed');
const email = process.env.CHANGELOG_EMAIL ?? 'changelog@example.com';
const password = process.env.CHANGELOG_PASSWORD;

const seed = JSON.parse(
  readFileSync(new URL('./changelog-seed.json', import.meta.url), 'utf8')
);
const { page, picture } = seed;
console.log(
  `Seed: ${page.blocks.length} blocks, page "${page.name}", picture ${picture}`
);
if (dry) {
  console.log('Dry run: nothing written.');
  process.exit(0);
}

if (!reseed && (!password || password.length < 8)) {
  console.error('Set CHANGELOG_PASSWORD (at least 8 characters).');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing: run with --env-file=.env.local');
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const blockRows = (pageId) =>
  page.blocks.map((b) => ({
    id: b.id,
    pageId,
    type: b.type,
    x: b.x,
    y: b.y,
    w: b.w,
    h: b.h,
    mx: b.mx ?? null,
    my: b.my ?? null,
    mw: b.mw ?? null,
    mh: b.mh ?? null,
    data: b.data,
  }));

try {
  const existing = await prisma.user.findUnique({
    where: { username: USERNAME },
    include: { page: true },
  });

  if (existing) {
    if (!reseed) {
      console.error(
        `The "${USERNAME}" account already exists. Nothing changed. ` +
          'Use --reseed to replace its blocks with the seed (this discards edits).'
      );
      process.exit(1);
    }
    const pageId =
      existing.page?.id ??
      (
        await prisma.page.create({
          data: { userId: existing.id, name: page.name, headline: page.headline },
        })
      ).id;
    await prisma.$transaction([
      prisma.block.deleteMany({ where: { pageId } }),
      prisma.block.createMany({ data: blockRows(pageId) }),
      prisma.page.update({
        where: { id: pageId },
        data: {
          name: page.name,
          headline: page.headline,
          version: { increment: 1 },
        },
      }),
    ]);
    console.log('Reseeded the existing page.');
  } else {
    const userId = randomUUID();
    const hash = await hashPassword(password);
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          name: page.name,
          email,
          emailVerified: true,
          username: USERNAME,
          image: picture,
        },
      });
      await tx.account.create({
        data: {
          id: randomUUID(),
          accountId: userId,
          providerId: 'credential',
          userId,
          password: hash,
        },
      });
      const created = await tx.page.create({
        data: {
          userId,
          name: page.name,
          headline: page.headline,
          version: 1,
        },
      });
      await tx.block.createMany({ data: blockRows(created.id) });
    });
    console.log(`Created "${USERNAME}" (${email}) with ${page.blocks.length} blocks.`);
  }
} finally {
  await prisma.$disconnect();
}
