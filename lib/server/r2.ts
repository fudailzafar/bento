import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { storageEnv } from './env';

// The client and bucket are made on first use, so a build or a page that
// never touches storage does not need its settings.
let client: S3Client | undefined;
function storage() {
  const env = storageEnv();
  client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
  return { client, bucket: env.R2_BUCKET_NAME };
}

const publicUrlFor = (key: string) =>
  `${storageEnv().NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;

export async function uploadToR2({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer | Uint8Array | Blob;
  contentType: string;
}) {
  const { client, bucket } = storage();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body as Buffer | Uint8Array,
      ContentType: contentType,
    })
  );
  return publicUrlFor(key);
}

export async function getR2PresignedUploadUrl({
  key,
  contentType,
  contentLength,
  expiresIn = 600,
}: {
  key: string;
  contentType: string;
  // Signed into the URL: an upload of any other size is refused by R2.
  contentLength: number;
  expiresIn?: number;
}) {
  const { client, bucket } = storage();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn,
    // Keep the type and length in the signature.
    signableHeaders: new Set(['content-type', 'content-length']),
  });
  return { uploadUrl, publicUrl: publicUrlFor(key) };
}

// Every object under `prefix`, with when it was last written.
export async function listR2Objects(prefix: string) {
  const objects: { key: string; modified: Date }[] = [];
  let token: string | undefined;
  const { client, bucket } = storage();
  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: token,
      })
    );
    for (const { Key, LastModified } of page.Contents ?? []) {
      if (Key && LastModified)
        objects.push({ key: Key, modified: LastModified });
    }
    token = page.NextContinuationToken;
  } while (token);
  return objects;
}

export async function deleteManyFromR2(keys: string[]) {
  // One request deletes up to 1000 objects.
  const { client, bucket } = storage();
  for (let i = 0; i < keys.length; i += 1000) {
    await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: keys.slice(i, i + 1000).map((Key) => ({ Key })),
          Quiet: true,
        },
      })
    );
  }
}
