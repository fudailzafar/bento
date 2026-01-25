'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import {
  ArrowLeftIcon,
  CheckmarkLargeIcon,
  GitHubIcon,
  LinkedInIcon,
  LoaderIcon,
  XIcon,
} from '@/components/icons';
import { Notebook, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignUpAnimation } from '@/components/auth';

// Shared gradient style (can't be expressed in Tailwind)
const BUTTON_GRADIENT =
  'linear-gradient(180deg, rgba(0, 0, 0, .06), rgba(0, 0, 0, .059) 11.97%, rgba(0, 0, 0, .056) 21.38%, rgba(0, 0, 0, .051) 28.56%, rgba(0, 0, 0, .044) 34.37%, rgba(0, 0, 0, .037) 39.32%, rgba(0, 0, 0, .03) 44%, rgba(0, 0, 0, .023) 49.02%, rgba(0, 0, 0, .016) 54.96%, rgba(0, 0, 0, .009) 62.44%, rgba(0, 0, 0, .004) 72.04%, rgba(0, 0, 0, .001) 84.36%, transparent)';

const socialMediaPlatforms = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedInIcon className="size-6" />,
    color: 'bg-[#016699]',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <GitHubIcon className="size-6" />,
    color: 'bg-gray-800',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <XIcon className="size-6" />,
    color: 'bg-black',
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: <Notebook className="size-6" />,
    color: 'bg-red-600',
  },
];

interface Project {
  id: string;
  name: string;
  link: string;
}

