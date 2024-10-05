import LoadingFallback from '../LoadingFallback';
import { ResumeData } from '../../lib/server/redisActions';
import { Education } from './Education';
import { Header } from './Header';
import { Skills } from './Skills';
import { Summary } from './Summary';
import { WorkExperience } from './WorkExperience';
import { Contact } from './Contact';
import { Projects } from './Projects';

export const FullResume = ({
  resume,
  profilePicture,
}: {
  resume?: ResumeData | null;
  profilePicture?: string;
}) => {
  if (!resume) {
    return <LoadingFallback message="Loading Resume..." />;
  }

  return (
    <section
      className="min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6"
      aria-label="Resume Content"
    >
      <Header header={resume?.header} picture={profilePicture} />

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
