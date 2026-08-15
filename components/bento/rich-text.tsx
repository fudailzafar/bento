'use client';

import { useEffect, useRef, useState } from 'react';
import {
  isQuote,
  isQuoteMark,
  parseRich,
  plainRich,
  quoteBody,
  richHtmlFromPaste,
  renderRichInto,
  serializeRich,
  withQuoteBody,
} from '@/lib/rich-text';
import { cn } from '@/lib/utils';
import { NO_DRAG } from './editing/no-drag';

// A note's bold and italic text as it shows on the profile.
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseRich(text).map((span, i) => {
        let node: React.ReactNode = span.text;
        if (span.italic) node = <em>{node}</em>;
        if (span.bold) node = <strong className="font-semibold">{node}</strong>;
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

// Marks the editing surface so the toolbar can find it.
export const NOTE_EDITOR = 'data-note-editor';

// A note in the editor: typed straight into, with bold and italic applied to
// the selection (the toolbar's B and I, or ⌘B / ⌘I). Type an opening quote
// mark and press Enter and the note becomes a quote; typing -- at the start
// of a line makes the author's dash.
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
  // The quote as visitors see it, shown while it isn't being edited.
  preview: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const surface = useRef<HTMLDivElement | null>(null);
  // What this editor last wrote, so typing isn't redrawn over itself.
  const written = useRef<string | null>(null);
  const quote = isQuote(content);
  const body = quote ? quoteBody(content) : content;

  useEffect(() => {
    const el = surface.current;
    if (!el || written.current === body) return;
    renderRichInto(el, body);
    written.current = body;
  }, [body, focused]);

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

  const write = (value: string) => {
    written.current = value;
    onChange(quote ? withQuoteBody(value) : value);
  };

  return (
    <div
      className={cn(
        'flex h-full w-full cursor-text flex-col overflow-hidden',
        className
      )}
      style={{ background: color ?? '#FFFFFF' }}
      onClick={() => surface.current?.focus()}
    >
      {quote && (
        <span
          className="quote-symbol block text-[length:calc(60px*var(--ws,1))] font-bold not-italic leading-[calc(52px*var(--ws,1))]"
          aria-hidden="true"
        >
          &ldquo;
        </span>
      )}
      <div
        ref={(el) => {
          surface.current = el;
          // A fresh surface (after the quote view) needs drawing again.
          if (el && !el.hasChildNodes()) written.current = null;
        }}
        {...{ [NOTE_EDITOR]: '' }}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={quote ? 'Type your quote' : 'Add note...'}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onInput={(e) => write(serializeRich(e.currentTarget))}
        onKeyDown={(e) => {
          const el = e.currentTarget;
          if (e.key === 'Enter') {
            e.preventDefault();
            // An opening quote mark alone on the line starts a quote.
            if (!quote && isQuoteMark(plainRich(serializeRich(el)))) {
              el.replaceChildren();
              written.current = '';
              onChange(withQuoteBody(''));
              return;
            }
            // One <br> per line break, not a block per line.
            document.execCommand('insertLineBreak');
          } else if (e.key === 'Backspace' && quote && !el.textContent) {
            // Backspacing an empty quote turns it back into a plain note.
            e.preventDefault();
            written.current = '';
            onChange('');
          } else if (e.key === '-' && !e.metaKey && !e.ctrlKey) {
            // Two hyphens at the start of a line make the author's dash.
            const selection = window.getSelection();
            const node = selection?.anchorNode;
            if (selection?.isCollapsed && node?.nodeType === Node.TEXT_NODE) {
              const text = node as Text;
              const offset = selection.anchorOffset;
              const previous = text.previousSibling as HTMLElement | null;
              // The hyphen before the caret starts a line: the text's start
              // or right after a line break.
              const atLineStart =
                text.data[offset - 1] === '-' &&
                (offset === 1
                  ? !previous || previous.tagName === 'BR'
                  : text.data[offset - 2] === '\n');
              if (atLineStart) {
                e.preventDefault();
                document.execCommand('delete');
                document.execCommand('insertText', false, '—');
              }
            }
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          // Bold and italic survive a paste from a web page or document.
          const html = e.clipboardData.getData('text/html');
          const rich = html ? richHtmlFromPaste(html) : null;
          if (rich) {
            document.execCommand('insertHTML', false, rich);
          } else {
            document.execCommand(
              'insertText',
              false,
              e.clipboardData.getData('text/plain')
            );
          }
        }}
        className={cn(
          NO_DRAG,
          'max-h-full w-full whitespace-pre-wrap break-words outline-none empty:before:opacity-40 empty:before:content-[attr(data-placeholder)]',
          quote && 'italic',
          textClass
        )}
      />
    </div>
  );
}
