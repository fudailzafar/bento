import { useQuery } from '@tanstack/react-query';
import type { AnalyticsResponse } from '@/app/api/analytics/route';

// The signed-in user's profile stats, shared by the editor's footer counter
// and the per-widget click badges.
export function useAnalytics(enabled = true) {
  return useQuery({
    queryKey: ['analytics'],
    enabled,
    staleTime: 60_000,
    queryFn: async (): Promise<AnalyticsResponse> => {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to load analytics');
      return response.json();
    },
  });
}
