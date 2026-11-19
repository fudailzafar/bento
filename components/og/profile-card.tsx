import type { OgTile } from '@/lib/server/og';

// The share image of a profile, in bento.me's explore style: avatar and name
// on the left, the first tiles of the page on the right, fading out below.
export const OG_SIZE = { width: 1200, height: 630 };

// The page grid, scaled down: a column is 120px wide, and a row is 48px so
// that a square tile (1 column by 2 rows) comes out square.
const COL = 120;
const ROW = 48;
const GAP = 24;
const GRID = { left: 528, top: 90 };

const left = (x: number) => x * (COL + GAP);
const top = (y: number) => y * (ROW + GAP);
const width = (w: number) => w * (COL + GAP) - GAP;
const height = (h: number) => h * (ROW + GAP) - GAP;

function Tile({ tile }: { tile: OgTile }) {
  const filled = tile.bg && tile.bg !== '#fff';
  const bar = tile.h <= 1;
  const empty = !tile.image && !tile.icon && !tile.text && !tile.bg;
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        left: left(tile.x),
        top: top(tile.y),
        width: width(tile.w),
        height: height(tile.h),
        borderRadius: bar ? 18 : 30,
        overflow: 'hidden',
        alignItems: bar ? 'center' : 'flex-start',
        padding: bar ? '0 20px' : 24,
        backgroundColor: tile.bg ?? (empty ? '#F4F4F5' : '#fff'),
        border: filled || tile.image || empty ? 'none' : '2px solid #ececec',
      }}
    >
      {tile.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.image}
          alt=""
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: width(tile.w),
            height: height(tile.h),
            objectFit: 'cover',
            objectPosition: tile.position ?? '50% 50%',
          }}
        />
      )}
      {tile.image && (
        // A faint outline, so a white picture still reads as a tile.
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            left: 0,
            top: 0,
            width: width(tile.w),
            height: height(tile.h),
            borderRadius: bar ? 18 : 30,
            border: '2px solid rgba(0,0,0,0.07)',
          }}
        />
      )}
      {tile.icon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.icon}
          alt=""
          style={{ width: bar ? 32 : 64, height: bar ? 32 : 64 }}
        />
      )}
      {tile.text && (
        <div
          style={{
            display: 'flex',
            fontSize: bar ? 20 : 24,
            whiteSpace: bar ? 'nowrap' : 'normal',
            lineHeight: 1.3,
            color: filled ? '#fff' : '#222',
          }}
        >
          {tile.text}
        </div>
      )}
    </div>
  );
}

export function ProfileCard({
  name,
  avatar,
  tiles,
}: {
  name: string;
  avatar?: string;
  tiles: OgTile[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        fontFamily: 'Inter',
      }}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt=""
          style={{
            position: 'absolute',
            left: 112,
            top: 112,
            width: 160,
            height: 160,
            borderRadius: 80,
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            left: 112,
            top: 112,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: '#ececec',
            fontSize: 72,
            fontWeight: 700,
            color: '#888',
          }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          left: 120,
          bottom: 130,
          width: 380,
          maxHeight: 240,
          overflow: 'hidden',
          fontSize: name.length > 14 ? 52 : 72,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: -2,
          color: '#000',
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          left: GRID.left,
          top: GRID.top,
        }}
      >
        {tiles.map((tile, i) => (
          <Tile key={i} tile={tile} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          left: GRID.left - 24,
          bottom: 0,
          right: 0,
          height: 220,
          backgroundImage:
            'linear-gradient(to bottom, rgba(255,255,255,0), #fff)',
        }}
      />
    </div>
  );
}
