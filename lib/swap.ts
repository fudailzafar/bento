// Dragging a widget over another of the same size swaps them, as on
// gumbee.dev, instead of pushing the other one down the page.

export interface Cell {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// How much of the other widget the dragged one must cover to swap with it.
const COVER = 0.5;

const overlap = (a: Cell, b: Cell) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

// The widget to swap with: one of the same size, at its place when the drag
// began, that the dragged widget now covers the most (at least half of it).
export function swapTarget(start: Cell[], dragged: Cell): Cell | undefined {
  let best: Cell | undefined;
  let bestCover = COVER * dragged.w * dragged.h;
  for (const cell of start) {
    if (cell.i === dragged.i || cell.w !== dragged.w || cell.h !== dragged.h) {
      continue;
    }
    const cover = overlap(dragged, cell);
    if (cover >= bestCover) {
      best = cell;
      bestCover = cover;
    }
  }
  return best;
}

// Puts the layout where the swap leaves it: the target takes the dragged
// widget's place, the dragged one takes the target's, and everything else is
// back where it started. The layout's own items are changed in place, as
// react-grid-layout expects of a drag callback.
export function applySwap(
  layout: Cell[],
  start: Cell[],
  draggedStart: Cell,
  target: Cell
) {
  const home = new Map(start.map((c) => [c.i, c]));
  for (const item of layout) {
    let to = home.get(item.i);
    if (item.i === draggedStart.i) to = target;
    else if (item.i === target.i) to = draggedStart;
    if (to) {
      item.x = to.x;
      item.y = to.y;
    }
  }
}

// Whether the dragged widget touches any other widget at its starting place.
export function touchesOthers(start: Cell[], dragged: Cell) {
  return start.some(
    (cell) => cell.i !== dragged.i && overlap(dragged, cell) > 0
  );
}

// Undoes a swap: every widget but the dragged one goes back to where it
// started. Changed in place, like applySwap.
export function restoreOthers(
  layout: Cell[],
  start: Cell[],
  draggedId: string
) {
  const home = new Map(start.map((c) => [c.i, c]));
  for (const item of layout) {
    const to = home.get(item.i);
    if (to && item.i !== draggedId) {
      item.x = to.x;
      item.y = to.y;
    }
  }
}
