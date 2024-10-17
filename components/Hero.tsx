import Link from "next/link";
import { Button } from "./ui/button";
import { BlurFade } from "./ui/BlurFade";
import Image from "next/image";
import { MousePointerClick, WandSparkles } from "lucide-react";

export function Hero() {
  return (
    <>
      <section className="flex-1 flex flex-col">
        <div className="flex flex-col min-h-[80vh]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row max-w-4xl mx-auto items-center px-5 md:px-2 py-8 md:pt-0">
            {/* Left Side --- Call to Action */}
            <div className="w-full md:w-1/2 max-w-[378px] flex flex-col justify-center items-center md:items-start ">
              <div className="max-w-md text-center md:text-left">
                <div className="inline-block  gap-2.5 px-2.5 py-1.5 rounded bg-gray-100 text-sm mb-5 text-design-gray">
                  100% free forever
                </div>

                <h1 className="text-[32px] font-bold mb-4 flex items-center justify-center md:justify-start gap-4 flex-wrap text-design-black  leading-4">
                  <span>LinkedIn</span>
                  <Image
                    src="/right-arrow.png"
                    alt="Arrow Right Icon"
                    width={32}
                    height={32}
                    className="inline size-8"
                  />
                  <span>Portfolio</span>
                  <br />
                  <span>
                    in one <span className="hidden sm:inline">click</span>
                  </span>
                  <MousePointerClick className="size-[37px] text-black" />
                </h1>

                <p className="text-base text-gray-600 mb-[30px]  text-center md:text-left">
                  Convert your resume/LinkedIn
                  <br /> into a minimalistic & clean website.
                </p>

                <div className="relative flex flex-col items-center  w-full md:w-fit">
                  <Link href="/upload">
                    <Button className="relative group flex items-center bg-black hover:bg-black/75 text-white px-6 py-3 h-auto text-base overflow-hidden cursor-pointer">
                      <div className="h-[120px] w-10 bg-gradient-to-r from-white/10 via-white/50 to-white/10 absolute blur-sm -rotate-45 -left-16 group-hover:left-[150%] duration-500 delay-200" />
                      <WandSparkles className="h-5 w-5 mr-2 relative" />
                      <span className="relative">Upload Resume</span>
                    </Button>
                  </Link>

                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Takes no time!
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Right --- Preview Image */}
            <div className="w-full md:w-1/2 flex justify-center items-center flex-1 relative max-h-[700px] min-w-[50%] lg:min-w-[500px]">
              <div className="absolute inset-0 -bottom-4 rounded-3xl bg-white blur-xl h-full"></div>
              <BlurFade delay={0.25} inView>
                <img
                  src="/cv-home.png"
                  className="relative w-full max-w-[500px] h-full object-cover overflow-hidden"
                  alt="Preview of Resume Website"
                />
              </BlurFade>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
