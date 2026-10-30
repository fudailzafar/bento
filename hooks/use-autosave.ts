import { useCallback, useEffect, useRef } from 'react';

// Saves a value after the user pauses, but never lets a long burst of edits
// go unsaved for more than `maxWait`. Saves never overlap: while one is in
// flight the newest value waits and goes next. Whatever is unsaved is sent
// when the tab is hidden, closed or navigated away from.
export function useAutosave<T>({
  save,
  saveOnExit,
  wait = 1000,
  maxWait = 8000,
}: {
  save: (value: T) => Promise<unknown>;
  // A save that survives the page closing (fetch with keepalive).
  saveOnExit: (value: T) => void;
  wait?: number;
  maxWait?: number;
}) {
  const pending = useRef<{ value: T } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstChange = useRef<number | null>(null);
  const inFlight = useRef(false);
  const latest = useRef({ save, saveOnExit });
  latest.current = { save, saveOnExit };

  const run = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (inFlight.current || !pending.current) return;
    const { value } = pending.current;
    pending.current = null;
    firstChange.current = null;
    inFlight.current = true;
    let failed = false;
    try {
      await latest.current.save(value);
    } catch {
      // Keep it for the next attempt unless something newer came in.
      failed = true;
      pending.current ??= { value };
    } finally {
      inFlight.current = false;
      if (pending.current && !timer.current) {
        if (failed) timer.current = setTimeout(() => void run(), 5000);
        // Edits arrived during the save: send them next.
        else void run();
      }
    }
  }, []);

  const schedule = useCallback(
    (value: T) => {
      pending.current = { value };
      const now = Date.now();
      firstChange.current ??= now;
      const untilMax = firstChange.current + maxWait - now;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => void run(),
        Math.max(0, Math.min(wait, untilMax))
      );
    },
    [run, wait, maxWait]
  );

  useEffect(() => {
    const flush = () => {
      if (!pending.current) return;
      // The page may be going away: use the save that outlives it.
      latest.current.saveOnExit(pending.current.value);
      pending.current = null;
      firstChange.current = null;
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
    const onHide = () => {
      if (document.visibilityState === 'hidden') void run();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onHide);
      // Leaving the editor inside the app.
      flush();
    };
  }, [run]);

  return schedule;
}
