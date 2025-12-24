import React from 'react';
import BehanceLogo from '@/public/auth/behance.png';
import DribbbleLogo from '@/public/auth/dribbble.png';
import FigmaLogo from '@/public/auth/figma.png';
import GithubLogo from '@/public/auth/github.png';
import InstaLogo from '@/public/auth/insta.png';
import TwitterLogo from '@/public/auth/twitter.png';
import LinkedinLogo from '@/public/auth/linkedin.png';
import Photo from '@/public/auth/photo1.png';
import RandomMovingImage from './random-moving-image';

export default function AuthAnimation({
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
