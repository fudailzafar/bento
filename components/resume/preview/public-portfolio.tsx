'use client';

import { Header } from './header';
import { Education } from './education';
import { EducationEntry } from './education';
import { Projects } from './projects';
import { Contact } from './contact';
import { Summary } from './summary';
import { WorkExperienceEntry } from './work-experience';
import { Skills } from './skills';
import { SocialLinks } from './social-links';
import { SectionTitle } from './section-title';
import { ResumeData } from '@/lib/server';

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

  const sectionOrder = (
    resume?.sectionOrder || [
      'summary',
      'workExperience',
      'skills',
      'projects',
      'contact',
    ]
  ).filter((section) => section !== 'socialLinks');

  const sectionComponents: Record<string, React.ReactNode> = {
    summary: <Summary summary={resume?.summary} className="pb-5" />,
    education: <Education educations={resume.education} className="py-5" />,
    skills: <Skills skills={resume.header.skills} className="py-5" />,
    projects: <Projects projects={resume?.projects} />,
    contact: <Contact cta={resume?.contact} />,
  };

  // Add dynamic section titles
  sectionOrder.forEach((sectionId) => {
    if (sectionId.startsWith('sectionTitle-')) {
      const titleId = sectionId;
      sectionComponents[titleId] = (
        <SectionTitle
          title={resume?.sectionTitles?.[titleId] || ''}
          isEditMode={false}
          className='mt-10 mb-3'
        />
      );
    }
  });

  // Add dynamic education entries
  sectionOrder.forEach((sectionId) => {
    if (sectionId.startsWith('education-')) {
      const educationId = sectionId;
      sectionComponents[educationId] = (
        <EducationEntry
          education={resume?.educations?.[educationId] || { school: '', degree: '', start: '', end: '' }}
          isEditMode={false}
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
          work={resume?.works?.[workId] || { location: '', company: '', title: '', start: '', end: '', description: '' }}
          isEditMode={false}
        />
      );
    }
  });

  return (
    <>
      <div className="flex h-screen w-full flex-col px-5 xl:flex-row xl:gap-7 xl:px-10">
        <section
          className="top-0 w-full self-start bg-background pt-8 font-sans antialiased xl:py-16 xl:sticky xl:w-[500px]"
          aria-label="Preview Portfolio Header"
        >
          <Header header={resume?.header} picture={profilePicture} />
        </section>
        <section
          className="scrollbar-hide w-full bg-background font-sans antialiased xl:w-[820px] xl:overflow-y-auto xl:py-8"
          aria-label="Preview Portfolio Content"
        >
          <div className="flex flex-col gap-6">
            <div className="mt-10">
              {/* Render sections in order */}
              {sectionOrder.map((section) => (
                <div key={section}>{sectionComponents[section]}</div>
              ))}
            </div>
            <SocialLinks contacts={resume?.header?.contacts} />
          </div>
        </section>
      </div>
    </>
  );
};
