import { GlobeIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ResumeDataSchemaType } from '@/lib/resume';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FullResume } from '@/components/resume/preview/full-resume';
import { Metadata } from 'next';
import { getUserData } from './utils';
import { Dock, DockIcon } from '@/components/magicui/dock';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { LinkedInIcon } from '@/components/icons/linkedin-icon';
import { XIcon } from '@/components/icons/x-icon';
import { GitHubIcon } from '@/components/icons/github-icon';
import { cn } from '@/lib/utils';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import DockClient from '@/components/magicui/dock-client';
import Image from 'next/image';
import BlurFade from '@/components/magicui/blur-fade';

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
  const { user_id, resume, userData } = await getUserData(username);
  const profilePicture = userData?.image;

  // If no user or no resume data, return a safe default metadata
  if (!user_id || !resume?.resumeData) {
    return {
      title: 'Portfoliofy - Your Personal Portfolio, but Rich and Beautiful.',
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

  // If user_id is not found, render notfound UI directly
  if (!user_id) {
    return (
      <div className="flex flex-col mt-16 mb-1 items-center justify-center bg-white">
        {/* Logo */}
        <BlurFade delay={3} duration={0.5}>
          <div className="rounded-2xl bg-design-primary p-3 mb-10">
            <div className="rounded-full">
              <Image
                src={'/icons/android-chrome-512x512.png'}
                alt="portfoliofy logo"
                className="rounded-lg"
                width={40}
                height={20}
              />
            </div>
          </div>
        </BlurFade>

        {/* Username display */}
        <BlurFade delay={0.5} duration={2}>
          <div className="relative flex items-center mb-2 px-6 py-4 rounded-xl bg-gray-100">
            <span className="text-[24px] md:text-[40px] font-semibold text-design-gray">
              portfoliofy.me/
              <span className="text-design-black">{username}</span>
            </span>
            <BlurFade delay={2} duration={0.5}>
              <h1 className="ml-2 px-3 py-1.5 bg-design-success text-white rounded-lg font-semibold text-base absolute -top-14 -right-12 shadow rotate-2">
                Available!
              </h1>
            </BlurFade>
          </div>
        </BlurFade>
        <BlurFade delay={3} duration={0.5}>
          <div className="text-center mt-2 mb-5">
            <p className="text-design-gray text-center">
              Portfoliofy is the most beautiful portfolio.
            </p>
            <p className="text-design-gray">
              And it’s all free.{' '}
              <Link href={'/'}>
                <span className="underline cursor-pointer text-design-primaryLight">
                  Learn more
                </span>
              </Link>
            </p>
          </div>
        </BlurFade>
        <BlurFade delay={3} duration={0.5}>
          <div className="mt-2">
            <Link href="/signup">
              <Button className="relative group rounded-lg flex items-center bg-design-primary hover:bg-design-primaryDark text-white px-4 py-3 h-auto text-lg font-bold overflow-hidden cursor-pointer">
                <span className="relative">Claim Handle Now</span>
              </Button>
            </Link>
          </div>
        </BlurFade>
        <BlurFade delay={2.5}>
          <Image
            src={'/user/cv-not-found.png'}
            alt="not-found"
            width={450}
            height={450}
            className="mt-10 bottom-0"
          />
        </BlurFade>
      </div>
    );
  }

  if (!resume?.resumeData || resume.status !== 'live')
    redirect(`/?idNotFound=${user_id}`);

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

      <FullResume resume={resume?.resumeData} profilePicture={profilePicture} />

      <div className="bg-slate-100 dark:bg-[#020817] py-10 md:bg-white text-center z-10 pb-24 md:pb-0 md:mb-32 gap-5 flex flex-col md:flex-row justify-center items-center">
        <Button className="bg-design-black text-design-white dark:bg-design-white dark:text-design-black">
          <Link
            href={'/signup'}
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
          <Link
            href={'/login'}
            className="text-design-gray dark:text-design-white"
          >
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
