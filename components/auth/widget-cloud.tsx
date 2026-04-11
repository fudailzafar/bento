'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Port of bento.me's auth-screen widget cloud. In the "gas" state every tile
// drifts on a spring towards a fresh random offset every 1–6s; "solid" snaps
// them back into the grid.

export type CloudState = 'gas' | 'solid';
type ParticleStyle = 'stylized' | 'realistic';

interface Particle {
  offsetX: number;
  offsetY: number;
  rotate: number;
  mass: number;
  damping: number;
  duration: number;
}

const REST: Particle = { offsetX: 0, offsetY: 0, rotate: 0, mass: 20, damping: 100, duration: 0 };

function randomParticle(style: ParticleStyle): Particle {
  const spread = (max: number) => Math.random() * max * 2 - max;
  return {
    offsetX: spread(50),
    offsetY: spread(50),
    rotate: spread(style === 'realistic' ? 12 : 28),
    mass: 30 * Math.random() + 10,
    damping:
      style === 'realistic'
        ? 160 * Math.random() + 60
        : 140 * Math.random() + 50,
    duration: 5 * Math.random() + 1,
  };
}

function FloatingTile({
  state,
  particleStyle,
  className,
  style,
  children,
}: {
  state: CloudState;
  particleStyle: ParticleStyle;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  // Starts at rest (so server and client render the same), then drifts.
  const [particle, setParticle] = useState<Particle>(REST);

  useEffect(() => {
    const timeout = setTimeout(
      () => setParticle(randomParticle(particleStyle)),
      particle === REST ? 0 : particle.duration * 1000
    );
    return () => clearTimeout(timeout);
  }, [particle, particleStyle]);

  const solid = state === 'solid';

  return (
    <motion.div
      className={cn('pointer-events-none', className)}
      style={style}
      animate={{
        x: solid ? 0 : particle.offsetX,
        y: solid ? 0 : particle.offsetY,
        rotate: solid ? 0 : particle.rotate,
        transition: solid
          ? { type: 'spring', damping: 13, mass: 1.5, stiffness: 60 }
          : { type: 'spring', damping: particle.damping, mass: particle.mass, stiffness: 50 },
      }}
    >
      {children}
    </motion.div>
  );
}

const HANDLE_SHADOW = 'shadow-[0_10.5676px_17.6127px_rgba(0,0,0,.03)]';

export interface StylizedTile {
  id: string;
  background: string;
  icon: ReactNode;
}

// Login: seven brand-coloured icon tiles in a 3×4 grid.
export function StylizedCloud({
  tiles,
  state = 'gas',
}: {
  tiles: StylizedTile[];
  state?: CloudState;
}) {
  const spans = ['row-span-2', '', '', 'col-span-2', 'col-span-2 row-span-2', '', ''];

  return (
    <div
      className={cn(
        'max-w-[384px] rounded-[40px] p-8 transition-colors duration-500',
        state === 'solid' && 'bg-[#f7f7f7]'
      )}
    >
      <div className="relative grid h-[420px] w-[320px] grid-cols-3 grid-rows-4 gap-5">
        {tiles.map((tile, i) => (
          <FloatingTile
            key={tile.id}
            state={state}
            particleStyle="stylized"
            style={{ background: tile.background }}
            className={cn(
              'relative flex flex-col rounded-[22px] p-[22px]',
              i === 0
                ? 'items-center justify-start'
                : i === 3
                  ? 'items-start justify-center'
                  : 'items-center justify-center',
              state !== 'solid' && HANDLE_SHADOW,
              spans[i]
            )}
          >
            <div>{tile.icon}</div>
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]" />
          </FloatingTile>
        ))}
      </div>
    </div>
  );
}

const REALISTIC = [
  { id: 'photo1', span: 'col-span-2 row-span-2', radius: '6.57%' },
  { id: 'behance', span: '', radius: '14.7%' },
  { id: 'linkedin', span: '', radius: '14.7%' },
  { id: 'dribbble', span: 'col-span-2 row-span-2', radius: '6.57%' },
  { id: 'figma', span: '', radius: '14.7%' },
  { id: 'insta', span: 'row-span-2', radius: '14.7% / 6.57%' },
  { id: 'twitter', span: '', radius: '14.7%' },
  { id: 'github', span: 'col-span-2', radius: '6.57% / 14.7%' },
];

// Sign-up: eight widget screenshots in a 4×4 grid.
export function RealisticCloud({ state }: { state: CloudState }) {
  return (
    <div className="rounded-[40px] p-8 transition-colors duration-500">
      <div className="relative grid aspect-square max-h-[640px] max-w-[640px] grid-cols-4 grid-rows-4 gap-8">
        {REALISTIC.map((tile) => (
          <FloatingTile
            key={tile.id}
            state={state}
            particleStyle="realistic"
            style={{ borderRadius: tile.radius }}
            className={cn(
              'relative flex overflow-hidden bg-white shadow-[0_22px_42px_rgba(0,0,0,.02),0_14.2593px_24.5972px_rgba(0,0,0,.015),0_8.47407px_13.3778px_rgba(0,0,0,.012),0_4.4px_6.825px_rgba(0,0,0,.01),0_1.79259px_3.42222px_rgba(0,0,0,.008),0_.407407px_1.65278px_rgba(0,0,0,.005)]',
              tile.span
            )}
          >
            <img src={`/auth/${tile.id}.png`} alt="" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.09)]" />
          </FloatingTile>
        ))}
      </div>
    </div>
  );
}
