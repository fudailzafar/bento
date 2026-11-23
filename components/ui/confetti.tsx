'use client';

import type {
  GlobalOptions as ConfettiGlobalOptions,
  Options as ConfettiOptions,
} from 'canvas-confetti';
import { burstFrom } from '@/lib/confetti';
import React from 'react';

import { Button } from '@/components/ui';

interface ConfettiButtonProps extends React.ComponentProps<'button'> {
  options?: ConfettiOptions &
    ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
}

const ConfettiButtonComponent = ({
  options,
  children,
  ...props
}: ConfettiButtonProps) => {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await burstFrom(event.currentTarget, options);
    } catch (error) {
      console.error('Confetti button error:', error);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

ConfettiButtonComponent.displayName = 'ConfettiButton';

export const ConfettiButton = ConfettiButtonComponent;
