import React from 'react';
import { Label, Input, DateRangePicker } from '@/components/ui';
import { CrossIcon } from '@/components/icons';

interface WorkExperience {
  title: string;
  company: string;
  description: string;
  location: string;
  link: string;
  contract: string;
  start: string;
  end: string | null;
}

interface WorkExperienceFieldProps {
  work: WorkExperience;
  index: number;
  onUpdate: (index: number, updatedWork: WorkExperience) => void;
  onDelete: (index: number) => void;
}

export const WorkExperienceField: React.FC<WorkExperienceFieldProps> = ({
  work,
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
        <CrossIcon />
      </button>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label
            htmlFor={`work-title-${index}`}
            className="text-sm font-medium"
          >
            Job Title
          </Label>
          <Input
            id={`work-title-${index}`}
            value={work.title}
            onChange={(e) => {
              onUpdate(index, {
                ...work,
                title: e.target.value,
              });
            }}
            placeholder="Job Title"
            required
          />
        </div>

        <div>
          <Label
            htmlFor={`work-company-${index}`}
            className="text-sm font-medium"
          >
            Company
          </Label>
          <Input
            id={`work-company-${index}`}
            value={work.company}
            onChange={(e) => {
              onUpdate(index, {
                ...work,
                company: e.target.value,
              });
            }}
            placeholder="Company"
            required
          />
        </div>

        <div>
          <Label
            htmlFor={`work-location-${index}`}
            className="text-sm font-medium"
          >
            Location
          </Label>
          <Input
            id={`work-location-${index}`}
            value={work.location}
            onChange={(e) => {
              onUpdate(index, {
                ...work,
                location: e.target.value,
              });
            }}
            placeholder="Location"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-sm font-medium">Date Range</Label>
          <DateRangePicker
            startDate={work.start}
            endDate={work.end}
            onStartDateChange={(date) => {
              onUpdate(index, {
                ...work,
                start: date,
              });
            }}
            onEndDateChange={(date) => {
              onUpdate(index, {
                ...work,
                end: date,
              });
            }}
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
            value={work.description}
            onChange={(e) => {
              onUpdate(index, {
                ...work,
                description: e.target.value,
              });
            }}
            placeholder="Description"
            rows={3}
            required
          />
        </div>
      </div>
    </div>
  );
};
