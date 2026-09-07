'use client';

import { useEffect, useRef, useState } from 'react';
import { NO_DRAG } from './no-drag';

// bento's in-place crop: the widget keeps its frame and the picture moves
// under it. The whole picture shows faded outside the frame, so you see what
// is being left out; drag to choose the part that stays.
export function CropEditor({
  src,
  posX,
  posY,
  radius,
  onCommit,
}: {
  src: string;
  // Where the picture sits in its frame, 0 to 1 (0.5 is centred).
  posX: number;
  posY: number;
  radius: number;
  onCommit: (pos: { posX: number; posY: number }) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [pos, setPos] = useState({ x: posX, y: posY });
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const image = new Image();
    image.onload = () =>
      setNatural({ w: image.naturalWidth, h: image.naturalHeight });
    image.src = src;
  }, [src]);

  const scale = natural
    ? Math.max(frame.w / natural.w, frame.h / natural.h)
    : 0;
  const width = natural ? natural.w * scale : 0;
  const height = natural ? natural.h * scale : 0;
  const spareX = Math.max(0, width - frame.w);
  const spareY = Math.max(0, height - frame.h);
  const left = -spareX * pos.x;
  const top = -spareY * pos.y;
  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  const picture = (extra: string) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={`pointer-events-none absolute max-w-none select-none ${extra}`}
      style={{ left, top, width, height }}
    />
  );

  return (
    <div ref={box} className="pointer-events-none absolute inset-0 z-20">
      {natural && frame.w > 0 && (
        <>
          {/* The whole picture, faded, with the widget's rounded corners. */}
          <div
            className="pointer-events-none absolute overflow-hidden opacity-50"
            style={{ left, top, width, height, borderRadius: radius }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              draggable={false}
              className="h-full w-full max-w-none select-none"
            />
          </div>
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: radius }}
          >
            {picture('')}
            <div
              className={`${NO_DRAG} pointer-events-auto absolute inset-0 cursor-move touch-none`}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag.current = {
                  x: e.clientX,
                  y: e.clientY,
                  startX: pos.x,
                  startY: pos.y,
                };
              }}
              onPointerMove={(e) => {
                const start = drag.current;
                if (!start) return;
                // Dragging the picture right shows more of its left side.
                setPos({
                  x: spareX
                    ? clamp(start.startX - (e.clientX - start.x) / spareX)
                    : start.startX,
                  y: spareY
                    ? clamp(start.startY - (e.clientY - start.y) / spareY)
                    : start.startY,
                });
              }}
              onPointerUp={() => {
                if (!drag.current) return;
                drag.current = null;
                onCommit({ posX: pos.x, posY: pos.y });
              }}
            />
          </div>
          {/* The frame: a 2px black border, as when a widget is selected. */}
          <div
            className="pointer-events-none absolute inset-0 border-2 border-black"
            style={{ borderRadius: radius }}
          />
        </>
      )}
    </div>
  );
}
