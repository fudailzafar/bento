import React from 'react';
import { Label, Input, DateRangePicker } from '@/components/ui';
import { CrossIcon } from '@/components/icons';

interface Education {
  degree: string;
  school: string;
  start: string;
  end: string;
}

interface EducationFieldProps {
  edu: Education;
  index: number;
  onUpdate: (index: number, updatedEdu: Education) => void;
  onDelete: (index: number) => void;
}

export const EducationField: React.FC<EducationFieldProps> = ({
  edu,
  index,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="relative p-4 rounded-md group">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
        onClick={() => onDelete(index)}
      >
        <CrossIcon className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label
            htmlFor={`edu-degree-${index}`}
            className="text-sm font-medium"
          >
            Degree
          </Label>
          <Input
            id={`edu-degree-${index}`}
            value={edu.degree}
            onChange={(e) => {
              onUpdate(index, {
                ...edu,
                degree: e.target.value,
              });
            }}
            placeholder="Degree"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label
            htmlFor={`edu-school-${index}`}
            className="text-sm font-medium"
          >
            School
          </Label>
          <Input
            id={`edu-school-${index}`}
            value={edu.school}
            onChange={(e) => {
              onUpdate(index, {
                ...edu,
                school: e.target.value,
              });
            }}
            placeholder="School"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-sm font-medium">Date Range</Label>
          <DateRangePicker
            startDate={edu.start}
            endDate={edu.end}
            onStartDateChange={(date) => {
              onUpdate(index, {
                ...edu,
                start: date,
              });
            }}
            onEndDateChange={(date) => {
              onUpdate(index, {
                ...edu,
                end: date,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};
