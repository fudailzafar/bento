import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// bento's team pages (bento.me/home/<name>): the logo, a one-line caption and
// a single photo. Add a teammate here to give them a page at /home/<key>.
const members: Record<
  string,
  { name: string; caption: string; photo: string; width: number; height: number }
> = {
  mugeeb: {
    name: 'Mugeeb',
    caption:
      'Mugeeb, Co-founder of Bento.\nSeen here spending an irresponsible amount of time getting an animation just right.',
    photo: '/home/mugeeb/mugeeb.jpeg',
    width: 1600,
    height: 1066,
  },
};

type Props = { params: Promise<{ member: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const member = members[(await params).member];
  return { title: member?.name ?? 'Portfoliofy' };
}

export function generateStaticParams() {
  return Object.keys(members).map((member) => ({ member }));
}

export default async function MemberPage({ params }: Props) {
  const member = members[(await params).member];
  if (!member) notFound();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-20 bg-white px-6 py-[200px] text-sm leading-5 text-[#333] max-[479px]:py-[120px]">
      <div className="flex w-[224px] max-w-full flex-col items-center">
        <Image
          src="/icons/android-chrome-192x192.png"
          alt="Portfoliofy"
          width={45}
          height={45}
          priority
        />
        <h1 className="mb-2.5 mt-5 max-w-[400px] whitespace-pre-line text-center text-base font-normal leading-[22px] text-[#8f8f8f]">
          {member.caption}
        </h1>
      </div>
      <Image
        src={member.photo}
        alt={member.name}
        width={member.width}
        height={member.height}
        priority
        className="h-auto w-[800px] max-w-full"
      />
    </div>
  );
}
