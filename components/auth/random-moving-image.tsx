import React from 'react';
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
  const randomX = Math.random() * 0.7;
  const randomY = Math.random();

  return (
    <div
      className={`moving-image ${
        cols == 1 ? 'col-span-1' : 'col-span-2'
      } transition-all duration-300 w-full h-full  ${
        rows == 1 ? 'row-span-1' : 'row-span-2'
      } rounded-lg overflow-hidden`}
      style={
        {
          '--random-x-value': randomX,
          '--random-y-value': randomY,
        } as React.CSSProperties
      }
    >
      <Image
        src={imageSrc}
        alt="photo"
        className="object-cover w-full h-full"
      />
    </div>
  );
}
