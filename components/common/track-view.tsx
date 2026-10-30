'use client';

import { useEffect } from 'react';

function send(body: { username: string; blockId?: string }) {
  const payload = JSON.stringify(body);
  // sendBeacon survives the page unloading when a link opens.
  if (!navigator.sendBeacon?.('/api/track', payload)) {
    fetch('/api/track', { method: 'POST', body: payload, keepalive: true });
  }
}

// Counts a view of a public profile, and clicks on its link widgets.
export function TrackView({ username }: { username: string }) {
  useEffect(() => {
    send({ username });
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest('a[href]');
      const block = link?.closest<HTMLElement>('[data-block-id]');
      if (block?.dataset.blockId) {
        send({ username, blockId: block.dataset.blockId });
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [username]);

  return null;
}
