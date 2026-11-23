// The press feedback every editor button shares: it shrinks to 90% while
// held, on bento's quick ease. White buttons also go a shade darker when
// hovered and pressed.
export const PRESS =
  'transition-[transform,color,background-color] duration-100 [transition-timing-function:cubic-bezier(.427,.073,.105,.997)] active:scale-90';
export const PRESS_WHITE = 'hover:bg-[#fafafa] active:bg-[#f2f2f2]';
