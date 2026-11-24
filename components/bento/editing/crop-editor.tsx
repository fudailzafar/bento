'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { dragAxis, pullTransform, RELEASE } from '@/lib/crop';
import { mediaSize } from '@/lib/media';
import { NO_DRAG } from './no-drag';

// The faded copy of a cropped video: it draws the playing video's own frames,
// so the two can never drift apart.
function VideoMirror({
  video,
}: {
  video: React.RefObject<HTMLVideoElement | null>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const from = video.current;
      const to = canvas.current;
      if (from && to && from.readyState >= 2) {
        if (to.width !== from.videoWidth) {
          to.width = from.videoWidth;
          to.height = from.videoHeight;
        }
        to.getContext('2d')?.drawImage(from, 0, 0);
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [video]);
  return <canvas ref={canvas} className="h-full w-full" />;
}

const tileVideoIn = (item: Element | null | undefined) =>
  item?.querySelector<HTMLVideoElement>('[data-widget] video') ?? null;
// The video of the tile being cropped (there is none in the phone's drawer).
const tileVideo = (box: Element | null) => tileVideoIn(box?.parentElement);

// bento's in-place crop: the widget keeps its frame and the picture or video
// moves under it. All of it shows faded outside the frame, so you see what is
// being left out; drag to choose the part that stays. Dragging past its edge
// pulls the whole tile along, and it springs back when let go (see lib/crop).
export function CropEditor({
  src,
  video = false,
  posX,
  posY,
  radius,
  onCommit,
}: {
  src: string;
  video?: boolean;
  // Where the picture sits in its frame, 0 to 1 (0.5 is centred).
  posX: number;
  posY: number;
  radius: number;
  onCommit: (pos: { posX: number; posY: number }) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [pos, setPos] = useState({ x: posX, y: posY });
  const [dragging, setDragging] = useState(false);
  // The video has a frame to show; until then the tile's own stays visible.
  const [playing, setPlaying] = useState(false);
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    last: { x: number; y: number };
  } | null>(null);

  // How far the tile is pulled, in px.
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const transform = useTransform([pullX, pullY], ([x, y]: number[]) =>
    pullTransform(x, y, frame)
  );

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
    let current = true;
    mediaSize(src, video).then((size) => {
      if (current) setNatural(size);
    });
    return () => {
      current = false;
    };
  }, [src, video]);

  // And the tile's video carries on from here.
  useEffect(() => {
    const el = box.current;
    if (!playing || !el) return;
    const item = el.parentElement;
    const own = player.current;
    return () => {
      const tile = tileVideoIn(item);
      if (!tile || !own) return;
      tile.currentTime = own.currentTime;
      tile.play().catch(() => {});
    };
  }, [playing]);

  const scale = natural
    ? Math.max(frame.w / natural.w, frame.h / natural.h)
    : 0;
  const width = natural ? natural.w * scale : 0;
  const height = natural ? natural.h * scale : 0;
  const spareX = Math.max(0, width - frame.w);
  const spareY = Math.max(0, height - frame.h);
  const left = -spareX * pos.x;
  const top = -spareY * pos.y;
  const ready = !!natural && frame.w > 0;
  const drawn = ready && (!video || playing);

  const release = () => {
    const end = drag.current;
    if (!end) return;
    drag.current = null;
    setDragging(false);
    animate(pullX, 0, RELEASE);
    animate(pullY, 0, RELEASE);
    if (end.last.x !== end.startX || end.last.y !== end.startY)
      onCommit({ posX: end.last.x, posY: end.last.y });
  };

  return (
    <div
      ref={box}
      // globals.css hides the tile under the editor once it is ready, and the
      // tile's buttons while the picture is dragged.
      data-crop={!drawn ? 'loading' : dragging ? 'dragging' : 'ready'}
      className="pointer-events-none absolute inset-0 z-20"
    >
      {ready && (
        <motion.div className="absolute inset-0" style={{ transform }}>
          {/* The whole picture, faded, with the widget's rounded corners. */}
          <div
            className="pointer-events-none absolute overflow-hidden opacity-50"
            style={{ left, top, width, height, borderRadius: radius }}
          >
            {video ? (
              <VideoMirror video={player} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                draggable={false}
                className="h-full w-full max-w-none select-none"
              />
            )}
          </div>
          <div
            data-crop-frame
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: radius }}
          >
            {video ? (
              <video
                ref={player}
                src={src}
                autoPlay
                muted
                loop
                playsInline
                // Carries on from where the tile's own video is.
                onLoadedMetadata={(e) => {
                  const tile = tileVideo(box.current);
                  if (tile) e.currentTarget.currentTime = tile.currentTime;
                }}
                onLoadedData={() => setPlaying(true)}
                className="pointer-events-none absolute max-w-none select-none"
                style={{ left, top, width, height }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                draggable={false}
                className="pointer-events-none absolute max-w-none select-none"
                style={{ left, top, width, height }}
              />
            )}
            <div
              className={`${NO_DRAG} pointer-events-auto absolute inset-0 cursor-move touch-none`}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                pullX.stop();
                pullY.stop();
                drag.current = {
                  x: e.clientX,
                  y: e.clientY,
                  startX: pos.x,
                  startY: pos.y,
                  last: pos,
                };
                setDragging(true);
              }}
              onPointerMove={(e) => {
                const from = drag.current;
                if (!from) return;
                const x = dragAxis(from.startX, spareX, e.clientX - from.x);
                const y = dragAxis(from.startY, spareY, e.clientY - from.y);
                from.last = { x: x.pos, y: y.pos };
                setPos(from.last);
                pullX.set(x.pull);
                pullY.set(y.pull);
              }}
              onPointerUp={release}
              onPointerCancel={release}
            />
          </div>
          {/* The frame: a 2px black border, as when a widget is selected. */}
          <div
            className="pointer-events-none absolute inset-0 border-2 border-black"
            style={{ borderRadius: radius }}
          />
        </motion.div>
      )}
    </div>
  );
}
