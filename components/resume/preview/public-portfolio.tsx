'use client';

import { Header } from './header';
import { Education } from './education';
import { Projects } from './projects';
import { Contact } from './contact';
import { Summary } from './summary';
import { WorkExperience } from './work-experience';
import { Skills } from './skills';
import { SocialLinks } from './social-links';
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
      'education',
      'skills',
      'projects',
      'contact',
    ]
  ).filter((section) => section !== 'socialLinks');

  const sectionComponents: Record<string, React.ReactNode> = {
    summary: <Summary summary={resume?.summary} className="pb-5" />,
    workExperience: (
      <WorkExperience work={resume?.workExperience} className="py-5" />
    ),
    education: <Education educations={resume.education} className="py-5" />,
    skills: <Skills skills={resume.header.skills} className="py-5" />,
    projects: <Projects projects={resume?.projects} />,
    contact: <Contact cta={resume?.contact} />,
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col gap-7 px-10 md:flex-row">
        <section
          className="top-0 w-full self-start bg-background py-8 font-sans antialiased sm:py-16 md:sticky md:w-[500px]"
          aria-label="Preview Portfolio Header"
        >
          <Header header={resume?.header} picture={profilePicture} />
        </section>
        <section
          className="scrollbar-hide w-full bg-background py-12 font-sans antialiased sm:py-8 md:w-[820px] md:overflow-y-auto"
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
