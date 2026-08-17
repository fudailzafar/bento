'use client';

import { Toaster } from 'sonner';

// bento's notification: a white card with a green check and soft grey text,
// top right. Every kind of toast, errors included, looks the same.
function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#6FDB83" />
      <circle cx="12" cy="12" r="11.5" stroke="black" strokeOpacity="0.06" />
      <path
        d="M7.5 12.6l3 3 6-6.6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BentoToaster() {
  return (
    <Toaster
      position="top-right"
      offset={24}
      icons={{
        success: <CheckIcon />,
        error: <CheckIcon />,
        info: <CheckIcon />,
        warning: <CheckIcon />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex w-[308px] max-w-[calc(100vw-48px)] items-center gap-2.5 rounded-[20px] bg-white px-4 py-3.5 shadow-[0_0_0_1px_rgba(0,0,0,.04),0_11px_36px_rgba(0,0,0,.06),0_7px_21px_rgba(0,0,0,.05),0_4px_11px_rgba(0,0,0,.04),0_2px_6px_rgba(0,0,0,.03)]',
          icon: 'flex size-6 shrink-0 items-center justify-center',
          content: 'min-w-0 flex-1',
          title: 'text-[15px] font-normal leading-[19px] text-black/60',
          description: 'mt-0.5 text-[13px] leading-4 text-black/50',
        },
      }}
    />
  );
}
