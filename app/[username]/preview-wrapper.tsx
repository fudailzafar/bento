'use client';

import { ReactQueryClientProvider } from '@/components/utils';
import PreviewClient from '@/components/preview-edit/client';
import { PreviewProvider } from '@/components/preview-edit/preview-provider';
import { Header } from '@/components/common';

interface PreviewWrapperProps {
  messageTip?: string;
}

export default function PreviewWrapper({ messageTip }: PreviewWrapperProps) {
  return (
    <>
      <ReactQueryClientProvider>
        <PreviewProvider>
          <section className="flex min-h-[calc(100vh-200px)] flex-1 flex-col">
            <PreviewClient messageTip={messageTip} />
          </section>
        </PreviewProvider>
      </ReactQueryClientProvider>
      <Header />
    </>
  );
}
