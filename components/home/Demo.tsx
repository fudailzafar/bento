import { DemoResume } from './demo-resume';
import DemoResumeDesktop from './demo-resume-desktop';

export function Demo() {
  return (
    <>
      <div className="mx-auto my-36 flex flex-col items-center justify-center">
        <div className="relative flex w-full flex-col items-center">
          <div className="max-w-[340px] text-center text-[40px] font-bold leading-tight sm:text-6xl md:max-w-full">
            <div
              className="bg-gradient-to-b from-black to-gray-400 bg-clip-text text-transparent leading-tight"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 20%, transparent 95%)',
                maskImage:
                  'linear-gradient(to bottom, black 55%, transparent 92%)',
              }}
            >
              Your Videos. Podcasts.
              <br />
              Newsletters. Photos.
              <br />
              Paid Products. Streams.
              <br />
              Calendar.
            </div>
          </div>
          <div className="mx-auto flex max-w-[350px] flex-col text-center text-[26px] font-light text-gray-700 md:mt-12 md:max-w-full md:gap-y-2 md:text-3xl">
            <p>All your content integrated into your personal page.</p>
          </div>
          <div className="mx-auto max-w-[340px] text-center text-[26px] font-light text-gray-700 md:mt-2 md:max-w-full md:text-3xl">
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
