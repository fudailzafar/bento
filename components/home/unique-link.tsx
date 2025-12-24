'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Marquee } from '../ui';

const usernames = [
  'dennis',
  'michele',
  'eike',
  'may-li',
  'clara',
  'tito',
  'selim',
  'mary',
  'valerie',
  'mugeeb',
  'silvan',
  'adeline',
];

const UsernameCard = ({ username }: { username: string }) => {
  return (
    <div className="my-[-2px] whitespace-nowrap text-[26px] font-normal leading-none text-black md:my-[-2px] md:text-[46px]">
      {username}
    </div>
  );
};

const UniqueLinkHeading = () => {
  return (
    <>
      <h2 className="mb-2 text-center text-2xl font-semibold md:mb-[6px] md:text-[32px]">
        Your unique link.
      </h2>
      <p className="mb-6 text-center text-base font-light text-design-black md:mb-16">
        And btw, the good ones are still free.
      </p>
    </>
  );
};

const UniqueLinkBox = () => {
  return (
    <>
      <div className="relative mx-auto flex h-[200px] w-[330px] items-center justify-center overflow-hidden rounded-2xl bg-[#F8F8F8] sm:h-[496px] sm:w-[1100px] md:rounded-3xl md:border-2 md:border-[#F2F2F2] md:bg-[#FCFCFC]">
        {/* Username marquee and URL layout */}
        <div className="absolute left-0 top-1/2 flex h-full w-full -translate-y-1/2 flex-row items-center justify-center p-4 md:px-12">
          {/* portfoliofy.me/ on the left */}
          <div
            className="flex flex-col items-end justify-center pr-2"
            style={{ minWidth: '320px' }}
          >
            <div className="whitespace-nowrap text-[28px] font-normal text-[#AAAAAA] md:text-[46px]">
              portfoliofy.me/
            </div>
          </div>
          {/* Vertical marquee on the right, usernames close to slash */}
          <div className="relative flex h-[100px] min-w-[200px] flex-col items-start justify-center overflow-hidden md:h-[400px] md:min-w-[250px]">
            <Marquee vertical className="p-0 [--duration:25s]">
              {usernames.map((username) => (
                <UsernameCard key={username} username={username} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#F8F8F8] md:from-[#FCFCFC]"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#F8F8F8] md:from-[#FCFCFC]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

const UniqueLinkFloatingCards = () => {
  return (
    <>
      {/* Twitter - top left, rotated, overlapping */}
      <Image
        src="/home/unique-link/twitter.png"
        alt="Twitter card"
        width={175}
        height={175}
        className="absolute -top-10 left-32 z-20 hidden rotate-[-5deg] rounded-3xl shadow-[0_18px_44px_0_rgba(0,0,0,0.06)] xl:block"
      />

      {/* Substack - top right, rotated, overlapping */}
      <Image
        src="/home/unique-link/substack.png"
        alt="Substack card"
        width={175}
        height={175}
        className="absolute right-36 top-20 z-20 hidden rotate-[4deg] rounded-3xl shadow-[0_18px_44px_0_rgba(0,0,0,0.06)] xl:block"
      />

      {/* Spotify - bottom left, rotated, overlapping */}
      <Image
        src="/home/unique-link/spotify.png"
        alt="Spotify card"
        width={396}
        height={189}
        className="absolute -bottom-20 left-72 z-20 hidden rotate-[2deg] rounded-3xl shadow-[0_18px_44px_0_rgba(0,0,0,0.06)] xl:block"
      />
    </>
  );
};

const UniqueLinkButton = () => {
  return (
    <>
      <div className="flex mt-12 items-center justify-center">
        <Link href="/signup">
          <Button className="group relative mb-2 flex cursor-pointer items-center rounded-[14px] bg-design-primary px-20 lg:w-[300px] lg:h-[62px] py-8 text-lg font-semibold shadow-md transition-transform hover:bg-design-primaryDark active:scale-95 sm:px-14 sm:py-8">
            Create Your Portfolio
          </Button>
        </Link>
      </div>
    </>
  );
};

export function UniqueLink() {
  return (
    <>
      <section className="mb-24 flex flex-col items-center justify-center py-16">
        <UniqueLinkHeading />
        <div className="relative flex w-full items-center justify-center">
          <UniqueLinkBox />
          <UniqueLinkFloatingCards />
        </div>
      </section>
      <UniqueLinkButton />
    </>
  );
}
