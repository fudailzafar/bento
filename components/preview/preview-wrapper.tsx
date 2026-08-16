'use client';

import { ReactQueryClientProvider } from '@/components/utils';
import PreviewClient from '@/components/preview-edit/client';

interface PreviewWrapperProps {
  messageTip?: string;
}

export default function PreviewWrapper({ messageTip }: PreviewWrapperProps) {
  return (
    <ReactQueryClientProvider>
      <section className="flex min-h-[calc(100vh-200px)] flex-1 flex-col">
        <PreviewClient messageTip={messageTip} />
      </section>
    </ReactQueryClientProvider>
  );
}
