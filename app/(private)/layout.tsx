import { ReactQueryClientProvider } from '@/components/utils';
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReactQueryClientProvider>
        <section className="flex min-h-[calc(100vh-200px)] flex-1 flex-col">
          {children}
        </section>
      </ReactQueryClientProvider>
    </>
  );
}
