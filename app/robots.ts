import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/preview/', '/upload/', '/api/'],
      },
    ],
    sitemap: 'https://portfoliofy.me/sitemap.xml',
  };
}
