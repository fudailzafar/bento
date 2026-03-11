'use client';

import { Header } from './header';
import { SocialLinks } from './social-links';
import { ResumeData } from '@/lib/server';
import { BentoGrid } from '../bento/bento-grid';

export const PublicPortfolio = ({
  resume,
  profilePicture,
}: {
  resume?: ResumeData | null;
  profilePicture?: string;
}) => {
  if (!resume) {
    return null;
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col px-5 xl:flex-row xl:gap-7 xl:px-10">
        <section
          className="top-0 w-full self-start bg-background pt-8 font-sans antialiased xl:sticky xl:w-[500px] xl:py-16"
          aria-label="Preview Portfolio Header"
        >
          <Header header={resume?.header} picture={profilePicture} />
        </section>
        <section
          className="w-full bg-background font-sans antialiased xl:w-[820px] xl:py-8"
          aria-label="Preview Portfolio Content"
        >
          <div className="flex flex-col gap-6">
            <div className="mt-10">
              <BentoGrid
                isEditMode={false}
                layoutData={resume?.layout || []}
              />
            </div>
            <SocialLinks contacts={resume?.header?.contacts} />
          </div>
        </section>
      </div>
    </>
  );
};
