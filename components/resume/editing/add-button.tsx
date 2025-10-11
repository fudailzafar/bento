import React from 'react';

interface AddButtonProps {
  label: string;
  onClick: () => void;
}

export const AddButton: React.FC<AddButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="w-full rounded-md border-2 border-dashed p-2 text-gray-500 hover:border-gray-400"
      onClick={onClick}
    >
      + {label}
    </button>
  );
};
