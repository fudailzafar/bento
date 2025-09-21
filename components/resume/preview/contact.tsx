import React from 'react';
import BlurFade from '../../magicui/blur-fade';

const BLUR_FADE_DELAY = 0.04;

export function Contact({ cta }: { cta: string }) {
  if (!cta) return null;
  return (
    <section className="mt-8">
      <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <div className="space-y-3">
            <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
              Contact
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Get in Touch
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {cta}
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
