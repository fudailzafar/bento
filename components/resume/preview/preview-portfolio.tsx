'use client';

import { Header } from './header';
import { Header as CommonHeader } from '@/components/common';
import { Education } from './education';
import { Projects } from './projects';
import { Contact } from './contact';
import { Summary } from './summary';
import { WorkExperience } from './work-experience';
import { Skills } from './skills';
import { SocialLinks } from './social-links';
import { SortableSections } from './sortable-sections';
import { LoadingFallback } from '@/components/utils';
import { ResumeData } from '@/lib/server';

interface PreviewPortfolioProps {
  resume?: ResumeData | null;
  profilePicture?: string;
  isEditMode?: boolean;
  onChangeResume?: (newResume: ResumeData) => void;
  onImageChange?: (newImageUrl: string | null) => void;
  username?: string;
}

export const PreviewPortfolio = ({
  resume,
  profilePicture,
  isEditMode = false,
  onChangeResume,
  onImageChange,
  username,
}: PreviewPortfolioProps) => {
  if (!resume) {
    return <LoadingFallback message="Loading Portfolio..." />;
  }

  const sectionOrder = (
    resume?.sectionOrder || [
      'summary',
      'workExperience',
      'education',
      'skills',
      'projects',
      'contact',
    ]
  ).filter((section) => section !== 'socialLinks');

  const handleReorder = (newSectionOrder: string[]) => {
    if (onChangeResume && resume) {
      onChangeResume({
        ...resume,
        sectionOrder: newSectionOrder,
      });
    }
  };

  // Define all section components
  const sectionComponents: Record<string, React.ReactNode> = {
    summary: (
      <Summary
        summary={resume?.summary}
        isEditMode={isEditMode}
        onChangeSummary={
          isEditMode && onChangeResume
            ? (newSummary) => {
                onChangeResume({
                  ...resume,
                  summary: newSummary,
                });
              }
            : undefined
        }
      />
    ),
    workExperience: (
      <WorkExperience
        work={resume?.workExperience}
        isEditMode={isEditMode}
        className="py-5"
        onChangeWork={
          isEditMode && onChangeResume
            ? (newWork) => {
                onChangeResume({
                  ...resume,
                  workExperience: newWork,
                });
              }
            : undefined
        }
      />
    ),
    education: (
      <Education
        educations={resume?.education || []}
        isEditMode={isEditMode}
        className="py-5"
        onChangeEducation={
          isEditMode && onChangeResume
            ? (newEducation) => {
                onChangeResume({
                  ...resume,
                  education: newEducation,
                });
              }
            : undefined
        }
      />
    ),
    skills: (
      <Skills
        skills={resume?.header?.skills || []}
        isEditMode={isEditMode}
        className="py-5"
        onChangeSkills={
          isEditMode && onChangeResume
            ? (newSkills) => {
                onChangeResume({
                  ...resume,
                  header: {
                    ...resume.header,
                    skills: newSkills,
                  },
                });
              }
            : undefined
        }
      />
    ),
    projects: (
      <Projects
        projects={resume?.projects}
        isEditMode={isEditMode}
        onChangeProjects={
          isEditMode && onChangeResume
            ? (newProjects) => {
                onChangeResume({
                  ...resume,
                  projects: newProjects,
                });
              }
            : undefined
        }
      />
    ),
    contact: (
      <Contact
        cta={resume?.contact}
        isEditMode={isEditMode}
        onChangeContact={
          isEditMode && onChangeResume
            ? (newContact) => {
                onChangeResume({
                  ...resume,
                  contact: newContact,
                });
              }
            : undefined
        }
      />
    ),
  };

  return (
    <>
      <div className="scrollbar-hide flex h-screen w-full flex-col md:flex-row md:gap-7">
        <section
          className="top-0 w-full self-start bg-background pt-8 font-sans antialiased sm:py-16 md:sticky md:w-[500px]"
          aria-label="Preview Portfolio Header"
        >
          <Header
            header={resume?.header}
            picture={profilePicture}
            isEditMode={isEditMode}
            username={username}
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
          className="scrollbar-hide w-full bg-background py-1 font-sans antialiased sm:py-8 md:w-[820px] md:overflow-y-auto"
          aria-label="Preview Portfolio Content"
        >
          <div className="flex flex-col gap-6 md:pb-36">
            <div className="mt-10">
              <SortableSections
                sectionOrder={sectionOrder}
                sectionComponents={sectionComponents}
                isEditMode={isEditMode}
                onReorder={handleReorder}
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
            <CommonHeader />
          </div>
        </section>
      </div>
    </>
  );
};
