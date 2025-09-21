import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GitHubLogoIcon, GlobeIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Markdown from 'react-markdown';

interface Props {
  title: string;
  liveLink?: string;
  githubLink?: string;
  tags?: readonly string[];
  description: string;
  dates?: string;
  link?: string;
  image?: string;
  video?: string;
  className?: string;
}

export function ProjectCard({
  title,
  liveLink,
  githubLink,
  description,
  dates,
  tags,
  link,
  image,
  video,
  className,
}: Props) {
  // Helper to ensure links have https://
  const ensureHttps = (url?: string) => {
    if (!url) return '#';
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
  };

  return (
    <Card
      className={
        'flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full'
      }
    >
      <a
        href={ensureHttps(liveLink)}
        className={cn('block cursor-pointer', className)}
      >
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
          />
        )}
        {image && (
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="h-40 w-full overflow-hidden object-cover object-top"
          />
        )}
      </a>
      <CardHeader className="flex-1 px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base">{title}</CardTitle>
          {dates && <time className="font-sans text-xs">{dates}</time>}
          <div className="hidden font-sans text-xs underline print:visible">
            {link?.replace('https://', '').replace('www.', '').replace('/', '')}
          </div>
          <div
            className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert overflow-y-auto scrollbar-hide"
            style={{
              maxHeight: '6rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
            <Markdown>{description}</Markdown>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                className="px-1 py-0 text-[10px]"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {(liveLink || githubLink) && (
        <CardFooter className="px-2 py-2">
          <div className="flex flex-row flex-wrap items-start gap-1">
            <div className="hidden font-sans text-xs underline print:visible">
              {githubLink
                ?.replace('https://', '')
                .replace('www.', '')
                .replace('/', '')}
              {liveLink
                ?.replace('https://', '')
                .replace('www.', '')
                .replace('/', '')}
            </div>
            {liveLink && (
              <a
                href={ensureHttps(liveLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                  <GlobeIcon className="size-3" /> Website
                </Badge>
              </a>
            )}
            {githubLink && (
              <a
                href={ensureHttps(githubLink)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="flex gap-2 px-2 py-1 text-[10px]">
                  <GitHubLogoIcon className="size-3" /> Source
                </Badge>
              </a>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
