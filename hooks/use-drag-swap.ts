import { useCallback, useRef } from 'react';
import type { ItemCallback } from 'react-grid-layout';
import {
  applySwap,
  restoreOthers,
  swapTarget,
  touchesOthers,
  type Cell,
} from '@/lib/swap';

// Drag callbacks for react-grid-layout that swap a dragged widget with one of
// the same size it is dragged over (see lib/swap.ts). Call them before the
// other drag callbacks: they change the layout the grid is about to keep.
export function useDragSwap() {
  // Where every widget was when the drag began.
  const start = useRef<Cell[]>([]);
  // A swap is in place, to be undone when the dragged widget moves clear.
  const swapped = useRef(false);

  const onDragStart: ItemCallback = useCallback((layout) => {
    start.current = layout.map(({ i, x, y, w, h }) => ({ i, x, y, w, h }));
    swapped.current = false;
  }, []);

  const onMove: ItemCallback = useCallback(
    (layout, oldItem, item, placeholder) => {
      const target = swapTarget(start.current, item);
      if (target) {
        applySwap(layout, start.current, oldItem, target);
        swapped.current = true;
        // The drop marker shows the place it will land in.
        if (placeholder) {
          placeholder.x = target.x;
          placeholder.y = target.y;
        }
        return;
      }
      // Moved back home, or into free space: the swapped widget goes back.
      // While it still touches another widget, the swap stays.
      if (swapped.current && !touchesOthers(start.current, item)) {
        restoreOthers(layout, start.current, item.i);
        swapped.current = false;
        if (placeholder) {
          placeholder.x = item.x;
          placeholder.y = item.y;
        }
      }
    },
    []
  );

  return { onDragStart, onDrag: onMove, onDragStop: onMove };
}
