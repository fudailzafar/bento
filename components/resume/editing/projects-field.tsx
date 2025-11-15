import React from 'react';
import { Label, Input, DateRangePicker } from '@/components/ui';
import { SkillField } from '@/components/resume/editing';
import { CrossIcon } from '@/components/icons';

interface Projects {
  skills: string[];
  title: string;
  description: string;
  liveLink: string;
  githubLink: string;
  start: string;
  end: string | null;
}

interface ProjectsFieldProps {
  project: Projects;
  index: number;
  onUpdate: (index: number, updatedWork: Projects) => void;
  onDelete: (index: number) => void;
}

export const ProjectsField: React.FC<ProjectsFieldProps> = ({
  project,
  index,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="group relative rounded-md p-4">
      <button
        className="absolute right-2 top-2 text-gray-400 transition-colors hover:text-red-500"
        onClick={() => onDelete(index)}
      >
        <CrossIcon className="h-5 w-5" />
      </button>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label
            htmlFor={`work-title-${index}`}
            className="text-sm font-medium"
          >
            Project Title
          </Label>
          <Input
            id={`work-title-${index}`}
            value={project.title}
            onChange={(e) => {
              onUpdate(index, {
                ...project,
                title: e.target.value,
              });
            }}
            placeholder="Project Title"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-sm font-medium">Date Range</Label>
          <DateRangePicker
            startDate={project.start}
            endDate={project.end}
            onStartDateChange={(date) => {
              onUpdate(index, {
                ...project,
                start: date,
              });
            }}
            onEndDateChange={(date) => {
              onUpdate(index, {
                ...project,
                end: date,
              });
            }}
          />
        </div>

        <div>
          <Label
            htmlFor={`work-company-${index}`}
            className="text-sm font-medium"
          >
            GitHub Link
          </Label>
          <Input
            id={`project-githubLink-${index}`}
            value={project.githubLink}
            onChange={(e) => {
              onUpdate(index, {
                ...project,
                githubLink: e.target.value,
              });
            }}
            placeholder="www.github.com/username/projectname"
            required
          />
        </div>

        <div>
          <Label
            htmlFor={`project-liveLink-${index}`}
            className="text-sm font-medium"
          >
            Live Link
          </Label>
          <Input
            id={`project-liveLink-${index}`}
            value={project.liveLink}
            onChange={(e) => {
              onUpdate(index, {
                ...project,
                liveLink: e.target.value,
              });
            }}
            placeholder="www.example.com"
          />
        </div>

        <div className="md:col-span-2">
          <Label
            htmlFor={`work-description-${index}`}
            className="text-sm font-medium"
          >
            Description
          </Label>
          <textarea
            id={`work-description-${index}`}
            className="w-full rounded-md border p-2 text-sm"
            value={project.description}
            onChange={(e) => {
              onUpdate(index, {
                ...project,
                description: e.target.value,
              });
            }}
            placeholder="Description"
            rows={3}
          />
        </div>

        {/* Skills Section */}
        <div className="md:col-span-2">
          <Label className="text-sm font-medium">Skills</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(project.skills || []).map((skill, skillIdx) => (
              <SkillField
                key={skillIdx}
                skill={skill}
                index={skillIdx}
                onUpdate={(skillIdx, updatedSkill) => {
                  const newSkills = [...(project.skills || [])];
                  newSkills[skillIdx] = updatedSkill;
                  onUpdate(index, { ...project, skills: newSkills });
                }}
                onDelete={(skillIdx) => {
                  const newSkills = [...(project.skills || [])];
                  newSkills.splice(skillIdx, 1);
                  onUpdate(index, { ...project, skills: newSkills });
                }}
              />
            ))}
            <button
              type="button"
              className="rounded bg-gray-200 px-2 py-1 text-xs"
              onClick={() => {
                const newSkills = [...(project.skills || []), ''];
                onUpdate(index, { ...project, skills: newSkills });
              }}
            >
              + Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
