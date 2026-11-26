import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import type { AnalyticsResponse } from '@/app/api/analytics/route';

// The signed-in user's profile stats, shared by the editor's footer counter
// and the per-widget click badges.
export function useAnalytics(enabled = true) {
  return useQuery({
    queryKey: ['analytics'],
    enabled,
    staleTime: 60_000,
    queryFn: () =>
      apiFetch<AnalyticsResponse>(
        '/api/analytics',
        undefined,
        'Failed to load analytics'
      ),
  });
}
