import type { NextRequest } from 'next/server';
import type { z } from 'zod';
import { fail } from './api';

// Reads a JSON body no larger than `maxBytes` and checks it against `schema`.
// A body that is too big, not JSON or the wrong shape is a 400 (413 for size).
export async function readJson<T extends z.ZodTypeAny>(
  request: NextRequest,
  schema: T,
  maxBytes = 64 * 1024
): Promise<z.infer<T>> {
  const declared = Number(request.headers.get('content-length'));
  if (declared > maxBytes) fail(413, 'Request is too large');

  const text = await request.text();
  if (text.length > maxBytes) fail(413, 'Request is too large');

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    fail(400, 'Request must be JSON');
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    fail(400, result.error.issues[0]?.message ?? 'Invalid request');
  }
  return result.data;
}
