'use client';

import { BlurFade } from '@/components/magicui';
import React, { useState } from 'react';

const BLUR_FADE_DELAY = 0.04;

export function Contact({
  cta,
  isEditMode,
  onChangeContact,
}: {
  cta: string;
  isEditMode?: boolean;
  onChangeContact?: (newContact: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!cta && !isEditMode) return null;

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

            {isEditMode && onChangeContact ? (
              <div className="group relative mx-auto max-w-[600px]">
                {isEditing ? (
                  <textarea
                    value={cta}
                    onChange={(e) => onChangeContact(e.target.value)}
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                    className="w-full max-w-[900px] min-h-[80px] bg-transparent border-none outline-none text-center text-muted-foreground text-xl font-normal px-2 py-3 focus:ring-0 mx-auto resize-none"
                    placeholder="Add note..."
                    rows={4}
                  />
                ) : (
                  <div
                    onClick={() => setIsEditing(true)}
                    className="cursor-text rounded p-2 transition-colors"
                  >
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      {cta || 'Add note...'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {cta}
              </p>
            )}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
