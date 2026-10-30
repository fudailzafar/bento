'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BentoTooltip } from '@/components/common/bento-tooltip';
import { asUrl } from '@/lib/media';
import { BentoButton, BentoInput } from '@/components/auth/bento-ui';

// The dock's link button: it opens a small field above itself, and adding a
// link there creates its widget, already filled in.
export function LinkPopover({
  onAdd,
  children,
}: {
  onAdd?: (url: string) => void;
  // The button, given the function that opens and closes the popover.
  children: (toggle: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return setError('Enter a link.');
    const url = asUrl(value);
    if (!url) return setError('Please enter a valid link.');
    onAdd?.(url);
    setValue('');
    setError('');
    setOpen(false);
  };

  return (
    <div ref={box} className="relative">
      <BentoTooltip content="Link" disabled={open}>
        {children(() => setOpen((o) => !o))}
      </BentoTooltip>
      {open && (
        // Centred on the button by this wrapper: the slide-in animation
        // below sets its own transform, which would drop a translate here.
        <div className="absolute bottom-full left-1/2 z-50 mb-6 -translate-x-1/2">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.29, 1.28, 0.47, 0.99] }}
            className="w-80 max-w-[calc(100vw-32px)] rounded-2xl bg-white p-1.5 shadow-[0_0_0_1px_rgba(0,0,0,.04),0_27px_54px_rgba(0,0,0,.06),0_17.5px_31.625px_rgba(0,0,0,.05),0_10.4px_17.2px_rgba(0,0,0,.04),0_5.4px_8.775px_rgba(0,0,0,.03),0_2.2px_4.4px_rgba(0,0,0,.025),0_.5px_2.125px_rgba(0,0,0,.015)]"
          >
            <BentoInput
              autoFocus
              aria-label="Link"
              placeholder="Enter link here"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
              addonRight={
                // The same white button as the password field's Show / Hide.
                <BentoButton
                  type="submit"
                  variant="white"
                  className="h-[calc(100%-1rem)] w-[60px] !rounded-[4px] !py-0 !text-xs text-black shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                >
                  Add
                </BentoButton>
              }
            />
            {error && (
              <p className="px-2 pb-1 pt-2 text-xs font-medium text-[#ff2222]">
                {error}
              </p>
            )}
          </motion.form>
        </div>
      )}
    </div>
  );
}
