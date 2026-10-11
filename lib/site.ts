// Where the app lives. Set NEXT_PUBLIC_SITE_URL to move to another domain;
// every absolute link, the sitemap and the share images follow it.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://bentoprofile.vercel.app'
).replace(/\/+$/, '');

export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');
