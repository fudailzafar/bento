import { MetadataRoute } from 'next';
import { prisma } from '@/lib/server/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://portfoliofy.me';

  // Get all public portfolios using optimized SCAN
  const portfolios = await getAllPublicPortfolios();

  // Static pages (high priority)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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

  return [...staticPages, ...legalPages, ...portfolioPages];
}

async function getAllPublicPortfolios(): Promise<
  Array<{ username: string; lastModified: Date }>
> {
  try {
    const users = await prisma.user.findMany({
      where: { username: { not: null } },
      select: { username: true, page: { select: { updatedAt: true } } },
    });

    return users
      .filter((u): u is typeof u & { username: string } => !!u.username)
      .map((u) => ({
        username: u.username,
        lastModified: u.page?.updatedAt ?? new Date(),
      }));
  } catch (error) {
    console.error('Error fetching portfolios from database:', error);
    return [];
  }
}

// Revalidate sitemap every hour
export const revalidate = 3600;
