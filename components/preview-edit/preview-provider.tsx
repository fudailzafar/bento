'use client';

import { TamboProvider } from '@tambo-ai/react';
import { components } from '@/components/lib/tambo';
import { ReactNode } from 'react';

export function PreviewProvider({ children }: { children: ReactNode }) {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
    >
      {children}
    </TamboProvider>
  );
}
