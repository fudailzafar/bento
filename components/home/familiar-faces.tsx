'use client';

import Link from 'next/link';
import { ArrowRightIcon, ArrowTopRightIcon } from '@/components/icons';
import { Button } from '@/components/ui';

type User = {
  name: string;
  avatar: string;
  username: string;
};

const users: User[] = [
  {
    name: 'Fudail',
    avatar: '/home/familiar-faces/fudail.png',
    username: 'fudail',
  },
  {
    name: 'Zainab',
    avatar: '/home/familiar-faces/zainab-zafar.png',
    username: 'zainab-zafar',
  },
  {
    name: 'Arshee',
    avatar: '/home/familiar-faces/arshee-fathima-tp8kj3.png',
    username: 'arshee-fathima-tp8kj3',
  },
  {
    name: 'Demo',
    avatar: '/home/familiar-faces/demo.png',
    username: 'demo',
  },
  {
    name: 'Fareeha',
    avatar: '/home/familiar-faces/fareeha.png',
    username: 'fareeha',
  },
  {
    name: 'Sabeer',
    avatar: '/home/familiar-faces/sabeerg.png',
    username: 'sabeerg',
  },
  {
    name: 'Khadhija',
    avatar: '/home/familiar-faces/khadhija.png',
    username: 'khadhija',
  },
  {
    name: 'Taylor',
    avatar: '/home/familiar-faces/fudail.png',
    username: 'taylor',
  },
  {
    name: 'Jordan',
    avatar: '/home/familiar-faces/fudail.png',
    username: 'jordan',
  },
  {
    name: 'Morgan',
    avatar: '/home/familiar-faces/fudail.png',
    username: 'morgan',
  },
];

const FamiliarFacesHeading = () => {
  return (
    <>
      <h2 className="mb-6 text-center text-[28px] font-bold text-[#333333]">
        <span className="hidden sm:inline">
          Join thousands of inspiring creatives
        </span>
        <span className="block sm:hidden">
          <p className="-mb-2">Join thousands of </p>
          <p>inspiring creatives</p>
        </span>
      </h2>
    </>
  );
};

const FamiliarFacesButton = () => {
  return (
    <>
      <Link href={'/explore'}>
        <Button className="rounded-lg bg-[#f6f6f6] p-3 text-base text-black transition-all hover:bg-[#EBEBEB] active:scale-95 active:bg-[#dbdbdb]">
          Explore the most creative Portfolios <ArrowRightIcon />
        </Button>
      </Link>
    </>
  );
};

const FamiliarFacesAvatars = () => {
  return (
    <>
      {/* Responsive avatar rows */}
      <div className="mb-8">
        {/* Desktop - single row */}
        <div className="hidden gap-4 sm:flex">
          {users.map((user, i) => (
            <a
              key={i}
              href={`/${user.username}`}
              className="group relative flex cursor-pointer flex-col items-center transition-all active:scale-95"
            >
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-design-primaryLight px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                {user.name}
              </span>
              <div className="relative">
                <img
                  src={user.avatar}
                  alt=""
                  className="h-16 w-16 rounded-full object-cover shadow transition duration-200 group-hover:shadow-xl group-hover:brightness-50"
                />
                {/* North-east arrow icon, shown on hover */}
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-200 group-hover:opacity-100">
                  <ArrowTopRightIcon className="text-white" />
                </span>
              </div>
            </a>
          ))}
        </div>
        {/* Mobile Row Design */}
        <div className="flex flex-col gap-4 sm:hidden">
          {/* Row 1 */}
          <div className="flex justify-center gap-4">
            {users.slice(0, 5).map((user, i) => (
              <a
                key={i}
                href={`/${user.username}`}
                className="group relative flex cursor-pointer flex-col items-center transition-all active:scale-95"
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-design-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                  {user.name}
                </span>
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt=""
                    className="size-[55px] rounded-full border border-gray-200 object-cover shadow transition duration-200 group-hover:shadow-xl group-hover:brightness-50"
                  />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-200 group-hover:opacity-100">
                    <ArrowTopRightIcon className="text-white" />
                  </span>
                </div>
              </a>
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex justify-center gap-4">
            {users.slice(5, 10).map((user, i) => (
              <a
                key={i}
                href={`/${user.username}`}
                className="group relative flex cursor-pointer flex-col items-center transition-all active:scale-95"
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-design-black px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                  {user.name}
                </span>
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt=""
                    className="size-[55px] rounded-full border border-gray-200 object-cover shadow transition duration-200 group-hover:shadow-xl group-hover:brightness-50"
                  />
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-200 group-hover:opacity-100">
                    <ArrowTopRightIcon className="text-white" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export function FamiliarFaces() {
  return (
    <section className="mt-40 flex flex-col items-center justify-center md:mb-10 md:mt-80">
      <FamiliarFacesHeading />
      <FamiliarFacesAvatars />
      <FamiliarFacesButton />
    </section>
  );
}
