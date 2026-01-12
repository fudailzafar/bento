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
  viewMode = 'desktop',
}: {
  projects?: ResumeDataSchemaType['projects'];
  isEditMode?: boolean;
  onChangeProjects?: (newProjects: ResumeDataSchemaType['projects']) => void;
  viewMode?: 'desktop' | 'mobile';
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
      <div className="">
        <div
          className={`mx-auto grid max-w-[800px] gap-3 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}
        >
          {(projects || []).map((project, id) => {
            const isEditing = editingIndex === id;
            const isHovered = hoveredIndex === id;

            // Show edit form if editing
            if (isEditMode && isEditing) {
              return (
                <div
                  key={id}
                  className="col-span-1 rounded-lg bg-gray-50 p-4 dark:bg-gray-900 xl:col-span-2"
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

            return isEditMode ? (
              <div
                className="group relative"
                onMouseEnter={() => setHoveredIndex(id)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Edit/Delete buttons for edit mode - positioned on top */}
                {isEditMode && isHovered && (
                  <>
                    {/* Delete button - top left */}
                    <button
                      onClick={() => handleDelete(id)}
                      className="absolute -left-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-black opacity-0 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 active:scale-95 active:bg-gray-100 group-hover:opacity-100"
                      aria-label="Delete project"
                    >
                      <TrashIcon className="size-4" />
                    </button>

                    {/* Edit button - top right */}
                    <button
                      onClick={() => setEditingIndex(id)}
                      className="absolute -right-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full border-gray-50 bg-black text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100"
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
            ) : (
              <BlurFade
                key={project.title + id}
                delay={BLUR_FADE_DELAY * 12 + id * 0.05}
              >
                <div
                  className="group relative"
                  onMouseEnter={() => setHoveredIndex(id)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Edit/Delete buttons for edit mode - positioned on top */}
                  {isEditMode && isHovered && (
                    <>
                      {/* Delete button - top left */}
                      <button
                        onClick={() => handleDelete(id)}
                        className="absolute -left-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full border border-gray-100 bg-white text-black opacity-0 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-50 active:scale-95 active:bg-gray-100 group-hover:opacity-100"
                        aria-label="Delete project"
                      >
                        <TrashIcon className="size-4" />
                      </button>

                      {/* Edit button - top right */}
                      <button
                        onClick={() => setEditingIndex(id)}
                        className="absolute -right-2 -top-2 z-10 flex size-8 items-center justify-center rounded-full border-gray-50 bg-black text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100"
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
