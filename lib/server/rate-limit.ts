import type { NextRequest } from 'next/server';
import { fail } from './api';

// A fixed-window limit per caller and route. The counts live in this server
// instance's memory: each instance enforces the limit on its own, which stops
// a single client hammering one route but is not a global quota. Swap
// `consume` for a shared store (Redis, Upstash) to make it global; callers
// stay the same.

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
const MAX_TRACKED = 10_000;

function consume(key: string, limit: number, windowMs: number, now: number) {
  if (windows.size > MAX_TRACKED) {
    for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
    // Still full of live windows: start over rather than grow without bound.
    if (windows.size > MAX_TRACKED) windows.clear();
  }
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count++;
  return {
    allowed: current.count <= limit,
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0];
  return (forwarded ?? request.headers.get('x-real-ip') ?? 'unknown').trim();
}

// Throws a 429 when `who` has used `limit` calls of `name` in `windowMs`.
export function rateLimit(
  name: string,
  who: string,
  { limit, windowMs }: { limit: number; windowMs: number }
) {
  const { allowed, retryAfter } = consume(
    `${name}:${who}`,
    limit,
    windowMs,
    Date.now()
  );
  if (!allowed) {
    fail(429, `Too many requests. Try again in ${retryAfter} seconds.`);
  }
}

export function resetRateLimits() {
  windows.clear();
}
