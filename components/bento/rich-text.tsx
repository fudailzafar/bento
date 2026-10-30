'use client';

import { useEffect, useRef, useState } from 'react';
import { parseRich, renderRichInto, serializeRich } from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import { NO_DRAG } from './editing/no-drag';

// A note's bold, italic and linked text as it shows on the profile.
export function RichText({
  text,
  plainLinks,
}: {
  text: string;
  // Inside a tile that is already a link, links can't nest: underline only.
  plainLinks?: boolean;
}) {
  return (
    <>
      {parseRich(text).map((span, i) => {
        let node: React.ReactNode = span.text;
        if (span.italic) node = <em>{node}</em>;
        if (span.bold) node = <strong className="font-bold">{node}</strong>;
        if (span.href) {
          node = plainLinks ? (
            <span className="underline">{node}</span>
          ) : (
            <a
              href={span.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

// Marks the editing surface so the toolbar can find it.
export const NOTE_EDITOR = 'data-note-editor';

// A note in the editor: typed straight into, with bold, italic and links
// applied to the selection (the toolbar's B, I and link buttons, or ⌘B / ⌘I).
export function NoteEditor({
  content,
  color,
  className,
  textClass,
  onChange,
  preview,
}: {
  content: string;
  color?: string;
  className: string;
  textClass: string;
  onChange: (value: string) => void;
  preview: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  // The last note this editor wrote, so typing isn't redrawn over itself.
  const written = useRef<string | null>(null);

  useEffect(() => {
    const el = surface.current;
    if (!el || written.current === content) return;
    renderRichInto(el, content);
    written.current = content;
  }, [content, focused]);

  useEffect(() => {
    if (focused && preview) surface.current?.focus();
  }, [focused, preview]);

  if (preview && !focused) {
    return (
      <div
        className="h-full w-full cursor-text"
        onClick={() => setFocused(true)}
      >
        {preview}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-full cursor-text flex-col overflow-hidden',
        className
      )}
      style={{ background: color ?? '#FFFFFF' }}
      onClick={() => surface.current?.focus()}
    >
      <div
        ref={(el) => {
          surface.current = el;
          // A fresh surface (after the quote preview) needs drawing again.
          if (el && !el.hasChildNodes()) written.current = null;
        }}
        {...{ [NOTE_EDITOR]: '' }}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder="Add note..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onInput={(e) => {
          const value = serializeRich(e.currentTarget);
          written.current = value;
          onChange(value);
        }}
        onKeyDown={(e) => {
          // One <br> per line break, not a block per line.
          if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertLineBreak');
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand(
            'insertText',
            false,
            e.clipboardData.getData('text/plain')
          );
        }}
        className={cn(
          NO_DRAG,
          'max-h-full w-full whitespace-pre-wrap break-words outline-none empty:before:opacity-40 empty:before:content-[attr(data-placeholder)] [&_a]:underline',
          textClass
        )}
      />
    </div>
  );
}
