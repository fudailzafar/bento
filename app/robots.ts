import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { sitemapChunkCount } from '@/lib/server/sitemap';

// Lists one sitemap per chunk of profiles; refreshed hourly.
export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const chunks = await sitemapChunkCount().catch(() => 1);
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/preview/', '/upload/', '/api/', '/self/'],
      },
    ],
    sitemap: Array.from(
      { length: chunks },
      (_, id) => `${SITE_URL}/sitemap/${id}.xml`
    ),
  };
}
