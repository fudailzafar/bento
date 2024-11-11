import { GlobeIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ResumeDataSchemaType } from '@/lib/resume';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FullResume } from '@/components/resume/FullResume';
import { Metadata } from 'next';
import { getUserData } from './utils';
import { Dock, DockIcon } from '@/components/magicui/dock';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import { XIcon } from '@/components/icons/XIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { cn } from '@/lib/utils';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import DockClient from '@/components/magicui/DockClient';
import Image from 'next/image';

interface SocialButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

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
  const { user_id, resume, clerkUser } = await getUserData(username);
  const profilePicture = clerkUser?.imageUrl;
  if (!user_id) {
    return {
      title: 'Portfoliofy - Your Personal Portfolio, but Rich and Beautiful.',
      description:
        'Create a beautiful personal portfolio to show your professional experience, education, and everything you are and create - in one place.',
    };
  }

  if (!resume?.resumeData || resume.status !== 'live') {
    return {
      title: 'Resume Not Found | portfoliofudail.me',
      description: 'This resume could not be found on portfolio.fudail.me',
    };
  }

  return {
    title: `${resume.resumeData.header.name}'s Portfolio | portfolio.fudail.me`,
    description: resume.resumeData.summary,
    icons: {
      icon: profilePicture,
      shortcut: profilePicture,
    },
    openGraph: {
      title: `${resume.resumeData.header.name}'s Portfolio | portfolio.fudail.me`,
      description: resume.resumeData.summary,
      images: [
        {
          url: `https://portfolio.fudail.me/${username}/og`,
          width: 1200,
          height: 630,
          alt: 'portfolio.fudail.me Profile',
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
  const { user_id, resume, clerkUser } = await getUserData(username);

  if (!user_id) redirect(`/notfound/${username}`);
  if (!resume?.resumeData || resume.status !== 'live')
    redirect(`/?idNotFound=${user_id}`);

  const profilePicture = clerkUser?.imageUrl;
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
    url: `https://portfolio.fudail.me/${username}`,
    skills: header.skills,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FullResume resume={resume?.resumeData} profilePicture={profilePicture} />

      <div className="text-center z-50 mb-32 gap-5 flex justify-center items-center">
        <Button className="bg-design-black text-design-white dark:bg-design-white dark:text-design-black">
          <Link
            href={`/?ref=${username}`}
            className="text-design-white text-sm flex flex-row gap-3"
          >
            <Image src={'/favicon.ico'} alt="" width={20} height={15} />
            <div className="text-design-white dark:text-design-black">
              Create Your{' '}
              <span className="text-design-white dark:text-design-black">
                Portfolio
              </span>
            </div>
          </Link>
        </Button>
        <Button variant={'ghost'}>
          <Link href={'/upload'} className="text-design-gray">
            Log In
          </Link>
        </Button>
      </div>

      {/* Dock */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
        <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>

        <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
          <DockClient />

          <Separator orientation="vertical" className="h-full" />

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
                    <GlobeIcon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Website</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          )}

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