export default function SocialMediaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'social' | 'projects' | 'complete'>(
    'social'
  );
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Social media state
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  // Projects state
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: '', link: '' },
  ]);

  const handleInputChange = (platform: string, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      link: '',
    };
    setProjects([...projects, newProject]);
  };

  const handleRemoveProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const handleProjectInputChange = (
    id: string,
    field: 'name' | 'link',
    value: string
  ) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  const handleNextFromSocial = () => {
    setDirection('forward');
    setStep('projects');
  };

  const handleBackToSocial = () => {
    setDirection('backward');
    setStep('social');
  };

  const handleSkipSocial = () => {
    setDirection('forward');
    setStep('projects');
  };

  const handleFinalNext = async () => {
    setIsLoading(true);
    // TODO: Save social media links and projects to backend
    setTimeout(() => {
      setIsLoading(false);
      setDirection('forward');
      setStep('complete');
    }, 500);
  };

  const handleSkipProjects = () => {
    setDirection('forward');
    setStep('complete');
  };

  const handleGoToProfile = async () => {
    const usernameRes = await fetch('/api/username');
    const usernameData = await usernameRes.json();
    router.push(
      usernameData.username ? `/${usernameData.username}` : '/upload'
    );
  };

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-16 sm:justify-between sm:px-6 md:gap-12 md:py-20 lg:gap-16 lg:px-32">
      <div className="w-full max-w-[440px] space-y-6 sm:space-y-8">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {step === 'social' ? (
              <motion.div
                key="social"
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction === 'forward' ? 20 : -20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === 'forward' ? -20 : 20,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="text-left">
                  <h1 className="text-xl font-semibold text-design-black sm:text-2xl md:mb-4 lg:text-2xl">
                    Now, let's add your social media accounts to your page.
                  </h1>
                </div>

                <div className="space-y-3">
                  {socialMediaPlatforms.map((platform) => (
                    <div key={platform.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 rounded-xl">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl shadow-[0_.6px_2px_rgba(0,0,0,.06)]">
                          <div
                            className="pointer-events-none absolute inset-0 rounded-xl"
                            style={{ background: BUTTON_GRADIENT }}
                          />
                          <div
                            className={`absolute inset-0 rounded-xl ${platform.color}`}
                          />
                          <div className="relative z-10 text-white">
                            {platform.icon}
                          </div>
                          <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/[0.12]" />
                        </div>
                      </div>
                      <div className="relative flex h-12 w-full items-center rounded-lg bg-[#F5F5F5] px-4">
                        <span className="text-base font-medium text-design-black">
                          @
                        </span>
                        <Input
                          type="text"
                          placeholder="username"
                          value={socialLinks[platform.id] || ''}
                          onChange={(e) =>
                            handleInputChange(platform.id, e.target.value)
                          }
                          className="h-full flex-1 border-0 bg-transparent px-1 text-base text-design-gray outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex w-full flex-row items-center gap-3">
                  <Button
                    className="flex-1 cursor-pointer rounded-md bg-design-black py-6 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-design-black/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 md:rounded-lg md:py-3"
                    disabled={isLoading}
                    onClick={handleNextFromSocial}
                  >
                    Next
                  </Button>
                  <Button
                    onClick={handleSkipSocial}
                    className="flex-1 rounded-md py-6 text-sm text-gray-600 transition-colors hover:text-gray-900 md:py-3"
                    variant={'ghost'}
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                </div>
              </motion.div>
            ) : step === 'projects' ? (
              <motion.div
                key="projects"
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction === 'forward' ? 20 : -20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === 'forward' ? -20 : 20,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                className="space-y-6 sm:space-y-12"
              >
                <div className="space-y-10 text-left">
                  <button
                    onClick={handleBackToSocial}
                    className="mb-4 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    <ArrowLeftIcon className="size-5" />
                  </button>
                  <h1 className="text-xl font-semibold text-design-black sm:text-2xl md:mb-4 lg:text-2xl">
                    You can also add projects, work experiences, and photos.
                  </h1>
                </div>

                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={project.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-design-primary text-white shadow-sm">
                          <span className="text-sm font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <Input
                          type="text"
                          placeholder="Project name"
                          value={project.name}
                          onChange={(e) =>
                            handleProjectInputChange(
                              project.id,
                              'name',
                              e.target.value
                            )
                          }
                          className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {projects.length > 1 && (
                          <button
                            onClick={() => handleRemoveProject(project.id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <div className="ml-[52px]">
                        <Input
                          type="text"
                          placeholder="Project link (optional)"
                          value={project.link}
                          onChange={(e) =>
                            handleProjectInputChange(
                              project.id,
                              'link',
                              e.target.value
                            )
                          }
                          className="h-12 w-full rounded-lg border-0 bg-[#F5F5F5] px-4 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddProject}
                    className="ml-[52px] flex items-center gap-2 text-sm font-medium text-design-primary transition-colors hover:text-design-primaryDark"
                  >
                    <Plus className="h-4 w-4" />
                    Add another project
                  </button>
                </div>

                <div className="flex w-full flex-row items-center gap-3">
                  <Button
                    className="flex-1 cursor-pointer rounded-md bg-design-black py-6 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-design-black/80 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 md:rounded-lg md:py-3"
                    disabled={isLoading}
                    onClick={handleFinalNext}
                  >
                    {isLoading ? <LoaderIcon /> : 'Next'}
                  </Button>
                  <Button
                    onClick={handleSkipProjects}
                    className="flex-1 rounded-md py-6 text-sm text-gray-600 transition-colors hover:text-gray-900 md:py-3"
                    variant={'ghost'}
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                </div>
              </motion.div>
            ) : step === 'complete' ? (
              <motion.div
                key="complete"
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction === 'forward' ? 20 : -20,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === 'forward' ? -20 : 20,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full">
                    <CheckmarkLargeIcon />
                  </div>
                  <div>
                    <h1 className="text-[28px] font-semibold text-design-black sm:text-[36px]">
                      Looks great!
                    </h1>
                  </div>
                </div>

                <p className="text-[24px] text-design-resume">
                  You can keep customising your portfolio and then share it with
                  the world!
                </p>

                <Button
                  onClick={handleGoToProfile}
                  className="w-full cursor-pointer rounded-md bg-design-black px-12 py-6 text-sm font-semibold tracking-tight text-white shadow-lg transition-all duration-300 ease-out hover:bg-design-black/80 active:scale-95 md:w-auto md:rounded-lg md:py-3"
                >
                  Go to Portfolio
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden max-w-[700px] flex-1 items-center justify-center md:flex">
        <SignUpAnimation isActive={step === 'social'} />
      </div>
    </div>
  );
}
