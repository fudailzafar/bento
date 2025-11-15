import { Notebook } from 'lucide-react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ResumeDataSchemaType, cn } from '@/lib';
import { getUserData } from './utils';
import { LinkedInIcon, XIcon, GitHubIcon } from '@/components/icons';
import {
  AnimatedThemeToggler,
  BlurFade,
  Dock,
  DockClient,
  DockIcon,
} from '@/components/magicui';
import {
  Button,
  buttonVariants,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { PublicPortfolio } from '@/components/resume/preview';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { OwnProfileLoader } from '@/components/preview';

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
    return <OwnProfileLoader userId={user_id} />;
  }

  // If user_id is not found, render notfound UI directly
  if (!user_id) {
    return (
      <div className="mb-1 mt-16 flex flex-col items-center justify-center bg-white">
        {/* Logo */}
        <BlurFade delay={3} duration={0.5}>
          <div className="mb-10 rounded-2xl bg-design-primary p-3">
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
          <div className="relative mb-2 flex items-center rounded-xl bg-gray-100 px-6 py-4">
            <span className="text-[24px] font-semibold text-design-gray md:text-[40px]">
              portfoliofy.me/
              <span className="overflow-hidden text-design-black">
                {username}
                <div className="absolute inset-0 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </span>
            </span>
            <BlurFade delay={2} duration={0.5}>
              <h1 className="absolute -right-12 -top-14 ml-2 rotate-2 rounded-lg bg-design-success px-3 py-1.5 text-base font-semibold text-white shadow">
                Available!
              </h1>
            </BlurFade>
          </div>
        </BlurFade>
        <BlurFade delay={3} duration={0.5}>
          <div className="mb-5 mt-2 text-center">
            <p className="text-center text-design-gray">
              Portfoliofy is the most beautiful portfolio.
            </p>
            <p className="text-design-gray">
              And it’s all free.{' '}
              <Link href={'/'}>
                <span className="cursor-pointer text-design-primaryLight underline">
                  Learn more
                </span>
              </Link>
            </p>
          </div>
        </BlurFade>
        <BlurFade delay={3} duration={0.5}>
          <div className="mt-2">
            <Link href="/signup">
              <Button className="group relative flex h-auto cursor-pointer items-center overflow-hidden rounded-lg bg-design-primary px-4 py-3 text-lg font-bold text-white transition-transform hover:bg-design-primaryDark active:scale-95">
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
            className="bottom-0 mt-10"
          />
        </BlurFade>
      </div>
    );
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

      {/* Mobile CTA Section */}
      <div className="z-10 flex flex-col items-center justify-center gap-5 bg-slate-100 py-10 pb-24 text-center dark:bg-[#020817] sm:hidden">
        <Button className="bg-design-primary text-design-white hover:bg-design-primaryDark">
          <Link
            href={'/signup'}
            className="flex flex-row items-center justify-center gap-3 text-xs font-bold"
          >
            <Image src={'/favicon.ico'} alt="" width={20} height={15} />
            <div>
              <p className="text-base font-bold">Create Your Portfolio</p>
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

      {/* Desktop CTA Section */}
      <div className="fixed bottom-10 left-10 z-50 hidden flex-row items-center justify-center gap-2 sm:flex">
        <Button className="relative h-8 overflow-hidden bg-design-primary px-3 text-design-white hover:bg-design-primaryDark">
          <Link
            href={'/signup'}
            className="relative z-10 flex flex-row items-center gap-2 text-xs font-semibold"
          >
            <Image src={'/favicon.ico'} alt="" width={16} height={16} />
            <span>Create Your Portfolio</span>
          </Link>
          {/* Shine effect */}
          <div className="absolute inset-0 translate-x-[-100%] animate-[shine_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-design-primaryLight/30 to-transparent" />
        </Button>
        <Button variant={'ghost'} className="h-8 px-3">
          <Link
            href={'/login'}
            className="text-sm text-design-gray dark:text-design-white"
          >
            Log In
          </Link>
        </Button>
      </div>

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
