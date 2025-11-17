'use client';

import { Header } from './header';
import { Header as CommonHeader } from '@/components/common';
import { Education } from './education';
import { EducationEntry } from './education';
import { Projects } from './projects';
import { Contact } from './contact';
import { Summary } from './summary';
import { WorkExperienceEntry } from './work-experience';
import { Skills } from './skills';
import { SocialLinks } from './social-links';
import { SectionTitle } from './section-title';
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
  const sectionComponents: Record<string, React.ReactNode> = {};

  // Add standard sections
  sectionComponents.summary = (
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
  );

  sectionComponents.education = (
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
  );

  sectionComponents.skills = (
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
  );

  sectionComponents.projects = (
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
  );

  sectionComponents.contact = (
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
  );

  // Remove the old work experience section since we now use individual work entries
  delete sectionComponents.workExperience;

  // Add dynamic education entries
  sectionOrder.forEach((sectionId) => {
    if (sectionId.startsWith('education-')) {
      const educationId = sectionId;
      sectionComponents[educationId] = (
        <EducationEntry
          education={
            resume?.educations?.[educationId] || {
              school: 'Al Hira Model School',
              degree: 'High School Diploma',
              start: '2017',
              end: '2023',
            }
          }
          isEditMode={isEditMode}
          onEdit={
            isEditMode
              ? () => {
                  // TODO: Open education edit modal/form
                  console.log('Edit education:', educationId);
                }
              : undefined
          }
          onSave={
            isEditMode && onChangeResume
              ? (updatedEducation) => {
                  onChangeResume({
                    ...resume,
                    educations: {
                      ...resume.educations,
                      [educationId]: updatedEducation,
                    },
                  });
                }
              : undefined
          }
          onDelete={
            isEditMode && onChangeResume
              ? () => {
                  const newSectionOrder = sectionOrder.filter(
                    (id) => id !== educationId
                  );
                  const newEducations = { ...resume.educations };
                  delete newEducations[educationId];
                  onChangeResume({
                    ...resume,
                    sectionOrder: newSectionOrder,
                    educations: newEducations,
                  });
                }
              : undefined
          }
        />
      );
    }
  });

  // Add dynamic work experience entries
  sectionOrder.forEach((sectionId) => {
    if (sectionId.startsWith('work-')) {
      const workId = sectionId;
      sectionComponents[workId] = (
        <WorkExperienceEntry
          work={
            resume?.works?.[workId] || {
              location: 'New York, NY',
              company: 'Tech Corp',
              title: 'Software Engineer',
              start: '2020',
              end: '2023',
              description: 'Developed web applications using React and Node.js',
            }
          }
          isEditMode={isEditMode}
          onEdit={
            isEditMode
              ? () => {
                  // TODO: Open work edit modal/form
                  console.log('Edit work:', workId);
                }
              : undefined
          }
          onSave={
            isEditMode && onChangeResume
              ? (updatedWork) => {
                  onChangeResume({
                    ...resume,
                    works: {
                      ...resume.works,
                      [workId]: updatedWork,
                    },
                  });
                }
              : undefined
          }
          onDelete={
            isEditMode && onChangeResume
              ? () => {
                  const newSectionOrder = sectionOrder.filter(
                    (id) => id !== workId
                  );
                  const newWorks = { ...resume.works };
                  delete newWorks[workId];
                  onChangeResume({
                    ...resume,
                    sectionOrder: newSectionOrder,
                    works: newWorks,
                  });
                }
              : undefined
          }
        />
      );
    }
  });

  // Add dynamic section titles
sectionOrder.forEach((sectionId) => {
  if (sectionId.startsWith('sectionTitle-')) {
    const titleId = sectionId;
    sectionComponents[titleId] = (
      <SectionTitle
        title={resume?.sectionTitles?.[titleId] || ''}
        isEditMode={isEditMode}
        onTitleChange={
          isEditMode && onChangeResume
            ? (newTitle) => {
                onChangeResume({
                  ...resume,
                  sectionTitles: {
                    ...resume.sectionTitles,
                    [titleId]: newTitle,
                  },
                });
              }
            : undefined
        }
        onDelete={
          isEditMode && onChangeResume
            ? () => {
                const newSectionOrder = sectionOrder.filter(
                  (id) => id !== titleId
                );
                const newSectionTitles = { ...resume.sectionTitles };
                delete newSectionTitles[titleId];
                onChangeResume({
                  ...resume,
                  sectionOrder: newSectionOrder,
                  sectionTitles: newSectionTitles,
                });
              }
            : undefined
        }
      />
    );
  }
});


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
          className="scrollbar-hide w-full bg-background py-1 font-sans antialiased sm:py-8 md:w-[820px] md:overflow-y-auto md:px-4"
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
