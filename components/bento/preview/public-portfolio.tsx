'use client';

import { Header } from './header';
import { SocialLinks } from './social-links';
import { PageData } from '@/lib';
import { BentoGrid } from '../grid';

export const PublicPortfolio = ({
  page,
  profilePicture,
}: {
  page?: PageData | null;
  profilePicture?: string;
}) => {
  if (!page) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 xl:flex-row xl:gap-7 xl:px-10">
      <section
        className="top-0 w-full self-start bg-background pt-8 font-sans antialiased xl:sticky xl:w-[500px] xl:py-16"
        aria-label="Preview Portfolio Header"
      >
        <Header
          header={{ name: page.name, headline: page.headline }}
          picture={profilePicture}
        />
      </section>
      <section
        className="w-full bg-background font-sans antialiased xl:w-[820px] xl:py-8"
        aria-label="Preview Portfolio Content"
      >
        <div className="flex flex-col gap-6">
          <div className="mt-10">
            <BentoGrid isEditMode={false} blocks={page.blocks || []} />
          </div>
          <SocialLinks
            links={{
              website: page.website,
              github: page.github,
              linkedin: page.linkedin,
              twitter: page.twitter,
            }}
          />
        </div>
      </section>
    </div>
  );
};
