'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { exploreCategories, type ExploreBento } from '@/lib/explore-data';
import { PREVIEW_CARD } from './styles';

function BentoCard({ bento }: { bento: ExploreBento }) {
  return (
    <div className="flex w-full flex-col justify-between gap-4 max-[479px]:w-[90%] max-[479px]:justify-start">
      <a
        href={bento.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          PREVIEW_CARD,
          'px-4 pb-10 pt-4 max-[479px]:w-screen max-[479px]:px-2'
        )}
      >
        <div className="relative w-full rounded-xl shadow-[0_2px_2px_rgba(0,0,0,.02)]">
          <img
            src={bento.image}
            alt=""
            loading="lazy"
            width={1200}
            height={600}
            className="block h-full w-full rounded-xl object-cover"
          />
          <div className="absolute left-0 top-0 h-full w-full rounded-xl border border-black/[.08]" />
        </div>
        <div className="flex w-full flex-col gap-2 px-1">
          <div className="text-sm font-light leading-[21px] text-[#5a5a5a]">
            {bento.description}
          </div>
        </div>
      </a>
    </div>
  );
}

export function CategoryTabs() {
  const [current, setCurrent] = useState(0);

  return (
    <div
      id="featured"
      className="relative mx-auto mt-0 flex w-full max-w-[1532px] flex-col"
    >
      <div
        role="tablist"
        className="scrollbar-hide sticky top-0 z-[2] flex flex-row justify-start gap-14 overflow-scroll bg-white px-[60px] max-[991px]:px-8 max-[767px]:gap-10 max-[479px]:px-7"
      >
        {exploreCategories.map((category, i) => {
          const active = i === current;
          return (
            <button
              key={category.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCurrent(i)}
              className={cn(
                'relative flex cursor-pointer flex-col items-center justify-center gap-3 border-b-2 bg-transparent px-0 py-[34px] text-left align-top text-sm leading-5 text-[#222] transition-all [transition-duration:200ms] [transition-timing-function:cubic-bezier(.444,.061,.25,1)] focus:outline-none active:scale-[.94] max-[479px]:py-5 max-[479px]:active:scale-100',
                active ? 'border-black active:border-b-0' : 'border-white'
              )}
            >
              <img
                src={category.icon}
                alt=""
                width={24}
                height={24}
                className="block w-6"
              />
              <div
                className={
                  category.plainTitle
                    ? 'whitespace-nowrap'
                    : 'whitespace-nowrap text-xs font-medium leading-4'
                }
              >
                {category.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative mx-auto mt-5 w-full overflow-hidden px-6 max-[991px]:px-0 max-[479px]:-mt-2 max-[479px]:mx-0">
        <div role="tabpanel" className="relative">
          <div className="grid w-full grid-cols-3 justify-center justify-items-center gap-x-10 gap-y-8 overflow-hidden px-4 py-6 max-[991px]:grid-cols-2 max-[991px]:gap-5 max-[991px]:px-6 max-[479px]:flex max-[479px]:flex-col max-[479px]:items-center max-[479px]:gap-3 max-[479px]:px-0">
            {exploreCategories[current].items.map((bento) => (
              <BentoCard key={`${current}-${bento.href}`} bento={bento} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
