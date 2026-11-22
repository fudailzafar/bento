import { useCallback, useEffect, useRef } from 'react';
import type { ItemCallback } from 'react-grid-layout';

// The drag lift and tilt of gumbee.dev's grid, ported as it ships.
//
// A tile is lifted once the pointer has moved 3px from where it was pressed:
// the grid item gets data-dragging, and the CSS scales and raises its
// [data-scale] layer. While it is dragged, how fast the pointer moves
// sideways sets a target tilt for its [data-rotation] layer: 0.3deg for each
// px moved since the last event, at most 8deg, leaning against the movement.
// The tilt follows that target on a spring (stiffness 100, damping 13, mass
// 2), so it overshoots and swings back, and the target itself shrinks by 50deg
// a second, so a tile held still straightens up. The tilt pivots where the
// tile was grabbed, and smaller tiles lean more: the angle is scaled by
// 200 / the tile's width, between 0.02 and 1.
//
// One difference from gumbee.dev: its tilt remembers where the last drag
// ended, so the first move of the next drag reads as a big sideways jump and
// flicks the tile. Here every drag starts from where it was pressed, as the
// first drag on a page does there.

const DRAG_THRESHOLD = 3;
const STIFFNESS = 100;
const DAMPING = 13;
const MASS = 2;
const REST = 0.1;
const MAX_TILT = 8;
const PER_PX = 0.3;
const MAX_STEP = 50;
const DECAY = 50;
const MAX_DT = 64;

interface Spring {
  value: number;
  velocity: number;
  target: number;
  rotor: HTMLElement | null;
  width: number;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

// A mouse or a finger.
const pointOf = (event: MouseEvent | TouchEvent) => {
  const p =
    'touches' in event ? (event.touches[0] ?? event.changedTouches[0]) : event;
  return { x: p.clientX, y: p.clientY };
};

export function useDragTilt() {
  const springs = useRef(new Map<string, Spring>());
  const frame = useRef(0);
  const running = useRef(false);
  const last = useRef(0);
  // The drag in progress: pressed (waiting for 3px) or started (lifted).
  const drag = useRef<{
    id: string;
    item: HTMLElement;
    startX: number;
    startY: number;
    previousX: number;
    started: boolean;
  } | null>(null);

  const stepRef = useRef<() => void>(() => {});

  const setTarget = useCallback((id: string, target: number) => {
    const spring = springs.current.get(id);
    if (!spring) return;
    spring.target = clamp(target, -MAX_TILT, MAX_TILT);
    if (!running.current) {
      last.current = performance.now();
      running.current = true;
      frame.current = requestAnimationFrame(() => stepRef.current());
    }
  }, []);

  const step = () => {
    if (!running.current) return;
    const now = performance.now();
    const dt = Math.min(now - last.current, MAX_DT) / 1000;
    last.current = now;
    let moving = false;
    springs.current.forEach((spring, id) => {
      const force = -STIFFNESS * (spring.value - spring.target);
      const damping = -DAMPING * spring.velocity;
      spring.velocity += ((force + damping) / MASS) * dt;
      spring.value += spring.velocity * dt;
      if (
        Math.abs(spring.value - spring.target) < REST &&
        Math.abs(spring.velocity) <= REST
      ) {
        spring.value = spring.target;
        spring.velocity = 0;
      }
      if (spring.rotor) {
        const scale = clamp(200 / spring.width, 0.02, 1);
        spring.rotor.style.transform = `rotate(${spring.value * scale}deg)`;
      }
      let decay = Math.sign(spring.target) * dt * DECAY;
      if (Math.abs(decay) > Math.abs(spring.target)) decay = spring.target;
      if (Math.abs(spring.velocity) > 0) moving = true;
      setTarget(id, spring.target - decay);
      // Back at rest and straight, and not being dragged: hand the layer back
      // to the stylesheet.
      const held = drag.current?.started && drag.current.id === id;
      if (
        !held &&
        spring.value === 0 &&
        spring.target === 0 &&
        spring.velocity === 0
      ) {
        if (spring.rotor) {
          spring.rotor.style.transform = '';
          spring.rotor.style.willChange = '';
        }
        springs.current.delete(id);
      }
    });
    if (moving) frame.current = requestAnimationFrame(() => stepRef.current());
    else running.current = false;
  };

  useEffect(() => {
    stepRef.current = step;
  });

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      running.current = false;
    },
    []
  );

  // Pressed: remember where, and pivot the tilt on the grabbed point.
  const onDragStart: ItemCallback = useCallback(
    (_l, item, _n, _p, event, el) => {
      const { x, y } = pointOf(event);
      const rotor = el.querySelector<HTMLElement>('[data-rotation]');
      if (rotor) {
        const rect = rotor.getBoundingClientRect();
        rotor.style.transformOrigin = `${((x - rect.left) / rect.width) * 100}% ${((y - rect.top) / rect.height) * 100}%`;
      }
      drag.current = {
        id: item.i,
        item: el,
        startX: x,
        startY: y,
        previousX: 0,
        started: false,
      };
    },
    []
  );

  const onDrag: ItemCallback = useCallback(
    (_l, _o, _n, _p, event) => {
      const current = drag.current;
      if (!current) return;
      const { x, y } = pointOf(event);
      const offset = x - current.startX;
      if (!current.started) {
        if (Math.hypot(x - current.startX, y - current.startY) < DRAG_THRESHOLD)
          return;
        // Lifted.
        current.started = true;
        current.previousX = 0;
        current.item.setAttribute('data-dragging', '');
        if (!springs.current.has(current.id)) {
          const rotor =
            current.item.querySelector<HTMLElement>('[data-rotation]');
          // The tilt turns this layer from script, a frame at a time: its own
          // compositor layer keeps each turn from redrawing the whole tile.
          if (rotor) rotor.style.willChange = 'transform';
          springs.current.set(current.id, {
            value: 0,
            velocity: 0,
            target: 0,
            rotor,
            width: current.item.clientWidth,
          });
        }
        last.current = performance.now();
        return;
      }
      const sideways = current.previousX - offset;
      current.previousX = offset;
      const tilt =
        Math.sign(sideways) * Math.min(Math.abs(sideways) * PER_PX, MAX_STEP);
      const spring = springs.current.get(current.id);
      if (spring && Math.abs(tilt) > spring.target) setTarget(current.id, tilt);
    },
    [setTarget]
  );

  // Dropped: the tilt swings back to straight.
  const onDragStop: ItemCallback = useCallback(() => {
    const current = drag.current;
    drag.current = null;
    if (!current?.started) return;
    current.item.removeAttribute('data-dragging');
    setTarget(current.id, 0);
  }, [setTarget]);

  return { onDragStart, onDrag, onDragStop };
}
