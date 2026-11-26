import { NextResponse } from 'next/server';
import { withUser } from '@/lib/server/api';
import { getAnalytics, type Analytics } from '@/lib/server/analytics';

export type AnalyticsResponse = Analytics;

// The signed-in user's profile stats: yesterday's views (bento's footer
// counter), all-time views, and link clicks per block.
export const GET = withUser(async (user) =>
  NextResponse.json<AnalyticsResponse>(await getAnalytics(user.id))
);
