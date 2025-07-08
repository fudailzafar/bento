'use client';

import { Header } from './header';
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

export const FullResume = ({
  resume,
  profilePicture,
  isEditMode = false,
  onChangeResume,
  onImageChange,
}: {
  resume?: ResumeData | null;
  profilePicture?: string;
  isEditMode?: boolean;
  onChangeResume?: (newResume: ResumeData) => void;
  onImageChange?: (newImageUrl: string | null) => void;
}) => {
  if (!resume) {
    return <LoadingFallback message="Loading Portfolio..." />;
  }

  const sectionOrder =
    resume?.sectionOrder || [
      'summary',
      'workExperience',
      'education',
      'skills',
      'projects',
      'contact',
      'socialLinks',
    ];

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
        educations={resume.education}
        isEditMode={isEditMode}
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
        skills={resume.header.skills}
        isEditMode={isEditMode}
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
    socialLinks: (
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
    ),
  };

  return (
    <section
      className="min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24"
      aria-label="Resume Content"
    >
      <Header
        header={resume?.header}
        picture={profilePicture}
        isEditMode={isEditMode}
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

      <div className="flex flex-col gap-6">
        <div className="mt-10">
          <SortableSections
            sectionOrder={sectionOrder}
            sectionComponents={sectionComponents}
            isEditMode={isEditMode}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </section>
  );
};
