import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { getUserData } from '../utils';
import { loadFont, loadImage, ogTiles } from '@/lib/server/og';
import { OG_SIZE, ProfileCard } from '@/components/og/profile-card';

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.pathname.split('/')[1];
    const { page, userData } = await getUserData(username);
    const { origin } = request.nextUrl;

    const name = page?.name || username;
    const [tiles, avatar] = await Promise.all([
      ogTiles(page?.blocks ?? [], origin),
      loadImage(userData?.image, origin),
    ]);
    const text = [name, ...tiles.map((t) => t.text ?? '')].join('');

    return new ImageResponse(
      <ProfileCard name={name} avatar={avatar} tiles={tiles} />,
      {
        ...OG_SIZE,
        fonts: [
          {
            name: 'Inter',
            data: await loadFont(text),
            style: 'normal',
            weight: 700,
          },
        ],
        headers: {
          'Cache-Control':
            'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (e) {
    console.error('og image failed', e);
    return new Response('Failed to generate the image', { status: 500 });
  }
}
