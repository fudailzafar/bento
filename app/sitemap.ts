import { MetadataRoute } from 'next';
import { listPublicProfiles, sitemapChunkCount } from '@/lib/server/sitemap';
import { SITE_URL } from '@/lib/site';

// One sitemap per chunk of profiles (/sitemap/0.xml, /sitemap/1.xml, ...),
// so the list never outgrows the 50,000-URL limit or one big query.
export async function generateSitemaps() {
  const chunks = await sitemapChunkCount().catch(() => 1);
  return Array.from({ length: chunks }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: number | Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const chunk = Number(await id);

  // Every claimed username has a public profile.
  const portfolios = await listPublicProfiles(chunk).catch((error) => {
    console.error('Error fetching portfolios from database:', error);
    return [];
  });

  // Static pages (high priority)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/jointheteam`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/home/mugeeb`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Legal pages (nested under main site)
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic user portfolio pages
  const portfolioPages: MetadataRoute.Sitemap = portfolios.map((portfolio) => ({
    url: `${baseUrl}/${portfolio.username}`,
    lastModified: portfolio.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // The site's own pages go in the first sitemap only.
  return chunk === 0
    ? [...staticPages, ...legalPages, ...portfolioPages]
    : portfolioPages;
}

// Revalidate sitemap every hour
export const revalidate = 3600;
