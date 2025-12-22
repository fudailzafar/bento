'use client';

import { useState, useRef } from 'react';
import { ResumeDataSchemaType } from '@/lib';
import { BlurFade, BlurFadeText } from '@/components/magicui';
import { ProfileImageField } from '@/components/resume/editing';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface HeaderProps {
  header: ResumeDataSchemaType['header'];
  picture?: string;
  isEditMode?: boolean;
  onChangeHeader?: (newHeader: ResumeDataSchemaType['header']) => void;
  onImageChange?: (newImageUrl: string | null) => void;
  username?: string;
  viewMode?: 'desktop' | 'mobile';
}

// Header component displaying personal information and contact details
export function Header({
  header,
  picture,
  isEditMode = false,
  onChangeHeader,
  onImageChange,
  username,
  viewMode = 'desktop',
}: HeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [nameCharCount, setNameCharCount] = useState(0);
  const [aboutCharCount, setAboutCharCount] = useState(0);
  const [isCopying, setIsCopying] = useState(false);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const aboutRef = useRef<HTMLParagraphElement>(null);

  const BLUR_FADE_DELAY = 0.04;

  const handleCopyLink = async () => {
    if (!username) return;

    setIsCopying(true);
    try {
      const url = `https://portfoliofy.me/${username}`;
      await navigator.clipboard.writeText(url);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      toast.error('Failed to copy link');
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

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
    <header className={`flex flex-col-reverse gap-2 ${viewMode === 'mobile' ? 'items-start px-4' : 'xl:items-start xl:px-4'}`}>
      <div className="flex-1 space-y-1.5">
        {/* Name Field */}
        {isEditMode && onChangeHeader ? (
          <div className="group relative">
            <h1
              ref={nameRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              className={
                viewMode === 'mobile'
                  ? 'p-2 text-[32px] font-bold tracking-tighter outline-none empty:before:text-black/30 empty:before:content-[attr(data-placeholder)]'
                  : 'p-2 text-[32px] font-bold tracking-tighter outline-none empty:before:text-black/30 empty:before:content-[attr(data-placeholder)] xl:text-5xl'
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
            className={viewMode === 'mobile' ? 'p-2 text-[32px] font-bold tracking-tighter outline-none' : 'p-2 text-[32px] font-bold tracking-tighter outline-none xl:text-5xl'}
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
              className={
                viewMode === 'mobile'
                  ? 'max-w-[600px] p-2 text-base text-[#565656] outline-none empty:before:text-gray-300 empty:before:content-[attr(data-placeholder)]'
                  : 'max-w-[600px] p-2 text-base text-[#565656] outline-none empty:before:text-gray-300 empty:before:content-[attr(data-placeholder)] xl:text-xl'
              }
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
                  color: `rgb(${Math.max(160, 191 - (aboutCharCount - 225) * 0.8)}, ${Math.max(160, 191 - (aboutCharCount - 225) * 0.8)}, ${Math.max(160, 191 - (aboutCharCount - 225) * 0.8)})`,
                }}
              >
                {aboutCharCount}/280 characters
              </div>
            )}
          </div>
        ) : (
          <BlurFadeText
            className={viewMode === 'mobile' ? 'max-w-[600px] p-2 text-base text-[#565656] outline-none' : 'max-w-[600px] p-2 text-base text-[#565656] outline-none xl:text-xl'}
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
          showCopyButton={isEditMode && !!username}
          onCopyLink={handleCopyLink}
          isSaving={isCopying}
          viewMode={viewMode}
        />
      </BlurFade>
    </header>
  );
}
