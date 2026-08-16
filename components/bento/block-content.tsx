'use client';

import { Block } from '@/lib';
import { LinkIcon } from '@/components/icons';
import { ImageOff, MapPin } from 'lucide-react';

export function BlockContent({
  block,
  interactive = false,
}: {
  block: Block;
  interactive?: boolean;
}) {
  switch (block.type) {
    case 'LINK': {
      const { url, title, icon } = block.data as {
        url?: string;
        title?: string;
        icon?: string;
      };
      const inner = (
        <div className="flex h-full w-full flex-col justify-between bg-card p-6">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-muted shadow-sm">
            {icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={icon} alt="" className="size-8 object-contain" />
            ) : (
              <LinkIcon className="size-6 text-muted-foreground" />
            )}
          </div>
          <h3 className="mt-3 line-clamp-2 text-sm font-medium leading-tight text-card-foreground">
            {title || 'Untitled link'}
          </h3>
        </div>
      );
      if (interactive && url) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
          >
            {inner}
          </a>
        );
      }
      return inner;
    }

    case 'IMAGE': {
      const { url, alt } = block.data as { url?: string; alt?: string };
      if (!url) {
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <ImageOff className="size-6" />
            <span className="text-xs font-medium">Add an image</span>
          </div>
        );
      }
      return (
        <div className="h-full w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt || ''}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    case 'TEXT': {
      const { content } = block.data as { content?: string };
      return (
        <div className="flex h-full w-full flex-col justify-center overflow-hidden bg-card p-6">
          <p className="line-clamp-[8] whitespace-pre-wrap text-sm text-card-foreground">
            {content || 'Empty text block'}
          </p>
        </div>
      );
    }

    case 'MAP': {
      const { location, label } = block.data as {
        location?: string;
        label?: string;
      };
      return (
        <div
          className="relative h-full w-full overflow-hidden bg-muted"
          style={{
            backgroundImage:
              'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            color: 'hsl(var(--muted-foreground) / 0.35)',
          }}
        >
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm backdrop-blur-md">
            <MapPin className="size-4" />
            {location ? `${label || 'Where I live'} · ${location}` : (label || 'Where I live')}
          </div>
        </div>
      );
    }

    case 'SECTION_TITLE': {
      const { title } = block.data as { title?: string };
      return (
        <div className="flex h-full w-full items-center bg-card px-6">
          <h2 className="text-xl font-bold tracking-tight text-card-foreground">
            {title || 'Section'}
          </h2>
        </div>
      );
    }
  }
}
