'use client';

import { useEffect, useRef } from 'react';
import { PageData } from '@/lib';
import { BentoGrid } from '../grid';

// Desktop starts here, as in bento's grid engine.
const DESKTOP_MIN_WIDTH = 1260;

// bento.me's profile column: avatar, name and bio. On load it fades in;
// on desktop it also rises 40px and the avatar straightens from -8°.
function PublicProfile({
  name,
  bio,
  picture,
}: {
  name?: string | null;
  bio?: string | null;
  picture?: string;
}) {
  const column = useRef<HTMLDivElement>(null);
  const avatar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = column.current;
    if (!el) return;
    const desktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
    if (desktop) el.style.transform = 'translate(0, 40px)';
    if (avatar.current) {
      avatar.current.style.transform = desktop
        ? 'rotateZ(-8deg)'
        : 'rotateZ(0deg)';
    }
    const timeout = setTimeout(() => {
      el.style.transition =
        'opacity 1s cubic-bezier(0.42, 0, 0.25, 1), transform 1s cubic-bezier(0.2, 1.18, 0.47, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translate(0, 0px)';
      if (avatar.current) {
        avatar.current.style.transition =
          'transform 1s cubic-bezier(0.2, 1.18, 0.47, 1)';
        avatar.current.style.transform = 'rotateZ(0deg)';
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={column}
      style={{ opacity: 0 }}
      className="relative xl:sticky xl:top-16"
    >
      {picture && (
        <div
          ref={avatar}
          className="h-[120px] w-[120px] xl:h-[184px] xl:w-[184px]"
        >
          <div className="relative aspect-square h-full w-full overflow-hidden rounded-full">
            <img src={picture} alt="" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]" />
          </div>
        </div>
      )}
      <div
        className={
          picture
            ? 'ml-2 mt-8 w-[calc(100%-8px)] max-w-[min(500px,100%-8px)] xl:max-w-[min(500px,calc(100vw_-_1000px))]'
            : 'ml-2 w-[calc(100%-8px)] max-w-[min(500px,100%-8px)] xl:max-w-[min(500px,calc(100vw_-_1000px))]'
        }
      >
        <h1 className="text-[32px] font-bold leading-[120%] tracking-[-1px] text-black xl:text-[44px] xl:tracking-[-2px]">
          {name}
        </h1>
        {bio && (
          <p className="mt-3 whitespace-pre-line text-[#565656] xl:mt-3 xl:text-xl">
            {bio}
          </p>
        )}
      </div>
    </div>
  );
}

// Page structure copied from bento.me/[handle]: a 428px column on phones and
// tablets; from xl the profile is pinned left and the 820px grid sits right.
export const PublicPortfolio = ({
  page,
  profilePicture,
}: {
  page?: PageData | null;
  profilePicture?: string;
}) => {
  if (!page) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex min-h-screen w-full max-w-[1728px] flex-col">
        <div className="relative flex min-h-screen w-full flex-1 flex-col items-center">
          <div className="flex h-full w-full max-w-[428px] items-center justify-center p-6 pb-0 pt-12 xl:absolute xl:top-0 xl:max-w-[min(100vw,1728px)] xl:items-stretch xl:justify-start xl:p-16">
            <div className="flex w-full flex-col px-4 xl:mr-20 xl:flex-1 xl:px-0">
              <PublicProfile
                name={page.name}
                bio={page.headline}
                picture={profilePicture}
              />
            </div>
          </div>
          <div className="flex h-full w-full max-w-[428px] flex-1 flex-col p-6 pt-0 xl:max-w-[1728px] xl:flex-row xl:p-16">
            <div className="mb-10 flex flex-col px-4 xl:mb-0 xl:mr-20 xl:flex-1 xl:px-0" />
            <div className="relative flex-1 xl:w-[820px] xl:flex-none">
              <BentoGrid isEditMode={false} blocks={page.blocks || []} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
