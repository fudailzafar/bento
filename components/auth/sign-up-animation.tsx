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

export default function SignupAnimation() {
  return (
    <div className="grid aspect-square max-h-[640px] max-w-[640px] gap-8 grid-cols-4 grid-rows-4 p-8 signup">
      <RandomMovingImage rows={2} cols={2} imageSrc={Photo} />
      <RandomMovingImage rows={1} cols={1} imageSrc={BehanceLogo} />
      <RandomMovingImage rows={1} cols={1} imageSrc={LinkedinLogo} />
      <RandomMovingImage rows={2} cols={2} imageSrc={DribbbleLogo} />
      <RandomMovingImage rows={1} cols={1} imageSrc={FigmaLogo} />
      <RandomMovingImage rows={2} cols={1} imageSrc={InstaLogo} />
      <RandomMovingImage rows={1} cols={1} imageSrc={TwitterLogo} />
      <RandomMovingImage rows={1} cols={2} imageSrc={GithubLogo} />
    </div>
  );
}
