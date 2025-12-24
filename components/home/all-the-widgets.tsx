'use client';

import Image from 'next/image';
import Link from 'next/link';

export const AllTheWidgetsHeading = () => {
  return (
    <>
      <div className="max-w-[340px] text-center text-[40px] font-bold leading-tight sm:text-6xl md:max-w-full">
        <div
          className="bg-gradient-to-b from-black to-gray-400 bg-clip-text leading-tight text-transparent md:leading-[70px]"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 20%, transparent 95%)',
            maskImage: 'linear-gradient(to bottom, black 55%, transparent 92%)',
          }}
        >
          Your Videos. Podcasts.
          <br />
          Newsletters. Photos.
          <br />
          Paid Products. Streams.
          <br />
          Calendar.
        </div>
      </div>
      <div className="mx-auto flex max-w-[350px] flex-col text-center text-[26px] font-light text-gray-700 md:mt-12 md:max-w-full md:gap-y-2 md:text-3xl">
        <p>All your content integrated into your personal page.</p>
      </div>
      <div className="mx-auto max-w-[340px] text-center text-[26px] font-light text-gray-700 md:mt-2 md:max-w-full md:text-3xl">
        <p>No more hiding your content behind links.</p>
      </div>
    </>
  );
};

export const AllTheWidgetsGrid = () => {
  return (
    <div className="relative mx-auto mb-24 px-6 md:px-4">
      {/* Mobile Grid */}
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-2 gap-6 md:hidden">
        {/* YouTube Widget */}
        <Link
          href="https://www.youtube.com/@Oliur/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 cursor-pointer overflow-hidden rounded-[23px] shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2 md:rounded-3xl"
        >
          <Image
            src="/home/all-the-widgets/youtube-mobile.png"
            alt=""
            width={327}
            height={327}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* Medium Widget */}
        <Link
          href="https://jannabarrett.medium.com"
          target="_blank"
          rel="noopener noreferrer"
          className="row-span-2 cursor-pointer overflow-hidden rounded-[20px] shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:rotate-2"
        >
          <Image
            src="/home/all-the-widgets/medium-mobile.png"
            alt=""
            width={175}
            height={390}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* Dribble Widget */}
        <Link
          href="https://dribbble.com/Gavin"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[152px] cursor-pointer overflow-hidden rounded-2xl transition-all hover:rotate-2"
        >
          <Image
            src="/home/all-the-widgets/dribble-mobile.png"
            alt=""
            width={152}
            height={152}
            className="h-full w-full object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)]"
          />
        </Link>

        {/* Spotify Widget */}
        <Link
          href="https://open.spotify.com/episode/776Sr5qTjunPv2dNkQoODq"
          target="_blank"
          rel="noopener noreferrer"
          className="row-span-2 cursor-pointer overflow-hidden rounded-[20px] shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:rotate-2"
        >
          <Image
            src="/home/all-the-widgets/spotify.png"
            alt=""
            width={175}
            height={390}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* BuyMeACoffee Widget */}
        <Link
          href="https://www.patreon.com/KevinNaughtonJr"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[152px] cursor-pointer overflow-hidden rounded-lg transition-all hover:rotate-2"
        >
          <Image
            src="/home/all-the-widgets/buymeacoffee-mobile.png"
            alt=""
            width={152}
            height={152}
            className="h-full w-full object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)]"
          />
        </Link>

        {/* Calendly Widget */}
        <Link
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 cursor-pointer overflow-hidden rounded-2xl transition-all hover:-rotate-2 md:rounded-3xl"
        >
          <Image
            src="/home/all-the-widgets/calendly-mobile.png"
            alt=""
            width={327}
            height={327}
            className="h-full w-full object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)]"
          />
        </Link>

        {/* Mugeeb Widget */}
        <Link
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="c col-span-2"
        >
          <Image
            src="/home/all-the-widgets/mugeeb-mobile.png"
            alt=""
            width={390}
            height={175}
            className="h-full w-full cursor-pointer overflow-hidden rounded-[20px] object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2 md:h-[175px] md:rounded-3xl"
          />
        </Link>

        {/* Figma Widget */}
        <Link
          href="https://www.figma.com/community/file/1121065701252736567/ios-16-ui-kit-for-figma"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2"
          style={{
            cursor: 'url(/home/all-the-widgets/figma-cursor.png), pointer',
          }}
        >
          <Image
            src="/home/all-the-widgets/figma-mobile.png"
            alt=""
            width={390}
            height={70}
            className="h-[56px] w-full cursor-pointer rounded-[20px] object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2 md:rounded-3xl"
          />
        </Link>
      </div>

      {/* Desktop Grid */}
      <div className="relative mx-auto hidden max-w-[1280px] grid-cols-6 gap-10 md:grid">
        {/* Column 1 - Medium & Spotify widgets */}
        <div className="col-span-1 flex w-full flex-col gap-5 md:w-[175px] md:gap-10">
          {/* Medium Widget */}
          <Link
            href="https://jannabarrett.medium.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/home/all-the-widgets/medium.png"
              alt=""
              width={175}
              height={390}
              className="hidden h-full w-full cursor-pointer overflow-hidden rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:rotate-2 md:block md:h-[390px] md:rounded-3xl"
            />
          </Link>

          {/* Decorative spacer */}
          <div className="hidden h-[175px] overflow-hidden rounded-2xl bg-[#F2FFFE] md:block md:rounded-3xl"></div>

          {/* Spotify Widget */}
          <Link
            href="https://open.spotify.com/episode/776Sr5qTjunPv2dNkQoODq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/home/all-the-widgets/spotify.png"
              alt=""
              width={175}
              height={390}
              className="hidden h-full w-full cursor-pointer overflow-hidden rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:rotate-2 md:block md:h-[390px] md:rounded-3xl"
            />
          </Link>
        </div>

        {/* Column 2 & 3 - Apple, Calendly, Mugeeb, App Store widgets */}
        <div className="col-span-2 flex w-[390px] flex-col gap-5 md:gap-10">
          {/* Decorative spacer */}
          <div className="h-[175px] w-[175px] self-end overflow-hidden rounded-3xl bg-[#FFFBF1] transition-all"></div>

          {/* Apple Widget */}
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Image
              src="/home/all-the-widgets/apple.png"
              alt=""
              width={390}
              height={390}
              className="h-[390px] w-full cursor-pointer overflow-hidden rounded-3xl bg-blue-50 object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2"
            />
          </Link>

          {/* Calendly Widget */}
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Image
              src="/home/all-the-widgets/calendly.png"
              alt=""
              width={390}
              height={390}
              className="hover:-rotate-2˝ h-[390px] w-full cursor-pointer overflow-hidden rounded-3xl bg-gray-100 object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2"
            />
          </Link>

          {/* Mugeeb Widget */}
          <Link href="#" target="_blank" rel="noopener noreferrer">
            <Image
              src="/home/all-the-widgets/mugeeb.png"
              alt=""
              width={390}
              height={175}
              className="h-[175px] w-full cursor-pointer overflow-hidden rounded-3xl bg-gray-50 object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-1"
            />
          </Link>

          {/* App Store Widget */}
          <Link
            href="https://apps.apple.com/de/app/camcord-vlog-your-life/id6443458187"
            target="_blank"
            rel="noopener noreferrer"
            className="self-end"
          >
            <Image
              src="/home/all-the-widgets/appstore.png"
              alt=""
              width={175}
              height={175}
              className="h-[175px] w-[175px] overflow-hidden rounded-3xl bg-gray-50 object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2"
            />
          </Link>
        </div>

        {/* Column 4 & 5 - YouTube, Figma, GitHub, Maps widgets */}
        <div className="col-span-2 flex w-full flex-col gap-5 md:col-span-2 md:w-[390px] md:gap-10">
          {/* YouTube Widget */}
          <Link
            href="https://www.youtube.com/@Oliur/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer overflow-hidden rounded-2xl transition-all hover:-rotate-2 md:h-[390px] md:rounded-3xl"
          >
            <Image
              src="/home/all-the-widgets/youtube.png"
              alt=""
              width={390}
              height={390}
              className="hidden h-full w-full object-cover md:block"
            />
          </Link>

          {/* GitHub Widget */}
          <Link
            href="https://github.com/CompVis/stable-diffusion"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/home/all-the-widgets/github.png"
              alt=""
              width={390}
              height={175}
              className="hidden h-[200px] w-full cursor-pointer overflow-hidden rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-1 md:block md:h-[175px] md:rounded-3xl"
            />
          </Link>

          {/* The Verge Widget */}
          <Link
            href="https://www.theverge.com/23298275/apple-severance-ben-stiller-ratings-viewers-emmys"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/home/all-the-widgets/theverge.png"
              alt=""
              width={390}
              height={390}
              className="hidden h-[300px] w-full cursor-pointer overflow-hidden rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2 md:block md:h-[390px] md:rounded-3xl"
            />
          </Link>

          {/* Google Maps Widget  */}
          <Link
            href="https://www.google.com/maps/place/Berlin/@52.5069704,13.2846518,11z/data=!3m1!4b1!4m5!3m4!1s0x47a84e373f035901:0x42120465b5e3b70!8m2!3d52.5200066!4d13.404954"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/home/all-the-widgets/map.png"
              alt=""
              width={390}
              height={390}
              className="hidden h-[300px] w-full cursor-pointer overflow-hidden rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2 md:block md:h-[390px] md:rounded-3xl"
            />
          </Link>

          {/* Figma Widget + custom cursor */}
          <Link
            href="https://www.figma.com/community/file/1121065701252736567/ios-16-ui-kit-for-figma"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              cursor: 'url(/home/all-the-widgets/figma-cursor.png), pointer', // Custom 32x32px cursor
            }}
          >
            <Image
              src="/home/all-the-widgets/figma.png"
              alt=""
              width={390}
              height={70}
              className="h-[56px] w-full rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:-rotate-2 md:block md:h-[67px] md:rounded-3xl"
            />
          </Link>
        </div>

        {/* Column 6 - Instagram & Product Hunt widgets */}
        <div className="col-span-1 flex w-full flex-col gap-5 md:w-[175px] md:gap-10">
          {/* Decorative spacer */}
          <div className="hidden h-[175px] overflow-hidden rounded-2xl bg-[#FFF8F7] md:block md:rounded-3xl"></div>

          {/* White spacer */}
          <div className="hidden h-[175px] overflow-hidden rounded-2xl bg-white md:block md:rounded-3xl"></div>

          {/* Instagram Widget */}
          <Link
            href="https://www.instagram.com/rogie"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/home/all-the-widgets/instagram.png"
              alt=""
              width={175}
              height={390}
              className="hidden h-[300px] w-full cursor-pointer overflow-hidden rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:rotate-2 md:block md:h-[390px] md:rounded-3xl"
            />
          </Link>

          {/* White spacer */}
          <div className="hidden h-[175px] overflow-hidden rounded-2xl bg-white md:block md:rounded-3xl"></div>

          {/* Product Hunt Widget */}
          <Link
            href="https://www.producthunt.com/products/bento-22a484ea-84c2-42e5-9739-4bd97b040659?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-bento-7&launch=bento-7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/home/all-the-widgets/producthunt.png"
              alt=""
              width={175}
              height={175}
              className="hidden h-[200px] w-full cursor-pointer overflow-hidden rounded-2xl object-cover shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all hover:rotate-2 md:block md:h-[175px] md:rounded-3xl"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export function AllTheWidgets() {
  return (
    <>
      <div className="mx-auto mt-[210px] md:mt-[190px] flex flex-col items-center justify-center">
        <div className="relative flex w-full flex-col items-center">
          <AllTheWidgetsHeading />
          <div className="mt-28">
            <AllTheWidgetsGrid />
          </div>
        </div>
      </div>
    </>
  );
}
