import { Footer, HomeNavbar } from '@/components/home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfoliofy - Changelog',
};

// Newest first. Add an entry here when a release ships.
const releases = [
  {
    date: 'October 30, 2026',
    title: 'Edit everything in place',
    items: [
      'Widgets are edited right on the grid, with a floating toolbar for sizes, colours, alignment and links.',
      'Paste or drop a link, image or video anywhere to add it as a widget.',
      'Link tiles show page previews; YouTube, Vimeo, Spotify and SoundCloud play inline.',
      'Crop avatars and images, and upload short looping videos.',
      'Share your page with a QR code, and see your views and link clicks.',
    ],
  },
  {
    date: 'October 29, 2026',
    title: 'New sign-in pages',
    items: [
      'Rebuilt log in, sign up, reset-password and set-password pages.',
      'Claim pages for taken and reserved usernames.',
    ],
  },
  {
    date: 'October 28, 2026',
    title: 'Explore and Join the team',
    items: [
      'A new Explore page with the most creative portfolios.',
      'A Join the team page.',
    ],
  },
  {
    date: 'May 26, 2026',
    title: 'Bento grid',
    items: [
      'Portfolios moved from fixed sections to a flexible grid of widgets.',
      'Usernames are generated automatically when you sign up.',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="flex w-full flex-col items-center overflow-x-clip bg-white">
      <HomeNavbar alwaysVisible href="/" />
      <main className="mx-auto mt-40 w-[640px] max-w-full px-6 max-[479px]:mt-28">
        <h1 className="mb-16 text-center text-[38px] font-bold leading-[48px] text-[#333] max-[479px]:text-[30px] max-[479px]:leading-10">
          Changelog
        </h1>
        <ol className="flex flex-col gap-14">
          {releases.map((release) => (
            <li key={release.date}>
              <p className="text-sm font-medium text-[#6f6f6f]">
                {release.date}
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#333]">
                {release.title}
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base leading-6 text-[#333]">
                {release.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </div>
  );
}
