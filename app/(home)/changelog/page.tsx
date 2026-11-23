import type { ComponentProps } from 'react';
import type { Metadata } from 'next';
import { ProfileCta } from '@/components/common';
import type { PageData } from '@/lib';
import type { RichData } from '@/lib/rich-data';
import { ChangelogPage } from './changelog-page';
import data from './data.json';

export const metadata: Metadata = {
  title: 'Changelog',
  description: data.page.headline,
};

// bento's own changelog, as it was archived: a profile page (handle
// "changelog") whose widgets are the releases. /changelog is reserved, so no
// account can take it.
export default function Changelog() {
  return (
    <>
      <ChangelogPage
        page={data.page as unknown as PageData}
        picture={data.picture ?? undefined}
        rich={data.rich as unknown as Record<string, RichData>}
        frames={
          data.frames as unknown as ComponentProps<
            typeof ChangelogPage
          >['frames']
        }
      />
      <ProfileCta viewer={null} />
    </>
  );
}
