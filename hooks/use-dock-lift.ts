import { useEffect, useState } from 'react';

// On phones the page ends in a footer (marked data-page-footer). While the
// footer is on screen the dock rides up above it, instead of covering it, and
// it drops back once the footer scrolls away. Returns how far to lift it, in
// px; the caller animates the change.
export function useDockLift(enabled = true) {
  const [lift, setLift] = useState(0);

  useEffect(() => {
    if (!enabled) return setLift(0);
    const read = () => {
      const footer = document.querySelector<HTMLElement>('[data-page-footer]');
      const rect = footer?.getBoundingClientRect();
      // Hidden (desktop) footers have no height: nothing to clear.
      const reached =
        !!rect && rect.height > 0 && rect.top < window.innerHeight - 8;
      setLift(reached ? Math.round(rect.height) + 16 : 0);
    };
    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    // The footer can appear after the page has loaded.
    const observer = new MutationObserver(read);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      observer.disconnect();
    };
  }, [enabled]);

  return lift;
}
