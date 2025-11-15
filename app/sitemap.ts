import { MetadataRoute } from 'next';
import { upstashRedis } from '@/lib/server';

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

// Optimized helper using SCAN instead of KEYS
async function getAllPublicPortfolios(): Promise<
  Array<{ username: string; lastModified: Date }>
> {
  const portfolios: Array<{ username: string; lastModified: Date }> = [];
  let cursor = '0';

  try {
    do {
      // Use SCAN instead of KEYS for better performance
      const result = await upstashRedis.scan(cursor, {
        match: 'user:name:*',
        count: 100,
      });

      cursor = result[0];
      const keys = result[1];

      // Process keys in parallel
      const results = await Promise.all(
        keys.map(async (key) => {
          try {
            const username = key.replace('user:name:', '');

            // Get userId from the username lookup
            const userId = await upstashRedis.get<string>(key);
            if (!userId) return null;

            // Get resume data to get updatedAt timestamp
            const resume = await upstashRedis.get<any>(`resume:${userId}`);
            if (!resume) return null;

            return {
              username,
              lastModified: resume.updatedAt
                ? new Date(resume.updatedAt)
                : new Date(),
            };
          } catch (error) {
            console.error(`Error processing key ${key}:`, error);
            return null;
          }
        })
      );

      // Filter out null results and add to portfolios
      portfolios.push(
        ...results.filter((r): r is NonNullable<typeof r> => r !== null)
      );
    } while (cursor !== '0');

    return portfolios;
  } catch (error) {
    console.error('Error fetching portfolios from Redis:', error);
    return [];
  }
}

// Revalidate sitemap every hour
export const revalidate = 3600;
