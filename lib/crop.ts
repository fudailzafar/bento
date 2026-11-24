// How bento's crop answers a drag, measured from its own launch video: the
// picture follows the pointer until its edge reaches the frame, and past that
// the whole tile is pulled after the pointer, less and less the further it
// goes, and stretches a little along the pull.

// How far the tile moves, in px, for a pointer this far past the limit: about
// 1.5px at 15, 4px at 165 and 5px at 335.
export function pullOf(past: number) {
  return Math.sign(past) * 0.5 * Math.abs(past) ** 0.4;
}

// One axis of a crop drag. `start` is where the picture sat (0 to 1), `spare`
// how many px of it the frame hides, `moved` how far the pointer went. An axis
// with nothing hidden stays still.
export function dragAxis(start: number, spare: number, moved: number) {
  if (spare <= 0) return { pos: start, pull: 0 };
  // Dragging the picture right shows more of its left side.
  const wanted = start * spare - moved;
  const offset = Math.min(spare, Math.max(0, wanted));
  return { pos: offset / spare, pull: pullOf(offset - wanted) };
}

// Growth along the pull and loss across it, in px for each px pulled.
const STRETCH = 0.6;
const SQUASH = 0.3;

// The tile's transform for a pull. As in the video, a sideways pull lowers the
// tile's top edge and leaves its bottom edge where it is.
export function pullTransform(
  x: number,
  y: number,
  frame: { w: number; h: number }
) {
  if ((!x && !y) || !frame.w || !frame.h) return 'none';
  const w = STRETCH * Math.abs(x) - SQUASH * Math.abs(y);
  const h = STRETCH * Math.abs(y) - SQUASH * Math.abs(x);
  const drop = (SQUASH * Math.abs(x)) / 2;
  return `translate(${x}px, ${y + drop}px) scale(${1 + w / frame.w}, ${1 + h / frame.h})`;
}

// Letting go: past rest by a quarter of the pull, settled in about 0.3s.
export const RELEASE = {
  type: 'spring',
  stiffness: 600,
  damping: 19,
  mass: 1,
} as const;
