import React, { useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';

export default function RandomMovingImage({
  cols,
  rows,
  imageSrc,
}: {
  cols: number;
  rows: number;
  imageSrc: StaticImageData;
}) {
  const randomValues = useMemo(() => ({
    randomX: Math.random() * 0.7,
    randomY: Math.random(),
  }), []); // Empty dependency array means this only runs once

  return (
    <div
      className={`moving-image ${
        cols == 1 ? 'col-span-1' : 'col-span-2'
      } transition-all duration-300 w-full h-full  ${
        rows == 1 ? 'row-span-1' : 'row-span-2'
      } overflow-hidden rounded-2xl shadow-sm relative`}
      style={
        {
          '--random-x-value': randomValues.randomX,
          '--random-y-value': randomValues.randomY,
        } as React.CSSProperties
      }
    >
      <Image
        src={imageSrc}
        alt="photo"
        className="object-cover w-full h-full block"
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]"></div>
    </div>
  );
}
