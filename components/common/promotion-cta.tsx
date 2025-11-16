import React from 'react';
import { Button } from '../ui';
import Link from 'next/link';
import Image from 'next/image';

export const PromotionCtaMobile = () => {
  return (
    <div className="w-full">
      <div className="z-10 hidden flex-col items-center justify-center gap-5 bg-slate-100 py-10 pb-24 text-center dark:bg-[#020817] sm:hidden">
        <Button className="bg-design-primary text-design-white hover:bg-design-primaryDark">
          <Link
            href={'/signup'}
            className="flex flex-row items-center justify-center gap-3 text-xs font-bold"
          >
            <Image src={'/favicon.ico'} alt="" width={20} height={15} />
            <div>
              <p className="text-base font-bold">Create Your Portfolio</p>
            </div>
          </Link>
        </Button>
        <Button variant={'ghost'}>
          <Link
            href={'/login'}
            className="text-design-gray dark:text-design-white"
          >
            Log In
          </Link>
        </Button>
      </div>
    </div>
  );
};

export const PromotionCtaDesktop = () => {
  return (
    <div className="fixed bottom-10 left-10 z-50 hidden flex-row items-center justify-center gap-2 sm:flex">
      <Button className="relative h-8 overflow-hidden bg-design-primary px-3 text-design-white hover:bg-design-primaryDark">
        <Link
          href={'/signup'}
          className="relative z-10 flex flex-row items-center gap-2 text-xs font-semibold"
        >
          <Image src={'/favicon.ico'} alt="" width={16} height={16} />
          <span>Create Your Portfolio</span>
        </Link>
        {/* Shine effect */}
        <div className="absolute inset-0 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-design-primaryLight/30 to-transparent" />
      </Button>
      <Button variant={'ghost'} className="h-8 px-3">
        <Link
          href={'/login'}
          className="text-sm text-design-gray dark:text-design-white"
        >
          Log In
        </Link>
      </Button>
    </div>
  );
};
