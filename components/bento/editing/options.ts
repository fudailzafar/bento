import { useEffect, useState } from 'react';
import {
  SizeBarIcon,
  SizeLargeIcon,
  SizeSmallIcon,
  SizeTallIcon,
  SizeWideIcon,
} from './toolbar-icons';

// What the desktop toolbar and the phone drawer both edit with.

// bento's widget sizes, as w×h on the editor grid. Notes and links also come
// as a slim bar.
export const SIZES = [
  { w: 1, h: 2, label: 'Small', Icon: SizeSmallIcon },
  { w: 2, h: 1, label: 'Bar', Icon: SizeBarIcon },
  { w: 2, h: 2, label: 'Wide', Icon: SizeWideIcon },
  { w: 1, h: 4, label: 'Tall', Icon: SizeTallIcon },
  { w: 2, h: 4, label: 'Large', Icon: SizeLargeIcon },
];

// The sizes a widget can take: only notes and links come as a slim bar.
export const sizesFor = (type: string) =>
  SIZES.filter((s) => s.h > 1 || type === 'TEXT' || type === 'LINK');

// bento's note palette: 16 colours, and the text on a note is white on
// anything darker than brightness 190, black otherwise.
export const NOTE_COLORS = [
  '#FFFFFF',
  '#FAFAFA',
  '#5AB2E6',
  '#2292E2',
  '#2768B1',
  '#F6C823',
  '#F89F21',
  '#F96F20',
  '#494949',
  '#000000',
  '#E6B1F3',
  '#E487D7',
  '#DD5ABB',
  '#A6F9E8',
  '#3EB59D',
  '#1B7865',
];

// Natural width over height of a picture, loaded once per address.
const aspects = new Map<string, number>();
export function useImageAspect(src?: string) {
  const [aspect, setAspect] = useState<number | null>(
    src ? (aspects.get(src) ?? null) : null
  );
  useEffect(() => {
    if (!src) return setAspect(null);
    const known = aspects.get(src);
    if (known !== undefined) return setAspect(known);
    const image = new Image();
    image.onload = () => {
      const value = image.naturalWidth / image.naturalHeight;
      aspects.set(src, value);
      setAspect(value);
    };
    image.src = src;
  }, [src]);
  return aspect;
}

export interface Place {
  name: string;
  lat: number;
  lng: number;
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  return response.ok ? response.json() : [];
}
