import React, { useMemo } from 'react';
import Image, { StaticImageData } from 'next/image';

export default function RandomMovingImage({
  cols,
  rows,
  imageSrc,
  isActive = true,
}: {
  cols: number;
  rows: number;
  imageSrc: StaticImageData;
  isActive?: boolean;
}) {
  const randomValues = useMemo(
    () => ({
      randomX: Math.random() * 0.7,
      randomY: Math.random(),
    }),
    []
  ); // Empty dependency array means this only runs once

  return (
    <div
      className={`signup-widget ${isActive ? 'active' : 'paused'} ${
        cols == 1 ? 'col-span-1' : 'col-span-2'
      } h-full w-full ${
        rows == 1 ? 'row-span-1' : 'row-span-2'
      } relative overflow-hidden rounded-2xl`}
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
        className="block h-full w-full object-cover shadow-[0_22px_42px_rgba(0,0,0,.02),0_14.2593px_24.5972px_rgba(0,0,0,.015),0_8.47407px_13.3778px_rgba(0,0,0,.012),0_4.4px_6.825px_rgba(0,0,0,.01),0_1.79259px_3.42222px_rgba(0,0,0,.008),0_.407407px_1.65278px_rgba(0,0,0,.005)]"
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0px_0px_0px_1px_rgba(0,0,0,0.09)]"></div>
    </div>
  );
}
