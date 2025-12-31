'use client';

import Image from 'next/image';

export function AllTheWidgets() {
  return (
    <div className="relative mx-auto mb-24 px-4">
      {/* Header Section */}
      <div className="mb-12 flex flex-col items-center">
        <div className="relative mb-8 max-w-3xl text-center">
          <h1
            className="mb-4 bg-gradient-to-b from-black to-gray-400 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-6xl"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, black 20%, transparent 95%)',
              maskImage:
                'linear-gradient(to bottom, black 55%, transparent 92%)',
            }}
          >
            Your Videos. Podcasts. Newsletters. Photos. Paid Products. Streams.
            Calendar.
          </h1>
        </div>
        <h2 className="max-w-2xl text-center text-xl font-normal text-black md:text-2xl">
          All your content integrated into your personal page.
          <br />
          No more hiding your content behind links.
        </h2>
      </div>

      {/* Widget Grid */}
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-6 gap-7">
        {/* Column 1 - Tall widgets */}
        <div className="col-span-1 w-[175px] flex flex-col gap-5">
          <div className="h-[390px] overflow-hidden rounded-3xl bg-gray-100">
            <Image src="" alt="" width={175} height={390} className="h-full w-full object-cover" />
          </div>
          <div className="h-[175px] overflow-hidden rounded-3xl bg-[#F2FFFE]"></div>
          <div className="h-[390px] overflow-hidden rounded-3xl bg-gray-100">
            <Image src="" alt="" width={175} height={390} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Column 2 & 3 - Large center widgets */}
        <div className="col-span-2 w-[390px] flex flex-col gap-5">
          <div className="h-[175px] w-[175px] self-end overflow-hidden rounded-3xl bg-[#FFFBF1]"></div>
          <div className="h-[390px] overflow-hidden rounded-3xl bg-blue-50">
            <Image src="" alt="" width={390} height={390} className="h-full w-full object-cover" />
          </div>
          <div className="h-[390px] overflow-hidden rounded-3xl bg-gray-100">
            <Image src="" alt="" width={390} height={390} className="h-full w-full object-cover" />
          </div>
          <div className="h-[175px] overflow-hidden rounded-3xl bg-gray-50">
            <Image src="" alt="" width={390} height={175} className="h-full w-full object-cover" />
          </div>
          <div className="h-[175px] w-[175px] self-end overflow-hidden rounded-3xl bg-gray-50">
            <Image src="" alt="" width={175} height={175} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Column 4 & 5 - Large center widgets */}
        <div className="col-span-2 w-[390px] flex flex-col gap-5">
          <div className="h-[390px] overflow-hidden rounded-3xl bg-red-50">
            <Image src="" alt="" width={390} height={390} className="h-full w-full object-cover" />
          </div>
          <div className="h-[175px] overflow-hidden rounded-3xl bg-gray-100">
            <Image src="" alt="" width={390} height={175} className="h-full w-full object-cover" />
          </div>
          <div className="h-[390px] overflow-hidden rounded-3xl bg-purple-50">
            <Image src="" alt="" width={390} height={390} className="h-full w-full object-cover" />
          </div>
          <div className="h-[390px] overflow-hidden rounded-3xl bg-purple-50">
            <Image src="" alt="" width={390} height={390} className="h-full w-full object-cover" />
          </div>
          <div className="h-[70px] overflow-hidden rounded-3xl bg-gray-100">
            <Image src="" alt="" width={390} height={70} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Column 6 - Right side widgets */}
        <div className="col-span-1 w-[175px] flex flex-col gap-5">
          <div className="h-[175px] overflow-hidden rounded-3xl bg-[#FFF8F7]"></div>
          <div className="h-[195px] overflow-hidden rounded-3xl bg-white"></div>
          <div className="h-[390px] overflow-hidden rounded-3xl bg-gray-100">
            <Image src="" alt="" width={175} height={390} className="h-full w-full object-cover" />
          </div>
          <div className="h-[175px] overflow-hidden rounded-3xl bg-white"></div>
          <div className="h-[175px] overflow-hidden rounded-3xl bg-gray-100">
            <Image src="" alt="" width={175} height={175} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
