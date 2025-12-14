'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons';
import { Button } from '@/components/ui';

type User = {
  name: string;
  avatar: string;
  username: string;
};

const users: User[] = [
  {
    name: 'Fudail',
    avatar: '/avatars/fudail.png',
    username: 'fudail',
  },
  {
    name: 'Zainab',
    avatar: '/avatars/zainab-zafar.png',
    username: 'zainab-zafar',
  },
  {
    name: 'Arshee',
    avatar: '/avatars/arshee-fathima-tp8kj3.png',
    username: 'arshee-fathima-tp8kj3',
  },
  {
    name: 'Demo',
    avatar: '/avatars/demo.png',
    username: 'demo',
  },
  {
    name: 'Fareeha',
    avatar: '/avatars/fareeha.png',
    username: 'fareeha',
  },
  {
    name: 'Sabeer',
    avatar: '/avatars/sabeerg.png',
    username: 'sabeerg',
  },
  {
    name: 'Khadhija',
    avatar: '/avatars/khadhija.png',
    username: 'khadhija',
  },
  {
    name: 'Taylor',
    avatar: '/avatars/fudail.png',
    username: 'taylor',
  },
  {
    name: 'Jordan',
    avatar: '/avatars/fudail.png',
    username: 'jordan',
  },
  {
    name: 'Morgan',
    avatar: '/avatars/fudail.png',
    username: 'morgan',
  },
];

export function Avatars() {
  return (
    <section className="mb-10 mt-40 flex flex-col items-center justify-center md:mt-80">
      <h2 className="mb-6 text-center text-[28px] font-bold text-[#333333]">
        <span className="hidden sm:inline">
          Join thousands of inspiring creatives
        </span>
        <span className="block sm:hidden">
          <p className="-mb-2">Join hundreds of </p>
          <p>inspiring creatives</p>
        </span>
      </h2>
      {/* Responsive avatar rows */}
      <div className="mb-8">
        {/* Large screens: single row */}
        <div className="hidden gap-4 sm:flex">
          {users.map((user, i) => (
            <a
              key={i}
              href={`/${user.username}`}
              className="group relative flex cursor-pointer flex-col items-center"
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 15L15 5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 5H15V13"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
        {/* Small screens: two rows of 5 */}
        <div className="flex flex-col gap-4 sm:hidden">
          <div className="flex justify-center gap-4">
            {users.slice(0, 5).map((user, i) => (
              <a
                key={i}
                href={`/${user.username}`}
                className="group relative flex cursor-pointer flex-col items-center"
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
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 15L15 5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 5H15V13"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            {users.slice(5, 10).map((user, i) => (
              <a
                key={i}
                href={`/${user.username}`}
                className="group relative flex cursor-pointer flex-col items-center"
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
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 15L15 5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 5H15V13"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <Link href={'/explore'}>
        <Button className="rounded-lg bg-[#f6f6f6] p-3 text-base text-black transition-all hover:bg-[#EBEBEB] active:scale-95 active:bg-[#dbdbdb]">
          Explore the most creative Portfolios <ArrowRightIcon />
        </Button>
      </Link>
    </section>
  );
}
