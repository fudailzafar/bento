import Image from 'next/image';
import { CreateYourBentoButton } from './home-hero';

const usernames = [
  'tito',
  'selim',
  'mary',
  'valerie',
  'mugeeb',
  'silvan',
  'adeline',
  'dennis',
  'michele',
  'eike',
  'may-li',
  'clara',
];

const CARD = 'absolute rounded-[28px] shadow-[0_18px_44px_rgba(0,0,0,.06)]';

function UniqueLinkHeading() {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <h2 className="m-0 flex text-center text-[32px] font-semibold leading-9 text-black max-[479px]:text-2xl max-[479px]:leading-8">
        Your unique link.
      </h2>
      <p className="m-0 flex text-center text-base font-light leading-6 text-black">
        And btw, the good ones are still free.
      </p>
    </div>
  );
}

function UniqueLinkBox() {
  return (
    <div className="relative mb-20 flex h-[496px] w-[1096px] items-center justify-center gap-1 rounded-3xl border-2 border-black/[.04] bg-[#fcfcfc] max-[991px]:w-full max-[991px]:border-none max-[991px]:bg-white max-[479px]:mt-5 max-[479px]:h-[220px] max-[479px]:gap-2 max-[479px]:rounded-2xl max-[479px]:bg-[#f8f8f8]">
      <div className="m-0 flex text-left text-[46px] font-normal leading-[54px] text-[#aaa] max-[479px]:text-[32px] max-[479px]:leading-[48px]">
        bento.me/
      </div>
      <div className="relative flex max-h-[400px] flex-col justify-center overflow-hidden max-[479px]:max-h-[140px]">
        <div className="bento-username-carousel flex h-full flex-col gap-1">
          {[...usernames, ...usernames].map((username, i) => (
            <div
              key={i}
              className="m-0 flex text-left text-[46px] font-normal leading-[54px] text-black max-[479px]:text-[32px] max-[479px]:leading-[48px]"
            >
              {username}
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-0 h-[40%] w-full bg-[linear-gradient(#fcfcfc,rgba(252,252,252,0))] max-[479px]:bg-[linear-gradient(#f8f8f8,rgba(248,248,248,0))]" />
        <div className="absolute bottom-0 left-0 h-[40%] w-full bg-[linear-gradient(rgba(252,252,252,0),#fcfcfc)] max-[479px]:bg-[linear-gradient(rgba(248,248,248,0),#f8f8f8)]" />
      </div>

      <div
        className={`${CARD} -bottom-[15%] left-[10%] rotate-2 max-[991px]:left-[6%] max-[479px]:hidden`}
      >
        <Image
          src="/home/bento/spotifywidget2.png"
          alt=""
          width={390}
          height={175}
          className="block w-[390px] max-[991px]:hidden"
        />
      </div>
      <div
        className={`${CARD} -left-[6%] -top-[9%] -rotate-[5deg] max-[991px]:left-[6%] max-[479px]:hidden`}
      >
        <Image
          src="/home/bento/hero-twitter.png"
          alt=""
          width={175}
          height={175}
          className="block w-[175px] max-[991px]:hidden"
        />
      </div>
      <div
        className={`${CARD} -right-[4%] top-[16%] rotate-[4deg] max-[991px]:-right-[6%] max-[479px]:hidden`}
      >
        <Image
          src="/home/bento/substackwidget2.png"
          alt=""
          width={175}
          height={175}
          className="block w-[175px]"
        />
      </div>
    </div>
  );
}

export function UniqueLink() {
  return (
    <section className="mx-auto mt-[260px] flex w-[1600px] max-w-full flex-col items-center justify-center gap-[72px] pb-[50px] max-[479px]:mt-[180px] max-[479px]:gap-0 max-[479px]:px-6">
      <UniqueLinkHeading />
      <UniqueLinkBox />
      <div className="mt-16 max-[479px]:w-full">
        <CreateYourBentoButton />
      </div>
    </section>
  );
}
