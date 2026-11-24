import { useEffect, useRef, useState } from 'react';

// Measures whether a line of text is wider than the room it has, for a text
// that scrolls when it is. `outer` is the room, `inner` one copy of the text.
// Scrolling starts `delay` ms after the text is found too wide, and stops if
// it fits again (a wider screen, a shorter text).
export function useMarquee(delay = 3000) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const room = outer.current;
    const text = inner.current;
    if (!room || !text) return;
    const measure = () => {
      setDistance(text.offsetWidth);
      setOverflowing(text.offsetWidth > room.clientWidth + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(room);
    observer.observe(text);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!overflowing) return;
    const timeout = setTimeout(() => setMoving(true), delay);
    return () => {
      clearTimeout(timeout);
      setMoving(false);
    };
  }, [overflowing, delay]);

  return { outer, inner, overflowing, moving, distance };
}
