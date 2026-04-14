'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '@/lib/utils';

// Form primitives matching bento.me's auth screens (their Input, PasswordInput
// and Button components, rebuilt from the archived CSS modules).

export const FADE_EASE = [0.5, 1, 0.89, 1] as const;
export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: FADE_EASE },
};

interface BentoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  addonLeft?: ReactNode;
  addonRight?: ReactNode;
  error?: boolean;
}

export const BentoInput = forwardRef<HTMLInputElement, BentoInputProps>(
  function BentoInput({ addonLeft, addonRight, error, className, ...props }, ref) {
    const wrapper = useRef<HTMLDivElement>(null);

    return (
      <div
        ref={wrapper}
        className={cn('rounded-xl', className)}
        onClick={() => {
          const input = wrapper.current?.querySelector('input');
          if (input && document.activeElement !== input) input.focus();
        }}
      >
        <div
          className={cn(
            'relative rounded-xl bg-[#f7f7f7] text-base leading-5 sm:rounded-lg sm:text-sm',
            error &&
              "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-2 after:border-[#ff2222] after:content-['']"
          )}
        >
          <div className="flex w-full rounded-[inherit]">
            {addonLeft && (
              <div className="flex items-center justify-center rounded-l-lg pl-3">
                {addonLeft}
              </div>
            )}
            <input
              ref={ref}
              className="w-full rounded-[inherit] bg-transparent p-4 text-black outline-none placeholder:text-[#bfbfbf] sm:p-3"
              {...props}
            />
            {addonRight && (
              <div className="flex items-center justify-center rounded-r-lg pr-2">
                {addonRight}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

type Variant = 'primary' | 'blue' | 'oauth' | 'white';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-black text-white shadow-[0_3px_2px_rgba(0,0,0,.06)] enabled:hover:bg-[#292929] enabled:active:bg-black enabled:active:text-[#adadad] disabled:bg-[#6c6c6c]',
  blue: '!rounded-md bg-[#768cff] text-white shadow-[0_3px_4px_rgba(0,0,0,.06)] hover:bg-[#6a80f6] active:bg-[#667df5]',
  oauth:
    'bg-[#1d9bf0] text-white shadow-[0_3px_2px_rgba(0,0,0,.06)] enabled:hover:bg-[#1a96eb] enabled:active:bg-[#168dde] enabled:active:text-[#ebebeb] disabled:bg-[rgba(29,155,240,.6)]',
  white:
    'bg-white text-black enabled:hover:bg-[#fafafa] enabled:active:bg-[#ebebeb] disabled:text-[#bfbfbf]',
};

interface BentoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function BentoButton({
  variant = 'primary',
  icon,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: BentoButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'relative select-none overflow-hidden rounded-xl px-2.5 py-2 text-sm font-semibold leading-5 outline-offset-2 [transition:transform_.1s_cubic-bezier(.427,.073,.105,.997),color_.1s_cubic-bezier(.427,.073,.105,.997)] focus:outline-black enabled:active:scale-[.96] enabled:active:shadow-none sm:rounded-lg',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative z-10 flex items-center justify-center',
          loading && 'opacity-0'
        )}
      >
        {icon && children && <div className="mr-2">{icon}</div>}
        {children}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size={16} />
        </div>
      )}
    </button>
  );
}

export function PasswordInput(props: Omit<BentoInputProps, 'type'>) {
  const [type, setType] = useState<'password' | 'text' | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  // Keep the caret at the end when toggling visibility, as bento does.
  useEffect(() => {
    if (ref.current && type !== null) {
      const end = ref.current.value.length;
      ref.current.setSelectionRange(end, end);
      ref.current.focus();
    }
  }, [type]);

  return (
    <BentoInput
      {...props}
      ref={ref}
      type={type ?? 'password'}
      addonRight={
        <BentoButton
          variant="white"
          className="h-[calc(100%-1rem)] w-[60px] !rounded-[4px] !py-0 !text-xs text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setType(type === 'text' ? 'password' : 'text');
          }}
        >
          {type === 'text' ? 'Hide' : 'Show'}
        </BentoButton>
      }
    />
  );
}

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <svg height={size} width={size} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          <rect x="44" y="0.5" rx="6" ry="6.29" width="12" height="37" fill="currentColor">
            <animate
              attributeName="opacity"
              values="1;0"
              keyTimes="0;1"
              dur="0.625s"
              begin={`${-0.625 + (i + 1) * 0.10416666666666666}s`}
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ))}
    </svg>
  );
}

