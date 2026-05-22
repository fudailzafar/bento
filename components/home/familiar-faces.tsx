'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type User = {
  name: string;
  avatar: string;
  href: string;
};

// bento.me/home's creatives, linking to their Bentos.
const F = '/home/creatives';
const users: User[] = [
  { name: 'Rogie', avatar: `${F}/rogie.png`, href: 'http://bento.me/rogie' },
  {
    name: 'Josh Miller',
    avatar: `${F}/josh-miller.jpg`,
    href: 'http://bento.me/browsercompany',
  },
  {
    name: 'Andreas Storm',
    avatar: `${F}/andreas-storm.png`,
    href: 'http://bento.me/storm',
  },
  {
    name: 'Greg Isenberg',
    avatar: `${F}/greg-isenberg.jpg`,
    href: 'http://bento.me/greg',
  },
  {
    name: 'Tru Narla',
    avatar: `${F}/tru-narla.jpg`,
    href: 'http://bento.me/mewtru',
  },
  {
    name: 'Josh Dunsterville',
    avatar: `${F}/josh-dunsterville.jpg`,
    href: 'http://bento.me/josh',
  },
  {
    name: 'Hustlerani',
    avatar: `${F}/hustlerani.png`,
    href: 'http://bento.me/hustlerani',
  },
  {
    name: 'Andy Adams',
    avatar: `${F}/andy-adams.jpg`,
    href: 'http://bento.me/flakphoto',
  },
  { name: 'Micode', avatar: `${F}/micode.jpg`, href: 'http://bento.me/micode' },
  {
    name: 'Jordi Bruin',
    avatar: `${F}/jordi-bruin.png`,
    href: 'http://bento.me/jordi',
  },
];

function FamiliarFacesHeading() {
  return (
    <>
      <h2 className="mb-[30px] mt-2.5 text-center text-[28px] font-bold leading-9 text-[#333333]">
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
}

function FamiliarFacesButton() {
  return (
    <>
      <Link
        href={'/explore'}
        className="mt-10 flex items-center gap-2 rounded-lg bg-[#f6f6f6] px-3 py-2.5 transition-all duration-200 [transition-timing-function:cubic-bezier(.474,.009,.25,1)] hover:bg-[#ebebeb] active:scale-[.97] active:bg-[#dbdbdb]"
      >
        <span className="text-base font-medium leading-5 text-black">
          Explore the most creative Bentos
        </span>
        <img src="/home/bento/miniarrow.svg" alt="" />
      </Link>
    </>
  );
}

// bento's avatar link: a hairline ring, and on hover a dark overlay, the
// arrow sliding in from the bottom left and the name pill above.
function Avatar({ user, size }: { user: User; size: string }) {
  return (
    <a
      href={user.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex shrink-0 transition-transform duration-200 active:scale-95',
        size
      )}
    >
      <img
        src={user.avatar}
        alt=""
        className="size-full rounded-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.06)]" />
      <span className="pointer-events-none absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-40" />
      <img
        src="/home/bento/arrowwhite.svg"
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-2 -mt-2 size-4 -translate-x-0.5 translate-y-0.5 opacity-0 transition duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
      />
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#768CFF] px-3.5 py-1.5 text-[10px] font-medium leading-[14px] text-white opacity-0 shadow-[0_3px_3px_rgba(0,0,0,.04),0_15px_10px_rgba(0,0,0,.06),0_40px_31px_rgba(0,0,0,.08)] transition-opacity duration-200 group-hover:opacity-100">
        {user.name}
      </span>
    </a>
  );
}

function FamiliarFacesAvatars() {
  return (
    <>
      {/* Desktop - single row */}
      <div className="hidden gap-4 sm:flex">
        {users.map((user) => (
          <Avatar key={user.name} user={user} size="size-16" />
        ))}
      </div>
      {/* Mobile - two rows of five */}
      <div className="flex flex-col gap-4 sm:hidden">
        {[users.slice(0, 5), users.slice(5, 10)].map((row, i) => (
          <div key={i} className="flex justify-center gap-4">
            {row.map((user) => (
              <Avatar key={user.name} user={user} size="size-[55px]" />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export function FamiliarFaces() {
  return (
    <section className="relative z-10 mt-[300px] flex flex-col items-center justify-start max-[479px]:mt-10">
      <FamiliarFacesHeading />
      <FamiliarFacesAvatars />
      <FamiliarFacesButton />
    </section>
  );
}
