'use client';

import { useState, type ComponentProps } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PublicPortfolio } from '@/components/bento';
import type { PageData } from '@/lib';
import type { RichData } from '@/lib/rich-data';

// The page's smart widgets (GitHub, YouTube, Spotify) show the data they had
// when bento archived it, not today's: the query cache is filled before the
// grid draws, so nothing is fetched.
export function ChangelogPage({
  page,
  picture,
  rich,
  frames,
}: {
  page: PageData;
  picture?: string;
  rich: Record<string, RichData>;
  frames: ComponentProps<typeof PublicPortfolio>['frames'];
}) {
  const queryClient = useQueryClient();
  useState(() => {
    for (const [url, data] of Object.entries(rich)) {
      queryClient.setQueryData(['rich-data', url], data);
    }
  });
  return (
    <PublicPortfolio page={page} profilePicture={picture} frames={frames} />
  );
}
