'use client';

import { Section, Button, ProjectCard } from '@/components/ui';
import { ResumeDataSchemaType } from '@/lib';
import { getShortMonth, getYear } from '@/components/resume';
import { useMemo, useState } from 'react';
import React from 'react';
import { BlurFade } from '@/components/magicui';
import { ProjectsField } from '@/components/resume/editing';
import { PenIcon, TrashIcon } from '@/components/icons';

const BLUR_FADE_DELAY = 0.04;

export function Projects({
  projects,
  isEditMode,
  onChangeProjects,
}: {
  projects?: ResumeDataSchemaType['projects'];
  isEditMode?: boolean;
  onChangeProjects?: (newProjects: ResumeDataSchemaType['projects']) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const handleDelete = (index: number) => {
    if (onChangeProjects && projects) {
      const newProjects = [...projects];
      newProjects.splice(index, 1);
      onChangeProjects(newProjects);
      setEditingIndex(null);
    }
  };

  const handleUpdate = (
    index: number,
    updatedProject: ResumeDataSchemaType['projects'][0]
  ) => {
    if (onChangeProjects && projects) {
      const newProjects = [...projects];
      newProjects[index] = {
        ...updatedProject,
        end: updatedProject.end ?? null,
        skills: Array.isArray(updatedProject.skills)
          ? updatedProject.skills
          : [],
      };
      onChangeProjects(newProjects);
    }
  };

  if (validProjects.length === 0 && !isEditMode) {
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
                I&apos;ve worked on a variety of projects, from simple ones to
                complex. Here are a few of my favorites.
              </p>
            </div>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
          {(projects || []).map((project, id) => {
            const isEditing = editingIndex === id;
            const isHovered = hoveredIndex === id;

            // Show edit form if editing
            if (isEditMode && isEditing) {
              return (
                <div
                  key={id}
                  className="col-span-1 sm:col-span-2 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                >
                  <ProjectsField
                    project={{
                      ...project,
                      skills: Array.isArray(project.skills)
                        ? project.skills
                        : [],
                    }}
                    index={id}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setEditingIndex(null)}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              );
            }

            // Skip invalid entries in view mode
            if (!project.title || !project.description) {
              if (!isEditMode) return null;
            }

            const formattedDate = `${getShortMonth(project.start)} ${getYear(
              project.start
            )} - ${
              !!project.end
                ? `${getShortMonth(project.end)} ${getYear(project.end)}`
                : 'Present'
            }`;

            return (
              <BlurFade
                key={project.title + id}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <div
                  className="relative group"
                  onMouseEnter={() => setHoveredIndex(id)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Edit/Delete buttons for edit mode - positioned on top */}
                  {isEditMode && isHovered && (
                    <>
                      {/* Delete button - top left */}
                      <button
                        onClick={() => handleDelete(id)}
                        className="absolute -top-2 -left-2 size-8 rounded-full hover:bg-gray-50 border border-gray-50 shadow-md hover:text-design-secondary bg-white text-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        aria-label="Delete project"
                      >
                        <TrashIcon className="size-4" />
                      </button>

                      {/* Edit button - top right */}
                      <button
                        onClick={() => setEditingIndex(id)}
                        className="absolute -top-2 -right-2 size-8 rounded-full bg-black border-gray-50 shadow-md text-white  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                        aria-label="Edit project"
                      >
                        <PenIcon className="size-4" />
                      </button>
                    </>
                  )}

                  <ProjectCard
                    liveLink={project.liveLink}
                    title={project.title}
                    description={project.description}
                    dates={formattedDate}
                    githubLink={project.githubLink}
                    tags={project.skills}
                    image={project.image || undefined}
                    isEditMode={isEditMode}
                    onImageChange={(newImageUrl) => {
                      handleUpdate(id, {
                        ...project,
                        image: newImageUrl,
                      });
                    }}
                  />
                </div>
              </BlurFade>
            );
          })}
        </div>

        
      </div>
    </Section>
  );
}
