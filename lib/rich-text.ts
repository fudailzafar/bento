// Notes keep their formatting as a small markdown subset in one string:
// **bold** and *italic*, with \ escaping the marks. Links belong to the whole
// widget, never to words inside a note.

export interface RichSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export function parseRich(source: string): RichSpan[] {
  const spans: RichSpan[] = [];
  let bold = false;
  let italic = false;
  let text = '';
  const flush = () => {
    if (text) spans.push({ text, bold, italic });
    text = '';
  };

  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === '\\' && i + 1 < source.length) {
      text += source[++i];
    } else if (char === '*' && source[i + 1] === '*') {
      flush();
      bold = !bold;
      i++;
    } else if (char === '*') {
      flush();
      italic = !italic;
    } else {
      text += char;
    }
  }
  flush();
  return spans;
}

export function escapeRich(text: string) {
  return text.replace(/[\\*]/g, '\\$&');
}

// The note without its marks, for measuring and quote detection.
export function plainRich(source: string) {
  return parseRich(source)
    .map((span) => span.text)
    .join('');
}

// Builds the editing surface's nodes from a note, without touching innerHTML.
export function renderRichInto(root: HTMLElement, source: string) {
  root.replaceChildren();
  for (const span of parseRich(source)) {
    const lines = span.text.split('\n');
    lines.forEach((line, index) => {
      if (index) root.append(document.createElement('br'));
      if (!line) return;
      let node: Node = document.createTextNode(line);
      if (span.italic) {
        const el = document.createElement('i');
        el.append(node);
        node = el;
      }
      if (span.bold) {
        const el = document.createElement('b');
        el.append(node);
        node = el;
      }
      root.append(node);
    });
  }
}

// Reads the editing surface back into a note.
export function serializeRich(root: HTMLElement): string {
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeRich(node.textContent ?? '');
    }
    if (!(node instanceof HTMLElement)) return '';
    const tag = node.tagName.toLowerCase();
    if (tag === 'br') return '\n';
    const inner = [...node.childNodes].map(walk).join('');
    if (!inner) return '';
    if (tag === 'b' || tag === 'strong') return `**${inner}**`;
    if (tag === 'i' || tag === 'em') return `*${inner}*`;
    // Browsers wrap lines in blocks; each starts on a new line.
    if (tag === 'div' || tag === 'p') return `\n${inner}`;
    return inner;
  };
  return [...root.childNodes]
    .map(walk)
    .join('')
    .replace(/^\n/, '')
    .replace(/\n+$/, '');
}

// ---------------------------------------------------------------- quotes

// bento's quote note: type an opening quote mark and press Enter and the note
// becomes a quote. It is stored as a first line holding just “, then the
// quote; a last line starting with a dash is the author.
export const QUOTE_MARKS = '"“”„«»';
export const QUOTE_OPENER = '“';

export function isQuoteMark(text: string) {
  const t = text.trim();
  return t.length === 1 && QUOTE_MARKS.includes(t);
}

export interface ParsedQuote {
  // The quote's marked-up text, without its author line.
  body: string;
  // The author, without the dash.
  cite: string | null;
}

const DASH = /^(?:—|–|--|-)\s*/;

// A quote mark alone on the first line, with a line break after it.
export function isQuote(source: string) {
  const lines = source.split('\n');
  return lines.length > 1 && isQuoteMark(plainRich(lines[0]));
}

export function parseQuote(source: string): ParsedQuote | null {
  if (!isQuote(source)) return null;
  const lines = source.split('\n');
  const rest = lines.slice(1);
  const last = rest[rest.length - 1] ?? '';
  const plainLast = plainRich(last).trim();
  if (rest.length > 1 && DASH.test(plainLast) && plainLast.length > 1) {
    return {
      body: rest.slice(0, -1).join('\n').trim(),
      cite: plainLast.replace(DASH, ''),
    };
  }
  return { body: rest.join('\n').trim(), cite: null };
}

// What the quote's editing surface holds: everything after the opening line.
export function quoteBody(source: string) {
  return source.split('\n').slice(1).join('\n');
}

export function withQuoteBody(body: string) {
  return `${QUOTE_OPENER}\n${body}`;
}

// ------------------------------------------------------------ pasted HTML

const BLOCKS = new Set([
  'p',
  'div',
  'li',
  'ul',
  'ol',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'tr',
  'pre',
]);

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Pasted rich text (a web page, Docs, Word) reduced to what a note keeps:
// bold, italic and line breaks. Everything else, links and colours included,
// is dropped. Returns null when the HTML has no text.
export function richHtmlFromPaste(html: string): string | null {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let out = '';
  const lineBreak = () => {
    if (out && !out.endsWith('<br>')) out += '<br>';
  };

  const walk = (node: Node, bold: boolean, italic: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? '').replace(/[ \t\r\n]+/g, ' ');
      if (!text.trim() && (!out || out.endsWith('<br>'))) return;
      let piece = escapeHtml(text);
      if (italic) piece = `<i>${piece}</i>`;
      if (bold) piece = `<b>${piece}</b>`;
      out += piece;
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    const tag = node.tagName.toLowerCase();
    if (['script', 'style', 'meta', 'head', 'title'].includes(tag)) return;
    if (tag === 'br') {
      out += '<br>';
      return;
    }
    const weight = node.style.fontWeight;
    const nextBold =
      weight === 'normal' || weight === '400'
        ? false
        : /^(bold|bolder|[6-9]00)$/.test(weight) ||
            tag === 'b' ||
            tag === 'strong' ||
            /^h[1-6]$/.test(tag)
          ? true
          : bold;
    const fontStyle = node.style.fontStyle;
    const nextItalic =
      fontStyle === 'normal'
        ? false
        : fontStyle === 'italic' || tag === 'i' || tag === 'em'
          ? true
          : italic;
    const block = BLOCKS.has(tag);
    if (block) lineBreak();
    node.childNodes.forEach((child) => walk(child, nextBold, nextItalic));
    if (block) lineBreak();
  };

  walk(doc.body, false, false);
  const result = out.replace(/(<br>)+$/, '');
  return result.replace(/<[^>]+>/g, '').trim() ? result : null;
}
