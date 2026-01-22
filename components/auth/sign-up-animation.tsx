import React, { useMemo } from 'react';
import BehanceLogo from '@/public/auth/behance.png';
import DribbbleLogo from '@/public/auth/dribbble.png';
import FigmaLogo from '@/public/auth/figma.png';
import GithubLogo from '@/public/auth/github.png';
import InstaLogo from '@/public/auth/insta.png';
import TwitterLogo from '@/public/auth/twitter.png';
import LinkedinLogo from '@/public/auth/linkedin.png';
import Photo from '@/public/auth/photo1.png';
import Image, { StaticImageData } from 'next/image';

function RandomMovingImage({
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

export default function SignUpAnimation({
  isActive = true,
}: {
  isActive?: boolean;
}) {
  return (
    <div className="hidden max-w-[750px] flex-1 items-center justify-center lg:flex">
      <div className="signup grid aspect-square max-h-[640px] max-w-[640px] grid-cols-4 grid-rows-4 gap-8 p-8">
        <RandomMovingImage
          rows={2}
          cols={2}
          imageSrc={Photo}
          isActive={isActive}
        />
        <RandomMovingImage
          rows={1}
          cols={1}
          imageSrc={BehanceLogo}
          isActive={isActive}
        />
        <RandomMovingImage
          rows={1}
          cols={1}
          imageSrc={LinkedinLogo}
          isActive={isActive}
        />
        <RandomMovingImage
          rows={2}
          cols={2}
          imageSrc={DribbbleLogo}
          isActive={isActive}
        />
        <RandomMovingImage
          rows={1}
          cols={1}
          imageSrc={FigmaLogo}
          isActive={isActive}
        />
        <RandomMovingImage
          rows={2}
          cols={1}
          imageSrc={InstaLogo}
          isActive={isActive}
        />
        <RandomMovingImage
          rows={1}
          cols={1}
          imageSrc={TwitterLogo}
          isActive={isActive}
        />
        <RandomMovingImage
          rows={1}
          cols={2}
          imageSrc={GithubLogo}
          isActive={isActive}
        />
      </div>
    </div>
  );
}
