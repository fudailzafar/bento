import React from 'react';
import { BlurFade } from '../magicui';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui';

function ClaimUsernameLogo() {
  return (
    <>
      <BlurFade delay={3} duration={0.5}>
        <div className="mb-10 rounded-2xl bg-design-primary p-3">
          <div className="rounded-full">
            <Image
              src={'/icons/android-chrome-512x512.png'}
              alt="portfoliofy logo"
              className="rounded-lg"
              width={40}
              height={20}
            />
          </div>
        </div>
      </BlurFade>
    </>
  );
}

function ClaimUsernameMain({ username }: { username: string }) {
  return (
    <>
      <BlurFade delay={0.5} duration={2}>
        <div className="relative mb-2 flex items-center rounded-xl bg-gray-100 px-6 py-4">
          <span className="text-[24px] font-semibold text-design-gray md:text-[40px]">
            portfoliofy.me/
            <span className="overflow-hidden text-design-black">
              {username}
              <div className="absolute inset-0 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </span>
          </span>
          <BlurFade delay={2} duration={0.5}>
            <h1 className="absolute -right-12 -top-14 ml-2 rotate-2 rounded-lg bg-design-success px-3 py-1.5 text-base font-semibold text-white shadow">
              Available!
            </h1>
          </BlurFade>
        </div>
      </BlurFade>
    </>
  );
}

function ClaimUsernameDescription() {
  return (
    <>
      <BlurFade delay={3} duration={0.5}>
        <div className="mb-5 mt-2 text-center">
          <p className="text-center text-design-gray">
            Portfoliofy is the most beautiful portfolio.
          </p>
          <p className="text-design-gray">
            And it’s all free.{' '}
            <Link href={'/'}>
              <span className="cursor-pointer text-design-primaryLight underline">
                Learn more
              </span>
            </Link>
          </p>
        </div>
      </BlurFade>
    </>
  );
}

function ClaimUsernameButton() {
  return (
    <>
      <BlurFade delay={3} duration={0.5}>
        <div className="mt-2">
          <Link href="/signup">
            <Button className="group relative flex h-auto cursor-pointer items-center overflow-hidden rounded-lg bg-design-primary px-4 py-3 text-lg font-bold text-white transition-transform hover:bg-design-primaryDark active:scale-95">
              <span className="relative">Claim Handle Now</span>
            </Button>
          </Link>
        </div>
      </BlurFade>
    </>
  );
}

function ClaimUsernameImage() {
  return (
    <>
      <BlurFade delay={3.5}>
        <Image
          src={'/home/claim-username-mobile.png'}
          alt="claim username"
          width={360}
          height={255}
          className="bottom-0 mt-10 block lg:hidden"
        />
        <Image
          src={'/home/claim-username-desktop.png'}
          alt="not-found"
          width={1100}
          height={450}
          className="bottom-0 mt-10 hidden lg:block"
        />
      </BlurFade>
    </>
  );
}

export default function ClaimUsername({ username }: { username: string }) {
  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-hidden bg-white">
      <div className="flex-1"></div>
      <div className="flex flex-col items-center pt-[100px]">
        <ClaimUsernameLogo />
        <ClaimUsernameMain username={username} />
        <ClaimUsernameDescription />
        <ClaimUsernameButton />
      </div>
      <div className="flex-1"></div>
      <ClaimUsernameImage />
    </div>
  );
}
