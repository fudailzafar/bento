'use client';

import { useState } from 'react';

// bento.me/explore's "Apply to get featured" form (.recommendation-footer).
// Not wired to a backend yet: submitting only shows bento's success sheet.
export function FeatureForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto my-20 flex w-full max-w-[1532px] flex-row justify-between gap-4 px-10 max-[991px]:flex-col max-[479px]:mb-0 max-[479px]:mt-[120px] max-[479px]:w-auto max-[479px]:max-w-[100vw] max-[479px]:gap-[50px] max-[479px]:px-0">
      <div className="mx-auto flex w-auto flex-1 flex-col justify-between gap-3 bg-transparent text-[#272727] max-[991px]:w-full max-[479px]:h-[400px] max-[479px]:w-full">
        {!submitted && (
          <>
            <div className="relative z-[2] flex flex-col gap-3 bg-white px-6 pb-5 max-[479px]:gap-5 max-[479px]:px-8">
              <div className="text-xl font-semibold leading-7 max-[479px]:text-2xl max-[479px]:leading-8">
                Apply to get featured
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="relative flex flex-row items-stretch gap-6 px-4 max-[991px]:flex-col max-[991px]:px-0 max-[479px]:w-full max-[479px]:flex-1 max-[479px]:gap-4 max-[479px]:px-6"
            >
              <label className="flex flex-1 flex-row items-center rounded-xl bg-[#f8f8f8] p-6 max-[479px]:w-full max-[479px]:flex-none max-[479px]:p-5">
                <span className="flex items-center text-lg font-normal leading-6 text-black max-[767px]:text-2xl max-[767px]:leading-8 max-[479px]:text-lg max-[479px]:font-light max-[479px]:leading-6">
                  bento.me/
                </span>
                <input
                  name="bento.me"
                  maxLength={256}
                  placeholder="username"
                  required
                  className="block w-full min-w-0 flex-initial rounded-lg border-none bg-transparent py-0 pl-0 pr-3 text-lg font-normal leading-6 text-black outline-none transition-all [transition-duration:200ms] placeholder:text-black/[.24] max-[767px]:text-2xl max-[767px]:leading-8 max-[479px]:text-lg max-[479px]:font-light max-[479px]:leading-6"
                />
              </label>
              <input
                name="What-s-cool-about-this-Bento"
                maxLength={256}
                placeholder="What's cool about this Bento?"
                className="block flex-1 rounded-xl border-none bg-[#f8f8f8] p-6 text-lg font-normal leading-6 text-black outline-none placeholder:text-black/[.24] max-[479px]:flex-none max-[479px]:p-5 max-[479px]:font-light"
              />
              <input
                type="submit"
                value="Feature This Bento"
                className="cursor-pointer rounded-xl bg-[#3898ec] px-8 py-6 text-lg font-semibold leading-6 text-white shadow-[0_2px_3px_rgba(0,0,0,.1)] max-[767px]:w-full max-[767px]:py-[22px] max-[767px]:pr-0.5 max-[479px]:p-4 max-[479px]:text-xl max-[479px]:leading-8"
              />
            </form>
          </>
        )}
        {submitted && (
          <div className="relative h-auto min-h-full w-auto p-0 max-[767px]:min-h-0 max-[767px]:flex-1">
            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#3898ec] shadow-[0_2px_3px_rgba(0,0,0,.1)] max-[991px]:h-[400px] max-[767px]:py-12">
              <img src="/explore/success.png" alt="" width={48} className="mb-5" />
              <h2 className="mb-2.5 mt-5 w-full px-20 text-center text-[32px] font-bold leading-[39px] text-white max-[479px]:px-10 max-[479px]:text-2xl max-[479px]:leading-8">
                Thank you!
              </h2>
              <div className="w-full px-[15%] text-center text-xl font-normal leading-6 text-white max-[479px]:px-10 max-[479px]:text-sm max-[479px]:leading-5">
                We received your Bento recommendation and will consider to
                feature it!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
