import { Header } from '@/components/common';
import { ReactQueryClientProvider } from '@/components/utils';
import { PreviewProvider } from './preview-provider';
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReactQueryClientProvider>
        <PreviewProvider>
          <section className="flex min-h-[calc(100vh-200px)] flex-1 flex-col">
            {children}
          </section>
        </PreviewProvider>
      </ReactQueryClientProvider>
      <Header />
    </>
  );
}
