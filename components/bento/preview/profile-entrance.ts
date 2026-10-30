import { useEffect, useRef } from 'react';
import { DESKTOP_MIN_WIDTH } from '@/lib/layout';

// bento's profile entrance, on the public page and in the editor alike: the
// profile column fades in over a second; on desktop it also rises 40px and
// the avatar straightens from -8°. Put `column` on the profile block (starting
// at opacity 0) and `avatar` on the picture.
export function useProfileEntrance() {
  const column = useRef<HTMLDivElement>(null);
  const avatar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = column.current;
    if (!el) return;
    const desktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    if (desktop) el.style.transform = 'translate(0, 40px)';
    if (avatar.current) {
      avatar.current.style.transform = desktop
        ? 'rotateZ(-8deg)'
        : 'rotateZ(0deg)';
    }
    const timeout = setTimeout(() => {
      el.style.transition =
        'opacity 1s cubic-bezier(0.42, 0, 0.25, 1), transform 1s cubic-bezier(0.2, 1.18, 0.47, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translate(0, 0px)';
      if (avatar.current) {
        avatar.current.style.transition =
          'transform 1s cubic-bezier(0.2, 1.18, 0.47, 1)';
        avatar.current.style.transform = 'rotateZ(0deg)';
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return { column, avatar };
}
