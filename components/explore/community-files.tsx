import { cn } from '@/lib/utils';
import { communityFiles } from '@/lib/explore-data';
import { PREVIEW_CARD } from './styles';

// bento.me/explore's "Discover beautiful custom widgets" section.
export function CommunityFiles() {
  return (
    <div
      id="communityfiles"
      className="mx-auto mt-0 flex w-full max-w-[1532px] flex-col gap-12 px-10 pt-[164px] max-[991px]:px-6 max-[479px]:px-0 max-[479px]:pt-16"
    >
      <div className="relative z-[2] flex flex-col gap-3 bg-white px-6 pb-5 text-[#333] max-[479px]:gap-5 max-[479px]:px-8">
        <h2 className="text-[32px] font-bold leading-10 max-[479px]:text-2xl max-[479px]:leading-8">
          Discover beautiful custom widgets created by the Bento community
        </h2>
        <div className="text-base font-light leading-5 text-[#818181] max-[479px]:leading-[22px]">
          Or design your own by using the{' '}
          <a
            href="https://www.figma.com/community/file/1230552194166470869/Official-Bento-Widget-Guidelines"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#818181] no-underline transition-all [transition-duration:140ms] [transition-timing-function:cubic-bezier(.491,.019,.25,1)] hover:underline active:text-[#3f3f3f] active:underline"
          >
            Official Bento Widget Guidelines →
          </a>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-6 px-0 max-[991px]:grid-cols-2 max-[479px]:grid-cols-1">
        {communityFiles.map((file) => (
          <a
            key={file.href}
            href={file.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              PREVIEW_CARD,
              'px-4 pb-6 pt-4 max-[479px]:w-full max-[479px]:px-6'
            )}
          >
            <div className="relative w-full rounded-xl shadow-[0_2px_2px_rgba(0,0,0,.02)]">
              <img
                src={file.thumbnail}
                alt=""
                loading="lazy"
                className="block w-full rounded-xl"
              />
              <div className="absolute left-0 top-0 h-full w-full rounded-xl border border-black/[.08]" />
              <img
                src="/explore/figmalogo.png"
                alt=""
                width={24}
                className="absolute right-3 top-3 rounded-full shadow-[0_2px_2px_rgba(0,0,0,.1)]"
              />
            </div>
            <div className="flex w-full flex-row items-center gap-3 px-3">
              <div className="relative h-7 w-7 shrink-0 rounded-[20px]">
                <img
                  src={file.avatar}
                  alt=""
                  loading="lazy"
                  className="h-7 w-7 max-w-none rounded-[20px] object-cover"
                />
                <div className="absolute left-0 top-0 h-full w-full rounded-[20px] border border-black/[.08]" />
              </div>
              <div className="flex flex-col items-start text-sm leading-5">
                <div className="font-normal text-black">{file.title}</div>
                <div className="font-light text-[#5a5a5a]">{file.author}</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
