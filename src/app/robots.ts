import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://votre-portfolio.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/fanatics', '/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
