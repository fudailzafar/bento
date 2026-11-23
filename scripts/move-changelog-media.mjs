// Moves the changelog's pictures and videos from public/changelog to R2, so
// they are served from R2 (free egress) instead of the site's own bandwidth.
//
//   node --env-file=.env.local scripts/move-changelog-media.mjs          (plan)
//   node --env-file=.env.local scripts/move-changelog-media.mjs --apply  (do it)
//
// With --apply it uploads every file to R2 under changelog/, then points the
// changelog account's blocks and avatar at the new addresses (bumping the
// page's version, so an editor left open reloads instead of saving old
// addresses back), and rewrites scripts/changelog-seed.json the same way.
// Safe to run again: files that are already uploaded are skipped, and
// addresses that are already moved are left alone.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const apply = process.argv.includes('--apply');
const dir = new URL('../public/changelog', import.meta.url).pathname;
const seedPath = new URL('./changelog-seed.json', import.meta.url).pathname;

const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '').replace(/\/$/, '');
const bucket = process.env.R2_BUCKET_NAME || 'bento-me';
for (const name of [
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'NEXT_PUBLIC_R2_PUBLIC_URL',
  'DATABASE_URL',
]) {
  if (!process.env[name]) {
    console.error(`${name} is missing: run with --env-file=.env.local`);
    process.exit(1);
  }
}

const TYPES = {
  '.mp4': 'video/mp4',
  '.gif': 'image/gif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

const files = readdirSync(dir).filter((f) => TYPES[extname(f).toLowerCase()]);
const bytes = files.reduce((n, f) => n + readFileSync(join(dir, f)).length, 0);
console.log(
  `${files.length} files, ${(bytes / 1e6).toFixed(1)} MB -> ${base}/changelog/`
);
if (!apply) {
  console.log('Plan only. Run with --apply to upload and update the page.');
  process.exit(0);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// 1. Upload. File names are content hashes, so they never change: cache them
// for a year.
let uploaded = 0;
let skipped = 0;
for (const file of files) {
  const Key = `changelog/${file}`;
  const body = readFileSync(join(dir, file));
  const exists = await s3
    .send(new HeadObjectCommand({ Bucket: bucket, Key }))
    .then((head) => head.ContentLength === body.length)
    .catch(() => false);
  if (exists) {
    skipped++;
    continue;
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key,
      Body: body,
      ContentType: TYPES[extname(file).toLowerCase()],
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  uploaded++;
}
console.log(`Uploaded ${uploaded}, already there ${skipped}.`);

// 2. Point things at R2: any string "/changelog/<name>" becomes the R2 address.
let changed = 0;
const move = (value) => {
  if (typeof value === 'string') {
    if (/^\/changelog\/[\w.-]+$/.test(value)) {
      changed++;
      return `${base}${value}`;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(move);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, move(v)]));
  }
  return value;
};

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
try {
  const user = await prisma.user.findUnique({
    where: { username: 'changelog' },
    include: { page: { include: { blocks: true } } },
  });
  if (!user?.page) {
    console.log('No changelog account found: only the seed file is updated.');
  } else {
    const before = changed;
    await prisma.$transaction([
      ...user.page.blocks.flatMap((block) => {
        const data = move(block.data);
        return JSON.stringify(data) === JSON.stringify(block.data)
          ? []
          : [prisma.block.update({ where: { id: block.id }, data: { data } })];
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { image: move(user.image) },
      }),
      prisma.page.update({
        where: { id: user.page.id },
        data: { version: { increment: 1 } },
      }),
    ]);
    console.log(`Database: ${changed - before} addresses updated.`);
  }
} finally {
  await prisma.$disconnect();
}

// 3. The seed file, so --reseed does not point back at the site's own files.
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const before = changed;
writeFileSync(seedPath, JSON.stringify(move(seed), null, 1) + '\n');
console.log(`Seed file: ${changed - before} addresses updated.`);
