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
    <section
      className="min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6"
      aria-label="Portfolio Content"
    >
      <Header header={resume?.header} picture={profilePicture} />
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
  );
};
