'use client';

import { useState, useRef } from 'react';
import { ResumeDataSchemaType } from '@/lib';
import { BlurFade, BlurFadeText } from '@/components/magicui';
import { ProfileImageField } from '@/components/resume/editing';

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
  const nameRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLParagraphElement>(null);

  const BLUR_FADE_DELAY = 0.04;

  const handleNameBlur = () => {
    if (nameRef.current && onChangeHeader) {
      const newContent = nameRef.current.textContent || '';
      onChangeHeader({ ...header, name: newContent });
    }
    setIsEditingName(false);
  };

  const handleAboutBlur = () => {
    if (aboutRef.current && onChangeHeader) {
      const newContent = aboutRef.current.textContent || '';
      onChangeHeader({ ...header, shortAbout: newContent });
    }
    setIsEditingAbout(false);
  };

  const handleKeyDown = (field: 'name' | 'about', e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (field === 'name') {
        nameRef.current?.blur();
      } else {
        aboutRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      if (field === 'name') {
        nameRef.current?.blur();
      } else {
        aboutRef.current?.blur();
      }
    }
  };

  const enableNameEditing = () => {
    if (isEditMode && !isEditingName) {
      setIsEditingName(true);
      setTimeout(() => {
        if (nameRef.current) {
          nameRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(nameRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  const enableAboutEditing = () => {
    if (isEditMode && !isEditingAbout) {
      setIsEditingAbout(true);
      setTimeout(() => {
        if (aboutRef.current) {
          aboutRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(aboutRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  return (
    <header className="flex items-start md:items-center justify-between gap-4 ">
      <div className="flex-1 space-y-1.5">
        {/* Name Field */}
        {isEditMode && onChangeHeader ? (
          <div className="group relative">
            <h1
              ref={nameRef}
              contentEditable={isEditingName}
              suppressContentEditableWarning={true}
              className={
                'text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none outline-none p-2'
              }
              onClick={enableNameEditing}
              onBlur={handleNameBlur}
              onKeyDown={(e) => handleKeyDown('name', e)}
              dangerouslySetInnerHTML={{
                __html:
                  header.name?.length > 0 ? header.name : 'Enter your name',
              }}
            />
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
            <p
              ref={aboutRef}
              contentEditable={isEditingAbout}
              suppressContentEditableWarning={true}
              className={'max-w-[600px] md:text-xl outline-none p-2'}
              onClick={enableAboutEditing}
              onBlur={handleAboutBlur}
              onKeyDown={(e) => handleKeyDown('about', e)}
              dangerouslySetInnerHTML={{
                __html:
                  header.shortAbout?.length > 0
                    ? header.shortAbout
                    : 'Enter short description',
              }}
            />
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
        <ProfileImageField
          name={header.name}
          currentImage={picture}
          onImageChange={onImageChange}
          isPublicView={!isEditMode}
        />
      </BlurFade>
    </header>
  );
}
