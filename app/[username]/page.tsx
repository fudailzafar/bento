import { Notebook } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ResumeDataSchemaType, cn } from '@/lib';
import { getUserData } from './utils';
import { LinkedInIcon, XIcon, GitHubIcon } from '@/components/icons';
import {
  AnimatedThemeToggler,
  Dock,
  DockClient,
  DockIcon,
} from '@/components/magicui';
import {
  buttonVariants,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { PublicPortfolio } from '@/components/resume/preview';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PromotionCtaDesktop, PromotionCtaMobile } from '@/components/common';
import { SelfPortfolioLoader } from '@/components/preview';
import { ClaimUsername } from '@/components/auth';

function getSocialLinks(contacts?: ResumeDataSchemaType['header']['contacts']) {
  if (!contacts) return {};

  const prefixUrl = (stringToFix?: string) => {
    if (!stringToFix) return undefined;
    const url = stringToFix.trim();
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const formatSocialUrl = (
    url: string | undefined,
    platform: 'github' | 'twitter' | 'linkedin'
  ) => {
    if (!url) return undefined;

    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('http')) return cleanUrl;

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
    website: prefixUrl(contacts.website),
    github: formatSocialUrl(contacts.github, 'github'),
    twitter: formatSocialUrl(contacts.twitter, 'twitter'),
    linkedin: formatSocialUrl(contacts.linkedin, 'linkedin'),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const { user_id, resume, userData } = await getUserData(username);
  const profilePicture = userData?.image;

  // If no user or no resume data, return a safe default metadata
  if (!user_id || !resume?.resumeData) {
    return {
      title: 'Portfoliofy - A Portfolio, but Rich and Beautiful.',
      description:
        'Create a beautiful personal portfolio to show your professional experience, education, and everything you are and create - in one place.',
    };
  }

  const header = resume?.resumeData?.header;

  return {
    title: `${header?.name ?? 'Portfoliofy'}`,
    description: header?.shortAbout ?? '',
    icons: {
      icon: profilePicture,
      shortcut: profilePicture,
    },
    openGraph: {
      title: `${header?.name ?? 'Portfoliofy'}`,
      description: header?.shortAbout ?? '',
      images: [
        {
          url: `https://portfoliofy.me/${username}/og`,
          width: 1200,
          height: 630,
          alt: 'portfoliofy.me Profile',
        },
      ],
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { user_id, resume, userData } = await getUserData(username);

  // Check if the logged-in user is viewing their own profile
  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.user?.email === user_id;

  // If user is viewing their own profile, show preview/edit mode with initialization
  if (isOwnProfile && user_id) {
    return <SelfPortfolioLoader userId={user_id} />;
  }

  // If profile is not found, render Claim Username UI
  if (!user_id) {
    return <ClaimUsername username={username} />;
  }

  if (!resume?.resumeData) redirect(`/?idNotFound=${user_id}`);

  const profilePicture = userData?.image;
  const header = resume.resumeData.header;
  const socialLinks = getSocialLinks(header.contacts);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: header.name,
    image: profilePicture,
    jobTitle: header.shortAbout,
    description: resume.resumeData.summary,
    email: header.contacts.email && `mailto:${header.contacts.email}`,
    url: `https://portfoliofy.me/${username}`,
    skills: header.skills,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicPortfolio
        resume={resume?.resumeData}
        profilePicture={profilePicture}
      />

      {/* Desktop CTA Section */}
      <PromotionCtaDesktop />

      {/* Mobile CTA Section */}
      <PromotionCtaMobile />

      {/* Dock */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex h-full max-h-14 origin-bottom">
        <div className="fixed inset-x-0 bottom-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>

        <Dock className="pointer-events-auto relative z-50 mx-auto flex h-full min-h-full transform-gpu items-center bg-background px-1 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
          <DockClient />

          {/* Social Links */}
          {socialLinks.website && (
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Website"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'size-12 rounded-full'
                    )}
                  >
                    <Notebook className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Blog</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          )}

          <Separator orientation="vertical" className="h-full" />

          {socialLinks.github && (
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'size-12 rounded-full'
                    )}
                  >
                    <GitHubIcon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>GitHub</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          )}

          {socialLinks.twitter && (
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'size-12 rounded-full'
                    )}
                  >
                    <XIcon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Twitter</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          )}

          {socialLinks.linkedin && (
            <DockIcon>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'size-12 rounded-full'
                    )}
                  >
                    <LinkedInIcon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>LinkedIn</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          )}

          <Separator orientation="vertical" className="h-full" />
          {/* Theme Toggle */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <AnimatedThemeToggler />
              </TooltipTrigger>
              <TooltipContent>
                <p>Theme</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </div>
    </>
  );
}

export const maxDuration = 40;
