import React from 'react';
import { LoaderIcon } from '@/components/icons';

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message }) => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <LoaderIcon className="mr-2 h-10 w-10" />
      <p className="mt-2.5 max-w-[400px] text-center text-lg">{message}</p>
    </div>
  );
};

export default LoadingFallback;
