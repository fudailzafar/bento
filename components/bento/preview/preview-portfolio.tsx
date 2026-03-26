'use client';

import { Header } from './header';
import { SocialLinks } from './social-links';
import { LoadingFallback } from '@/components/utils';
import { PageData, Block } from '@/lib';
import { Settings } from '@/components/common';
import { BentoGrid } from '../grid';

interface PreviewPortfolioProps {
  page?: PageData | null;
  profilePicture?: string;
  isEditMode?: boolean;
  onChangePage?: (newPage: PageData) => void;
  onImageChange?: (newImageUrl: string | null) => void;
  username?: string;
  viewMode?: 'desktop' | 'mobile';
}

export const PreviewPortfolio = ({
  page,
  profilePicture,
  isEditMode = false,
  onChangePage,
  onImageChange,
  username,
  viewMode = 'desktop',
}: PreviewPortfolioProps) => {
  if (!page) {
    return <LoadingFallback message="Loading Portfolio..." />;
  }

  const handleBlocksChange = (newBlocks: Block[]) => {
    onChangePage?.({ ...page, blocks: newBlocks });
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col ${viewMode === 'mobile' ? 'flex-col' : 'xl:flex-row xl:gap-7'}`}
    >
      <section
        className={`top-0 w-full self-start bg-background pt-8 font-sans antialiased ${viewMode === 'mobile' ? 'w-full' : 'xl:sticky xl:w-[500px] xl:py-16'}`}
        aria-label="Preview Portfolio Header"
      >
        <Header
          header={{ name: page.name, headline: page.headline }}
          picture={profilePicture}
          isEditMode={isEditMode}
          username={username}
          viewMode={viewMode}
          onChangeHeader={
            isEditMode && onChangePage
              ? (newHeader) => {
                  onChangePage({
                    ...page,
                    name: newHeader.name,
                    headline: newHeader.headline,
                  });
                }
              : undefined
          }
          onImageChange={onImageChange}
        />
      </section>
      <section
        className={`relative w-full bg-background py-1 font-sans antialiased ${viewMode === 'mobile' ? 'w-full px-4' : 'xl:w-[860px] xl:px-4 xl:py-8'}`}
        aria-label="Preview Portfolio Content"
      >
        <div className="flex flex-col gap-6 xl:pb-36 relative">
          <div className="mt-10">
            <BentoGrid
              isEditMode={isEditMode}
              blocks={page.blocks || []}
              onBlocksChange={handleBlocksChange}
            />
          </div>

          <SocialLinks
            links={{
              website: page.website,
              github: page.github,
              linkedin: page.linkedin,
              twitter: page.twitter,
            }}
            isEditMode={isEditMode}
            onChangeLinks={
              isEditMode && onChangePage
                ? (newLinks) => {
                    onChangePage({ ...page, ...newLinks });
                  }
                : undefined
            }
          />

          {/* Mobile Header at bottom */}
          <Settings />
        </div>
      </section>
    </div>
  );
};
