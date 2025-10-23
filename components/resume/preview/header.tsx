'use client';

import { ResumeDataSchemaType } from '@/lib';
import { useState } from 'react';
import { BlurFade, BlurFadeText } from '@/components/magicui';
import { EditableProfileImage } from '@/components/resume/editing';

/**
 * Header component displaying personal information and contact details
 */
export function Header({
  header,
  picture,
  isEditMode = false,
  onChangeHeader,
  onImageChange,
}: {
  header: ResumeDataSchemaType['header'];
  picture?: string;
  isEditMode?: boolean;
  onChangeHeader?: (newHeader: ResumeDataSchemaType['header']) => void;
  onImageChange?: (newImageUrl: string | null) => void;
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const BLUR_FADE_DELAY = 0.04;

  return (
    <header className="flex items-start md:items-center justify-between gap-4 ">
      <div className="flex-1 space-y-1.5">
        {/* Name Field */}
        {isEditMode && onChangeHeader ? (
          <div className="group relative">
            {isEditingName ? (
              <input
                type="text"
                value={header.name}
                onChange={(e) =>
                  onChangeHeader({ ...header, name: e.target.value })
                }
                onBlur={() => setIsEditingName(false)}
                autoFocus
                className="w-full bg-transparent border-none outline-none text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none p-0 focus:ring-0"
              />
            ) : (
              <div
                onClick={() => setIsEditingName(true)}
                className="cursor-text rounded p-2 -ml-2 transition-colors"
              >
                <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                  yOffset={8}
                  text={header.name}
                />
              </div>
            )}
          </div>
        ) : (
          <BlurFadeText
            delay={BLUR_FADE_DELAY}
            className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
            yOffset={8}
            text={header.name}
          />
        )}

        {/* Short About Field */}
        {isEditMode && onChangeHeader ? (
          <div className="group relative">
            {isEditingAbout ? (
              <textarea
                value={header.shortAbout}
                onChange={(e) =>
                  onChangeHeader({ ...header, shortAbout: e.target.value })
                }
                onBlur={() => setIsEditingAbout(false)}
                autoFocus
                className="w-full max-w-[600px] bg-transparent border-none outline-none md:text-xl p-0 resize-none focus:ring-0 leading-normal"
                rows={2}
              />
            ) : (
              <div
                onClick={() => setIsEditingAbout(true)}
                className="cursor-text rounded p-2 -ml-2 transition-colors"
              >
                <BlurFadeText
                  className="max-w-[600px] md:text-xl"
                  delay={BLUR_FADE_DELAY}
                  text={header.shortAbout}
                />
              </div>
            )}
          </div>
        ) : (
          <BlurFadeText
            className="max-w-[600px] md:text-xl"
            delay={BLUR_FADE_DELAY}
            text={header.shortAbout}
          />
        )}
      </div>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <EditableProfileImage
          name={header.name}
          currentImage={picture}
          onImageChange={onImageChange}
          isPublicView={!isEditMode}
        />
      </BlurFade>
    </header>
  );
}
