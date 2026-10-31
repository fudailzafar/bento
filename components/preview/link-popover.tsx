'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion } from 'framer-motion';
import { BentoTooltip } from '@/components/common/bento-tooltip';
import { asUrl } from '@/lib/media';
import { BentoButton, BentoInput } from '@/components/auth/bento-ui';

// The dock's link button: it opens a small field above itself, and adding a
// link there creates its widget, already filled in.
export function LinkPopover({
  onAdd,
  mobile: forcedMobile,
  children,
}: {
  onAdd?: (url: string) => void;
  mobile?: boolean;
  // The button, given the function that opens and closes the popover.
  children: (toggle: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const narrow = useMediaQuery('(max-width: 1279px)');
  const mobile = forcedMobile || narrow;

  useEffect(() => {
    if (!open || mobile) return;
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
  }, [open, mobile]);

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
    <div ref={box} className="relative flex">
      <BentoTooltip content="Link" disabled={open}>
        {children(() => setOpen((o) => !o))}
      </BentoTooltip>
      {open && mobile && (
        <MobileLinkSheet
          value={value}
          setValue={(v) => {
            setValue(v);
            setError('');
          }}
          error={error}
          onSubmit={submit}
          onClose={() => setOpen(false)}
        />
      )}
      {open && !mobile && (
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

// bento's phone version: a sheet just above the keyboard, with a Paste button
// that becomes Add once there is something to add.
function MobileLinkSheet({
  value,
  setValue,
  error,
  onSubmit,
  onClose,
}: {
  value: string;
  setValue: (value: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  const [keyboard, setKeyboard] = useState(0);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const read = () =>
      setKeyboard(
        Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      );
    read();
    viewport.addEventListener('resize', read);
    viewport.addEventListener('scroll', read);
    return () => {
      viewport.removeEventListener('resize', read);
      viewport.removeEventListener('scroll', read);
    };
  }, []);

  const paste = async () => {
    try {
      setValue((await navigator.clipboard.readText()).trim());
    } catch {
      // Clipboard access was refused: the field can still be typed into.
    }
  };

  return createPortal(
    <div data-keep-selection className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <form
        onSubmit={onSubmit}
        className="absolute inset-x-4 mx-auto max-w-[480px]"
        style={{ bottom: Math.max(24, keyboard + 24) }}
      >
        <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-[0_0_0_1px_rgba(0,0,0,.04),0_27px_54px_rgba(0,0,0,.08),0_10.4px_17.2px_rgba(0,0,0,.05),0_2.2px_4.4px_rgba(0,0,0,.03)]">
          <input
            autoFocus
            aria-label="Link"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="Enter Link"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-base text-black outline-none placeholder:text-black/30"
          />
          <button
            type={value.trim() ? 'submit' : 'button'}
            onClick={value.trim() ? undefined : paste}
            className="h-12 shrink-0 rounded-xl bg-white px-6 text-base font-semibold text-black shadow-[0_0_0_1px_rgba(0,0,0,.06),0_2px_4px_rgba(0,0,0,.08)] transition-transform active:scale-95"
          >
            {value.trim() ? 'Add' : 'Paste'}
          </button>
        </div>
        {error && (
          <p className="mt-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#ff2222] shadow">
            {error}
          </p>
        )}
      </form>
    </div>,
    document.body
  );
}
