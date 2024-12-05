'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

type User = {
  name: string;
  avatar: string;
  username: string;
};

const users: User[] = [
  {
    name: 'Rogie',
    avatar: '/avatars/me.png',
    username: 'rogie',
  },
  {
    name: 'Samarth',
    avatar: '/avatars/me.png',
    username: 'samarth',
  },
  {
    name: 'Samuel',
    avatar: '/avatars/me.png',
    username: 'samuel',
  },
  {
    name: 'Rocco',
    avatar: '/avatars/me.png',
    username: 'rocco',
  },
  {
    name: 'Jane',
    avatar: '/avatars/me.png',
    username: 'jane',
  },
  {
    name: 'Alex',
    avatar: '/avatars/me.png',
    username: 'alex',
  },
  {
    name: 'Chris',
    avatar: '/avatars/me.png',
    username: 'chris',
  },
  {
    name: 'Taylor',
    avatar: '/avatars/me.png',
    username: 'taylor',
  },
  {
    name: 'Jordan',
    avatar: '/avatars/me.png',
    username: 'jordan',
  },
  {
    name: 'Morgan',
    avatar: '/avatars/me.png',
    username: 'morgan',
  },
];

export function Avatars() {
  return (
    <section className="flex flex-col justify-center items-center my-10">
      <h2 className="text-3xl text-center flex justify-center items-center font-bold mb-6">
        Join thousands of inspiring professionals
      </h2>
      {/* Responsive avatar rows */}
      <div className="mb-8">
        {/* Large screens: single row */}
        <div className="hidden sm:flex gap-4">
          {users.map((user, i) => (
            <a
              key={i}
              href={`/${user.username}`}
              className="relative flex flex-col items-center group cursor-pointer"
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-design-black text-white text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition">
                {user.name}
              </span>
              <div className="relative">
                <img
                  src={user.avatar}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover shadow group-hover:shadow-xl group-hover:brightness-50 transition duration-200"
                />
                {/* North-east arrow icon, shown on hover */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
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
          <div className="flex gap-4 justify-center">
            {users.slice(0, 5).map((user, i) => (
              <a
                key={i}
                href={`/${user.username}`}
                className="relative flex flex-col items-center group cursor-pointer"
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-design-black text-white text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition">
                  {user.name}
                </span>
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt=""
                    className="size-[55px] rounded-full object-cover border border-gray-200 shadow group-hover:shadow-xl group-hover:brightness-50 transition duration-200"
                  />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
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
          <div className="flex gap-4 justify-center">
            {users.slice(5, 10).map((user, i) => (
              <a
                key={i}
                href={`/${user.username}`}
                className="relative flex flex-col items-center group cursor-pointer"
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-design-black text-white text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition">
                  {user.name}
                </span>
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt=""
                    className="size-[55px] rounded-full object-cover border border-gray-200 shadow group-hover:shadow-xl group-hover:brightness-50 transition duration-200"
                  />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
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
      <Button className="bg-gray-100 hover:bg-gray-200 text-base p-3 text-black">
        Explore the most inspiring Portfolios <ArrowRight />
      </Button>
    </section>
  );
}
