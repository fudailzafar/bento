import { Header } from '@/components/common';
import { ReactQueryClientProvider } from '@/components/utils';
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ReactQueryClientProvider>
        <section className="flex-1 flex flex-col min-h-[calc(100vh-200px)]">
          {children}
        </section>
      </ReactQueryClientProvider>
    </>
  );
}
