'use client';

import { Section } from '@/components/ui/section';
import { ResumeDataSchemaType } from '@/lib/resume';
import { getShortMonth, getYear } from './resumeUtils';
import { useMemo } from 'react';
import BlurFade from '../magicui/blur-fade';
import React from 'react';
import { ProjectCard } from '../project-card';

const BLUR_FADE_DELAY = 0.04;

export function Projects({
  projects,
}: {
  projects?: ResumeDataSchemaType['projects'];
}) {
  // Filter out invalid projects and pre-format dates
  const validProjects = useMemo(() => {
    return (projects ?? [])
      .filter((item) => item.title && item.description)
      .map((item) => ({
        ...item,
        formattedDate: `${getShortMonth(item.start)} ${getYear(item.start)} - ${
          !!item.end
            ? `${getShortMonth(item.end)} ${getYear(item.end)}`
            : 'Present'
        }`,
      }));
  }, [projects]);

  if (validProjects.length === 0) {
    return null;
  }

  return (
    <Section>
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                My Projects
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Check out my latest work
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I&apos;ve worked on a variety of projects, from simple ones
                to complex. Here are a few of my favorites.
              </p>
            </div>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
          {validProjects.map((project, id) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
            >
              <ProjectCard
                liveLink={project.liveLink}
                key={project.title}
                title={project.title}
                description={project.description}
                dates={project.formattedDate}
                githubLink={project.githubLink}
                tags={project.skills}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </Section>
  );
}
