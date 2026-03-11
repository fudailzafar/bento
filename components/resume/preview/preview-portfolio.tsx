'use client';

import { Header } from './header';
import { SocialLinks } from './social-links';
import { LoadingFallback } from '@/components/utils';
import { ResumeData } from '@/lib/server';
import { Settings } from '@/components/common';
import { BentoGrid, GridWidgetData } from '../bento/bento-grid';
import { Plus } from 'lucide-react';

interface PreviewPortfolioProps {
  resume?: ResumeData | null;
  profilePicture?: string;
  isEditMode?: boolean;
  onChangeResume?: (newResume: ResumeData) => void;
  onImageChange?: (newImageUrl: string | null) => void;
  username?: string;
  viewMode?: 'desktop' | 'mobile';
}

export const PreviewPortfolio = ({
  resume,
  profilePicture,
  isEditMode = false,
  onChangeResume,
  onImageChange,
  username,
  viewMode = 'desktop',
}: PreviewPortfolioProps) => {
  if (!resume) {
    return <LoadingFallback message="Loading Portfolio..." />;
  }

  const handleLayoutChange = (newLayout: GridWidgetData[]) => {
    if (onChangeResume) {
      onChangeResume({
        ...resume,
        layout: newLayout,
      } as any);
    }
  };

  const addWidget = (type: GridWidgetData['type']) => {
    if (!onChangeResume) return;
    
    // Default size is "Small Square" (1x2)
    let w = 1;
    let h = 2;
    
    if (type === 'sectionTitle') {
      w = 4;
      h = 1;
    }

    const newWidget: GridWidgetData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 0,
      y: Infinity, // Places it at the bottom
      w,
      h,
      data: {},
    };
    
    onChangeResume({
      ...resume,
      layout: [...(resume.layout || []), newWidget],
    } as any);
  };

  return (
    <>
      <div
        className={`flex min-h-screen w-full flex-col ${viewMode === 'mobile' ? 'flex-col' : 'xl:flex-row xl:gap-7'}`}
      >
        <section
          className={`top-0 w-full self-start bg-background pt-8 font-sans antialiased ${viewMode === 'mobile' ? 'w-full' : 'xl:sticky xl:w-[500px] xl:py-16'}`}
          aria-label="Preview Portfolio Header"
        >
          <Header
            header={resume?.header}
            picture={profilePicture}
            isEditMode={isEditMode}
            username={username}
            viewMode={viewMode}
            onChangeHeader={
              isEditMode && onChangeResume
                ? (newHeader) => {
                    onChangeResume({
                      ...resume,
                      header: newHeader,
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
                layoutData={resume?.layout || []}
                onLayoutChange={handleLayoutChange}
              />
            </div>

            <SocialLinks
              contacts={resume?.header?.contacts}
              isEditMode={isEditMode}
              onChangeContacts={
                isEditMode && onChangeResume
                  ? (newContacts) => {
                      onChangeResume({
                        ...resume,
                        header: {
                          ...resume.header,
                          contacts: newContacts,
                        },
                      });
                    }
                  : undefined
              }
            />

            {/* Mobile Header at bottom */}
            <Settings />
          </div>
        </section>
      </div>
    </>
  );
};
