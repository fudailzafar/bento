'use client';

import { Button, Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { ResumeDataSchemaType } from '@/lib';
import { useMemo, useState } from 'react';
import { BlurFade, BlurFadeText } from '@/components/magicui';
import { EditableProfileImage } from '@/components/resume/editing';

interface SocialButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

function SocialButton({ href, icon: Icon, label }: SocialButtonProps) {
  return (
    <Button className="size-8" variant="outline" size="icon" asChild>
      <a
        href={
          href.startsWith('mailto:') || href.startsWith('tel:')
            ? href
            : `${href}${href.includes('?') ? '&' : '?'}ref=portfoliofyme`
        }
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon className="size-4" aria-hidden="true" />
      </a>
    </Button>
  );
}

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

  const prefixUrl = (stringToFix?: string) => {
    if (!stringToFix) return undefined;
    const url = stringToFix.trim();
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const socialLinks = useMemo(() => {
    const formatSocialUrl = (
      url: string | undefined,
      platform: 'github' | 'twitter' | 'linkedin'
    ) => {
      if (!url) return undefined;

      const cleanUrl = url.trim();
      if (cleanUrl.startsWith('http')) return cleanUrl;

      // Handle twitter.com and x.com variations
      if (
        platform === 'twitter' &&
        (cleanUrl.startsWith('twitter.com') || cleanUrl.startsWith('x.com'))
      ) {
        return `https://${cleanUrl}`;
      }

      const platformUrls = {
        github: 'github.com',
        twitter: 'x.com',
        linkedin: 'linkedin.com/in',
      } as const;

      return `https://${platformUrls[platform]}/${cleanUrl}`;
    };

    return {
      website: prefixUrl(header.contacts.website),
      github: formatSocialUrl(header.contacts.github, 'github'),
      twitter: formatSocialUrl(header.contacts.twitter, 'twitter'),
      linkedin: formatSocialUrl(header.contacts.linkedin, 'linkedin'),
    };
  }, [
    header.contacts.website,
    header.contacts.github,
    header.contacts.twitter,
    header.contacts.linkedin,
  ]);

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
        {isEditMode ? (
          <EditableProfileImage
            name={header.name}
            currentImage={picture}
            onImageChange={onImageChange}
          />
        ) : (
          <Avatar className="size-28 border">
            <AvatarImage
              src={picture}
              alt={`${header.name}'s profile picture`}
            />
            <AvatarFallback>
              {header.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        )}
      </BlurFade>
    </header>
  );
}