export function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 8.68348C16.5 8.15673 16.4523 7.65666 16.3706 7.16992H8.67383V10.177H13.0807C12.8832 11.1638 12.3042 11.9973 11.446 12.5641V14.5643H14.0752C15.6145 13.1708 16.5 11.1172 16.5 8.68348Z" fill="white" />
      <path d="M8.6728 16.4997C10.8797 16.4997 12.7255 15.7796 14.0741 14.5594L11.445 12.5591C10.7094 13.0392 9.77623 13.3325 8.6728 13.3325C6.54087 13.3325 4.73589 11.9257 4.08882 10.0254H1.37793V12.0857C2.71975 14.6994 5.47831 16.4997 8.6728 16.4997Z" fill="white" />
      <path d="M4.08954 10.0282C3.91926 9.54808 3.83071 9.03467 3.83071 8.50126C3.83071 7.96785 3.92607 7.45444 4.08954 6.97437V4.91406H1.37865C0.820129 5.99422 0.5 7.20773 0.5 8.50126C0.5 9.79478 0.820129 11.0083 1.37865 12.0885L4.08954 10.0282Z" fill="white" />
      <path d="M8.6728 3.66714C9.8784 3.66714 10.9546 4.07386 11.806 4.86731L14.1354 2.58698C12.7255 1.29345 10.8797 0.5 8.6728 0.5C5.47831 0.5 2.71975 2.30027 1.37793 4.91399L4.08882 6.97429C4.73589 5.07401 6.54087 3.66714 8.6728 3.66714Z" fill="white" />
    </svg>
  );
}

export function CrossIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.36569 2.23431C3.05327 1.9219 2.54673 1.9219 2.23431 2.23431C1.9219 2.54673 1.9219 3.05327 2.23431 3.36569L6.06274 7.19411L2.23431 11.0225C1.9219 11.335 1.9219 11.8415 2.23431 12.1539C2.54673 12.4663 3.05327 12.4663 3.36569 12.1539L7.19411 8.32548L11.0225 12.1539C11.335 12.4663 11.8415 12.4663 12.1539 12.1539C12.4663 11.8415 12.4663 11.335 12.1539 11.0225L8.32548 7.19411L12.1539 3.36569C12.4663 3.05327 12.4663 2.54673 12.1539 2.23431C11.8415 1.9219 11.335 1.9219 11.0225 2.23431L7.19411 6.06274L3.36569 2.23431Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BackArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.70726 5.70711C7.09778 5.31658 7.09778 4.68342 6.70726 4.29289C6.31673 3.90237 5.68357 3.90237 5.29304 4.29289L0.303336 9.2826C0.116245 9.46432 0 9.71858 0 10C0 10.2814 0.116249 10.5357 0.303346 10.7174L5.29304 15.7071C5.68357 16.0976 6.31673 16.0976 6.70726 15.7071C7.09778 15.3166 7.09778 14.6834 6.70726 14.2929L3.41436 11H19C19.5523 11 20 10.5523 20 10C20 9.44772 19.5523 9 19 9H3.41436L6.70726 5.70711Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Green circle that strokes in, then the tick draws (bento's "order success").
// "delayed" is set-password's timing: the tick waits for the circle.
export function AnimatedCheck({
  size = 16,
  delayed = false,
}: {
  size?: number;
  delayed?: boolean;
}) {
  return (
    <div
      className={cn(
        'text-center text-[#4edd76]',
        delayed ? 'bento-check-delayed' : 'bento-check'
      )}
    >
      <svg viewBox="0 0 154 154" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <circle
            fill="currentColor"
            cx="77"
            cy="77"
            r="72"
            style={{ strokeDasharray: '480px, 480px', strokeDashoffset: '960px' }}
          />
          <polyline
            stroke="#fff"
            strokeWidth="10"
            points="43.5,77.8 63.7,97.9 112.2,49.4"
            style={{ strokeDasharray: '100px, 100px', strokeDashoffset: '200px' }}
          />
        </g>
      </svg>
    </div>
  );
}
