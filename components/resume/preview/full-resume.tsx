import LoadingFallback from '../../loading-fallback';
import { ResumeData } from '../../../lib/server/redis-actions';
import { Header } from './header';

import { Education } from './education';

import { Projects } from './projects';
import { Contact } from './contact';
import { Summary } from './summary';
import { WorkExperience } from './work-experience';
import { Skills } from './skills';

export const FullResume = ({
  resume,
  profilePicture,
  isEditMode = false,
}: {
  resume?: ResumeData | null;
  profilePicture?: string;
  isEditMode?: boolean;
}) => {
  if (!resume) {
    return <LoadingFallback message="Loading Resume..." />;
  }

  return (
    <section
      className="min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24"
      aria-label="Resume Content"
    >
      <Header header={resume?.header} picture={profilePicture} isEditMode={isEditMode} />

      <div className="flex flex-col gap-6">
        <div className="mt-10">
          <Summary summary={resume?.summary} />
        </div>

        <WorkExperience work={resume?.workExperience} />

        <Education educations={resume.education} />

        <Skills skills={resume.header.skills} />

        <Projects projects={resume?.projects} />

        <Contact cta={resume?.contact} />
      </div>
    </section>
  );
};
