import confetti from 'canvas-confetti';

// A burst from the middle of an element (or from its bottom edge).
export function burstFrom(
  element: HTMLElement,
  options: confetti.Options = {},
  edge: 'center' | 'bottom' = 'center'
) {
  const rect = element.getBoundingClientRect();
  return confetti({
    ...options,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y:
        (edge === 'bottom' ? rect.bottom : rect.top + rect.height / 2) /
        window.innerHeight,
    },
  });
}
