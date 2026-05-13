'use client';

import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Copy, Download, Share } from 'lucide-react';

interface ShareSheetProps {
  link: string;
  username: string;
  open: boolean;
  onClose: () => void;
  onCopy: () => Promise<void> | void;
}

// bento's share popover: the profile link with a QR code, copy, download and
// the system share sheet where the browser has one.
export function ShareSheet({
  link,
  username,
  open,
  onClose,
  onCopy,
}: ShareSheetProps) {
  const panel = useRef<HTMLDivElement>(null);
  const qr = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  useEffect(() => {
    if (!open) return;
    setCopied(false);
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      // The toggle button handles its own clicks.
      if ((target as Element).closest?.('[data-share-toggle]')) return;
      if (!panel.current?.contains(target)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const display = link.replace(/^https?:\/\//, '');

  const copy = async () => {
    await onCopy();
    setCopied(true);
  };

  const download = () => {
    const canvas = qr.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${username}-qr.png`;
    a.click();
  };

  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Share your Portfolio"
      className="absolute bottom-full left-0 z-50 mb-3 w-[260px] origin-bottom-left rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,.04),0_27px_54px_rgba(0,0,0,.08),0_10px_17px_rgba(0,0,0,.04)] animate-in fade-in zoom-in-95"
    >
      <div className="mx-auto flex w-fit rounded-xl border border-black/[.06] bg-white p-3">
        <QRCodeCanvas
          ref={qr}
          value={link}
          size={176}
          marginSize={0}
          level="M"
        />
      </div>
      <p className="mt-3 truncate text-center text-sm font-semibold text-black">
        {display}
      </p>
      <div className="mt-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={copy}
          className="flex h-9 items-center justify-center gap-2 rounded-lg bg-design-success text-sm font-semibold text-white transition-all hover:bg-[#3dda69] active:scale-[.97]"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={download}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-black/[.04] text-xs font-semibold text-black transition-all hover:bg-black/[.07] active:scale-[.97]"
          >
            <Download className="size-3.5" />
            QR Code
          </button>
          {canShare && (
            <button
              type="button"
              onClick={() =>
                navigator.share({ url: link, title: username }).catch(() => {})
              }
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-black/[.04] text-xs font-semibold text-black transition-all hover:bg-black/[.07] active:scale-[.97]"
            >
              <Share className="size-3.5" />
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
