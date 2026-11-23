import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactNode } from 'react';
import { BreadcrumbSchema } from '@/components/seo';
import { SITE_URL } from '@/lib/site';

// A legal page written as markdown in content/legal: "#" to "####" headings,
// "-" lists, paragraphs, **bold** and [links](url). Nothing else is needed.

// **bold** and [text](url), left to right.
function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      match[1] !== undefined ? (
        <strong key={match.index} className="font-semibold">
          {match[1]}
        </strong>
      ) : (
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {match[2]}
        </a>
      )
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

type Block =
  | { kind: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'paragraph'; text: string };

function parse(source: string): Block[] {
  return source
    .trim()
    .split(/\n{2,}/)
    .map((chunk): Block => {
      const heading = chunk.match(/^(#{1,4}) (.+)$/);
      if (heading) {
        return {
          kind: 'heading',
          level: heading[1].length as 1 | 2 | 3 | 4,
          text: heading[2],
        };
      }
      if (chunk.startsWith('- ')) {
        return {
          kind: 'list',
          items: chunk.split('\n').map((line) => line.slice(2)),
        };
      }
      return { kind: 'paragraph', text: chunk };
    });
}

const HEADING = {
  1: 'mb-2 text-3xl font-bold text-gray-900',
  2: 'mb-4 text-2xl font-semibold text-gray-800',
  3: 'mb-2 text-xl font-medium text-gray-700',
  4: 'mb-2 text-lg font-medium text-gray-700',
} as const;

export function LegalDocument({
  file,
  title,
  path,
}: {
  // File name in content/legal, without ".md".
  file: string;
  // The breadcrumb name.
  title: string;
  path: string;
}) {
  const blocks = parse(
    readFileSync(join(process.cwd(), 'content', 'legal', `${file}.md`), 'utf8')
  );
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: title, url: `${SITE_URL}${path}` },
        ]}
      />
      <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-lg bg-white p-8 shadow-xl">
          {blocks.map((block, i) => {
            const next = blocks[i + 1];
            // More room before a section than between paragraphs.
            const gap =
              next?.kind === 'heading' && next.level <= 3 ? 'mb-8' : 'mb-4';
            if (block.kind === 'heading') {
              const Tag = `h${block.level}` as const;
              return (
                <Tag key={i} className={HEADING[block.level]}>
                  {inline(block.text)}
                </Tag>
              );
            }
            if (block.kind === 'list') {
              return (
                <ul
                  key={i}
                  className={`${gap} list-inside list-disc space-y-2 text-gray-700`}
                >
                  {block.items.map((item, j) => (
                    <li key={j}>{inline(item)}</li>
                  ))}
                </ul>
              );
            }
            // The line under the title is the "last updated" date.
            const meta = blocks[i - 1]?.kind === 'heading' && i === 1;
            return (
              <p
                key={i}
                className={
                  meta ? 'mb-6 text-sm text-gray-500' : `${gap} text-gray-700`
                }
              >
                {inline(block.text)}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
