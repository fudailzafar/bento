// Notes keep their formatting as a small markdown subset in one string:
// **bold**, *italic* and [text](https://link), with \ escaping the marks.

export interface RichSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  href?: string;
}

const LINK = /^\[((?:\\.|[^\]\\])*)\]\(([^)\s]+)\)/;

// Only web links are followed; anything else renders as plain text.
function safeHref(href: string) {
  return /^(https?:\/\/|mailto:)/i.test(href) ? href : undefined;
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
    } else if (char === '[') {
      const match = LINK.exec(source.slice(i));
      const href = match && safeHref(match[2]);
      if (match && href) {
        flush();
        // The link's own text can carry bold and italic too.
        for (const inner of parseRich(match[1])) {
          spans.push({
            ...inner,
            bold: inner.bold || bold,
            italic: inner.italic || italic,
            href,
          });
        }
        i += match[0].length - 1;
      } else {
        text += char;
      }
    } else {
      text += char;
    }
  }
  flush();
  return spans;
}

export function escapeRich(text: string) {
  return text.replace(/[\\*[\]]/g, '\\$&');
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
      if (span.href) {
        const el = document.createElement('a');
        el.href = span.href;
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
    if (tag === 'a') {
      const href = node.getAttribute('href') ?? '';
      return safeHref(href) ? `[${inner}](${href})` : inner;
    }
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
