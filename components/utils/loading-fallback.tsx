import React from 'react';
import { LoaderIcon } from '@/components/icons';

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-[80vh] flex-col">
      <LoaderIcon className="h-10 w-10 mr-2" />
      <p className="mt-2.5  max-w-[400px] text-center text-lg">{message}</p>
    </div>
  );
};

export default LoadingFallback;
