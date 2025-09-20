import { DemoResume } from './DemoResume';
import DemoResumeDesktop from './DemoResumeDesktop';

export function Demo() {
  return (
    <>
      <div className="my-36 mx-auto flex flex-col justify-center items-center">
        <div className="relative w-full flex flex-col items-center">
          <div className="text-center max-w-[340px] md:max-w-full font-bold text-[40px] sm:text-6xl leading-tight">
            <div
              className="bg-gradient-to-b from-black to-gray-400 bg-clip-text text-transparent"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 20%, transparent 95%)',
                maskImage:
                  'linear-gradient(to bottom, black 55%, transparent 92%)',
              }}
            >
              Your Career. About.
              <br />
              Experience. Projects.
              <br />
              Socials. Achievements.
              <br />
              And more
            </div>
          </div>
          <div className="max-w-[350px] md:mt-12 md:max-w-full flex flex-col md:gap-y-2 text-center font-light text-[26px] md:text-3xl text-gray-700 mx-auto">
            <p>All your story integrated into your personal page.</p>
          </div>
          <div className="max-w-[340px] md:mt-2 md:max-w-full text-center font-light text-[26px] md:text-3xl text-gray-700 mx-auto">
            <p>No more hiding your content behind links.</p>
          </div>
          <div className="md:hidden">
            <DemoResume />
          </div>
          <div className="hidden md:block">
            <DemoResumeDesktop />
          </div>
        </div>
      </div>
    </>
  );
}
