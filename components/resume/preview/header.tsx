import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResumeDataSchemaType } from '@/lib/resume';
import { useMemo } from 'react';
import BlurFade from '../../magicui/blur-fade';
import BlurFadeText from '../../magicui/blur-fade-text';

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
            : `${href}${href.includes('?') ? '&' : '?'}ref=selfso`
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
}: {
  header: ResumeDataSchemaType['header'];
  picture?: string;
}) {
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
        <BlurFadeText
          delay={BLUR_FADE_DELAY}
          className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
          yOffset={8}
          text={header.name}
        />

        <BlurFadeText
          className="max-w-[600px] md:text-xl"
          delay={BLUR_FADE_DELAY}
          text={header.shortAbout}
        />
      </div>
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Avatar className="size-28 border">
          <AvatarImage src={picture} alt={`${header.name}'s profile picture`} />
          <AvatarFallback>
            {header.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </BlurFade>
    </header>
  );
}
