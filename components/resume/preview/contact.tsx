'use client';

import { BlurFade } from '@/components/magicui';
import React, { useState, useRef } from 'react';

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
  const ctaRef = useRef<HTMLParagraphElement>(null);

  const handleBlur = () => {
    if (ctaRef.current && onChangeContact) {
      const newContent = ctaRef.current.textContent || '';
      onChangeContact(newContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ctaRef.current?.blur();
    } else if (e.key === 'Escape') {
      ctaRef.current?.blur();
    }
  };

  const enableEditing = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        if (ctaRef.current) {
          ctaRef.current.focus();
          // Select all text
          const range = document.createRange();
          range.selectNodeContents(ctaRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  if (!cta && !isEditMode) return null;

  return (
    <section className="mt-8">
      <div className="grid w-full items-center justify-center gap-4 px-4 py-12 text-center xl:px-6">
        {isEditMode ? (
          <div className="space-y-3">
            <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
              Contact
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Get in Touch
            </h2>

            <div className="mx-auto max-w-[600px]">
              <p
                ref={ctaRef}
                contentEditable={isEditMode && isEditing}
                suppressContentEditableWarning={true}
                className={
                  'p-2 text-muted-foreground outline-none lg:text-base/relaxed xl:text-xl/relaxed'
                }
                onClick={enableEditing}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{
                  __html: cta?.length > 0 ? cta : 'Add note...',
                }}
              />
            </div>
          </div>
        ) : (
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
                Contact
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Get in Touch
              </h2>

              <div className="mx-auto max-w-[600px]">
                <p
                  ref={ctaRef}
                  contentEditable={isEditMode && isEditing}
                  suppressContentEditableWarning={true}
                  className={
                    'p-2 text-muted-foreground outline-none lg:text-base/relaxed xl:text-xl/relaxed'
                  }
                  onClick={enableEditing}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  dangerouslySetInnerHTML={{
                    __html: cta?.length > 0 ? cta : 'Add note...',
                  }}
                />
              </div>
            </div>
          </BlurFade>
        )}
      </div>
    </section>
  );
}
