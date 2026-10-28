import Link from 'next/link';
import Image from 'next/image';

// Mirrors bento.me/explore's top bar (.home-link-top) and page title.
export function HeaderExplore() {
  return (
    <>
      <div className="relative mx-auto mb-6 flex w-full max-w-[1532px] items-center justify-between gap-3 rounded-xl bg-white px-[58px] py-14 max-[991px]:p-8 max-[479px]:mb-7 max-[479px]:p-6">
        <div className="flex items-center gap-10 max-[479px]:gap-6">
          <Link href="/" className="block">
            <Image
              src="/icons/android-chrome-192x192.png"
              alt="Portfoliofy logo"
              width={40}
              height={40}
              className="relative block w-10 max-[479px]:w-9"
            />
          </Link>
          <a
            href="#featured"
            className="text-base leading-[22px] text-[#757575] no-underline transition-all [transition-duration:160ms] [transition-timing-function:cubic-bezier(.421,.013,.25,1)] hover:text-[#5a5a5a] active:scale-[.92] active:text-[#303030]"
          >
            Featured
          </a>
          <a
            href="#communityfiles"
            className="text-base leading-[22px] text-[#757575] no-underline transition-all [transition-duration:160ms] [transition-timing-function:cubic-bezier(.421,.013,.25,1)] hover:text-[#5a5a5a] active:scale-[.92] active:text-[#303030]"
          >
            Files
          </a>
        </div>
        <Link
          href="/signup"
          className="block rounded-md bg-design-primaryLight py-3 pl-6 pr-5 no-underline shadow-[0_2px_4px_rgba(0,0,0,.08)] transition-all [transition-duration:240ms] [transition-timing-function:cubic-bezier(.444,.026,.25,1)] hover:bg-[#5c74ee] active:scale-[.96] active:bg-[#4b62db] active:shadow-[0_1px_2px_rgba(0,0,0,.2)] max-[479px]:pr-6"
        >
          <span className="block font-semibold leading-[17px] text-white">
            Sign Up
          </span>
        </Link>
      </div>
      <h1 className="mx-auto mb-14 w-full max-w-[1532px] px-14 text-[32px] font-bold leading-10 text-black max-[991px]:mb-10 max-[991px]:px-8 max-[479px]:flex max-[479px]:px-6">
        Get inspired by the most creative Bentos.
      </h1>
    </>
  );
}
