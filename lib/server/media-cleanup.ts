import { prisma } from '@/lib/server/db';
import { deleteManyFromR2, listR2Objects } from '@/lib/server/r2';

// Where uploads land: block pictures and videos, and profile pictures.
const PREFIXES = ['block-images/', 'profile-images/'];
// An upload this young may not be saved onto a page yet, and an edit this
// young can still be undone, so it is never touched.
const GRACE_MS = 24 * 60 * 60 * 1000;
const KEY = /(?:block|profile)-images\/[\w.-]+/g;

// The keys of every upload a block or a profile still points at. Blocks are
// scanned as text, so a new widget type needs no change here.
async function referencedKeys() {
  const [blocks, users] = await Promise.all([
    prisma.$queryRaw<
      { data: string }[]
    >`SELECT data::text AS data FROM "Block"`,
    prisma.user.findMany({ select: { image: true } }),
  ]);
  const text = [...blocks.map((b) => b.data), ...users.map((u) => u.image)];
  return new Set(text.flatMap((value) => value?.match(KEY) ?? []));
}

// Deletes uploads nothing points at any more: removed or replaced widgets,
// and uploads that were never saved. `dry` only reports them.
export async function cleanupOrphanedMedia({ dry = false } = {}) {
  const referenced = await referencedKeys();
  const cutoff = Date.now() - GRACE_MS;
  const stored = (
    await Promise.all(PREFIXES.map((prefix) => listR2Objects(prefix)))
  ).flat();
  const orphans = stored
    .filter(
      ({ key, modified }) => modified.getTime() < cutoff && !referenced.has(key)
    )
    .map(({ key }) => key);

  if (!dry) await deleteManyFromR2(orphans);
  return {
    stored: stored.length,
    orphans: orphans.length,
    deleted: dry ? 0 : orphans.length,
    keys: dry ? orphans : undefined,
  };
}
