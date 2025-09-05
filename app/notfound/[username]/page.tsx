'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import BlurFade from '@/components/magicui/blur-fade';

export default function NotFoundUsernamePage() {
  const params = useParams();
  const username = params?.username || '';

  return (
    <div className="flex flex-col mt-16 mb-1 items-center justify-center bg-white">
      {/* Logo */}
      <BlurFade delay={3} duration={0.5}>
        <div className="mb-1">
          <div className="rounded-full p-10">
            <Image
              src={'/icons/android-chrome-512x512.png'}
              alt=""
              className="rounded-md"
              width={65}
              height={45}
            />
          </div>
        </div>
      </BlurFade>

      {/* Username display */}
      <BlurFade delay={0.5} duration={2}>
        <div className="relative flex items-center mb-2 px-6 py-4 rounded-xl bg-gray-100">
          <span className="text-[24px] md:text-[40px] font-semibold text-design-gray">
            portfoliofy.com/
            <span className="text-design-black">{username}</span>
          </span>
          <BlurFade delay={2} duration={0.5}>
            <h1 className="ml-2 px-3 py-1.5 bg-[#4EDD76] text-white rounded-lg font-semibold text-base absolute -top-14 -right-12 shadow rotate-2">
              Available!
            </h1>
          </BlurFade>
        </div>
      </BlurFade>
      <BlurFade delay={3} duration={0.5}>
        <div className="text-center mt-2 mb-5">
          <p className="text-design-gray text-center">
            Portfoliofy is the most beautiful portfolio.
          </p>
          <p className="text-design-gray">
            And it’s all free.{' '}
            <Link href={'/'}>
              <span className="underline cursor-pointer text-design-black">
                Learn more
              </span>
            </Link>
          </p>
        </div>
      </BlurFade>
      <BlurFade delay={3} duration={0.5}>
        <div className="mt-2">
          <Link href="/upload">
            <Button className="relative group rounded-lg flex items-center bg-black hover:bg-black/75 text-white px-4 py-3 h-auto text-lg font-bold overflow-hidden cursor-pointer">
              <div className="h-[120px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute blur-sm -rotate-45 -left-16 group-hover:left-[150%] duration-500 delay-200" />
              <span className="relative">Claim Handle Now</span>
            </Button>
          </Link>
        </div>
      </BlurFade>
      <BlurFade delay={2.5}>
        <Image
          src={'/cv-not-found.png'}
          alt=""
          width={415}
          height={0}
          className="absolute bottom-0 object-cover rotate-3"
        />
      </BlurFade>
    </div>
  );
}
