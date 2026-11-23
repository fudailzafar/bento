import { describe, expect, it } from 'vitest';
import {
  escapeRich,
  isQuote,
  parseQuote,
  parseRich,
  plainRich,
} from '@/lib/rich-text';

describe('parseRich', () => {
  it('reads **bold** and *italic*', () => {
    expect(parseRich('a **b** *c*')).toEqual([
      { text: 'a ', bold: false, italic: false },
      { text: 'b', bold: true, italic: false },
      { text: ' ', bold: false, italic: false },
      { text: 'c', bold: false, italic: true },
    ]);
  });

  it('treats a backslash as an escape', () => {
    expect(plainRich('1 \\* 2 \\\\ 3')).toBe('1 * 2 \\ 3');
  });

  it('round-trips escaped text', () => {
    const text = 'stars * and \\ backslashes';
    expect(plainRich(escapeRich(text))).toBe(text);
  });
});

describe('quotes', () => {
  it('needs a quote mark alone on the first line', () => {
    expect(isQuote('“\nHello')).toBe(true);
    expect(isQuote('“ Hello')).toBe(false);
    expect(isQuote('Hello\nworld')).toBe(false);
  });

  it('splits the body from the author line', () => {
    expect(parseQuote('“\nStay hungry.\n— Steve')).toEqual({
      body: 'Stay hungry.',
      cite: 'Steve',
    });
  });

  it('has no author without a dash line', () => {
    expect(parseQuote('“\nStay hungry.\nStay foolish.')).toEqual({
      body: 'Stay hungry.\nStay foolish.',
      cite: null,
    });
  });
});
