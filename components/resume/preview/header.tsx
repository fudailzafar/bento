'use client';

import { useState, useRef } from 'react';
import { ResumeDataSchemaType } from '@/lib';
import { BlurFade, BlurFadeText } from '@/components/magicui';
import { ProfileImageField } from '@/components/resume/editing';

// Header component displaying personal information and contact details

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
  const [nameCharCount, setNameCharCount] = useState(0);
  const [aboutCharCount, setAboutCharCount] = useState(0);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLParagraphElement>(null);

  const BLUR_FADE_DELAY = 0.04;

  const handleNameBlur = () => {
    if (nameRef.current && onChangeHeader) {
      const newContent = nameRef.current.textContent || '';
      onChangeHeader({ ...header, name: newContent });
    }
    setIsEditingName(false);
    setNameCharCount(0);
  };

  const handleAboutBlur = () => {
    if (aboutRef.current && onChangeHeader) {
      const newContent = aboutRef.current.textContent || '';
      onChangeHeader({ ...header, shortAbout: newContent });
    }
    setIsEditingAbout(false);
    setAboutCharCount(0);
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
          setNameCharCount(nameRef.current.textContent?.length || 0);
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
          setAboutCharCount(aboutRef.current.textContent?.length || 0);
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
    <header className="flex flex-col-reverse items-start md:px-4 gap-2">
      <div className="flex-1 space-y-1.5">
        {/* Name Field */}
        {isEditMode && onChangeHeader ? (
          <div className="group relative">
            <h1
              ref={nameRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              className={
                'p-2 text-[32px] font-bold tracking-tighter outline-none md:text-5xl empty:before:content-[attr(data-placeholder)] empty:before:text-black/30'
              }
              data-placeholder="Your name"
              onClick={enableNameEditing}
              onFocus={() => {
                setIsEditingName(true);
                setNameCharCount(nameRef.current?.textContent?.length || 0);
              }}
              onBlur={handleNameBlur}
              onKeyDown={(e) => handleKeyDown('name', e)}
              onInput={(e) => {
                const target = e.currentTarget;
                const currentLength = target.textContent?.length || 0;
                setNameCharCount(currentLength);
              }}
            >
              {header.name || ''}
            </h1>
          </div>
        ) : (
          <BlurFadeText
            delay={BLUR_FADE_DELAY}
            className="p-2 text-[32px] font-bold tracking-tighter outline-none md:text-5xl"
            yOffset={8}
            text={header.name}
          />
        )}

        {/* Short About Field */}
        {isEditMode && onChangeHeader ? (
          <div className="group relative">
            <p
              ref={aboutRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              className={'max-w-[600px] p-2 outline-none text-base text-[#565656] md:text-xl empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300'}
              data-placeholder="Your bio..."
              onClick={enableAboutEditing}
              onFocus={() => {
                setIsEditingAbout(true);
                setAboutCharCount(aboutRef.current?.textContent?.length || 0);
              }}
              onBlur={handleAboutBlur}
              onKeyDown={(e) => handleKeyDown('about', e)}
              onInput={(e) => {
                const target = e.currentTarget;
                const currentLength = target.textContent?.length || 0;
                setAboutCharCount(currentLength);
                
                if (target.textContent && target.textContent.length > 280) {
                  target.textContent = target.textContent.slice(0, 280);
                  setAboutCharCount(280);
                  // Move cursor to end
                  const range = document.createRange();
                  const selection = window.getSelection();
                  range.selectNodeContents(target);
                  range.collapse(false);
                  selection?.removeAllRanges();
                  selection?.addRange(range);
                }
              }}
            >
              {header.shortAbout || ''}
            </p>
            {aboutCharCount >= 225 && (
              <div 
                className="mt-1 p-2 text-xs font-semibold transition-colors duration-200"
                style={{
                  color: `rgb(${Math.max(160, 191 - (aboutCharCount - 225) * 0.8)}, ${Math.max(160, 191 - (aboutCharCount - 225) * 0.8)}, ${Math.max(160, 191 - (aboutCharCount - 225) * 0.8)})`
                }}
              >
                {aboutCharCount}/280 characters
              </div>
            )}
          </div>
        ) : (
          <BlurFadeText
            className="max-w-[600px] p-2 outline-none text-base text-[#565656] md:text-xl"
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
