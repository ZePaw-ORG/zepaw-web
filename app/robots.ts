import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://zepaw.in/sitemap.xml',
    host: 'https://zepaw.in',
  };
}
