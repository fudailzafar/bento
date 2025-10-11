import { CrossIcon } from '@/components/icons';
import React from 'react';

interface SkillFieldProps {
  skill: string;
  index: number;
  onUpdate: (index: number, updatedSkill: string) => void;
  onDelete: (index: number) => void;
}

export const SkillField: React.FC<SkillFieldProps> = ({
  skill,
  index,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="group relative flex w-fit items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          // Trim whitespace from both ends to prevent inconsistencies
          const trimmedSkill = (e.currentTarget.textContent || '').trim();
          onUpdate(index, trimmedSkill);
        }}
        className="h-6 min-w-[40px] overflow-hidden bg-transparent py-0 outline-none"
        style={{ width: 'fit-content' }}
      >
        {skill}
      </div>
      <button
        className="text-gray-400 transition-colors hover:text-red-500"
        onClick={() => onDelete(index)}
      >
        <CrossIcon />
      </button>
    </div>
  );
};
