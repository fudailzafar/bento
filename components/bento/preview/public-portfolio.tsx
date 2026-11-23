'use client';

import { PageData } from '@/lib';
import { BentoGrid } from '../grid';
import { useProfileEntrance } from './profile-entrance';

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
  const { column, avatar } = useProfileEntrance();

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
            {/* bento leaves 73px under the grid on phones and tablets, and 190px
                beside the profile, so the last row clears the visitor bar. */}
            <div className="relative flex-1 pb-[73px] xl:w-[820px] xl:flex-none xl:pb-[190px]">
              <BentoGrid isEditMode={false} blocks={page.blocks || []} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
