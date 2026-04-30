import type { APIRoute } from 'astro';
import { SITE_CONFIG } from '../config/site';

const getRobotsTxt = (sitemapUrl: string) =>
  `
User-agent: *
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

${SITE_CONFIG.useSiteMap ? `Sitemap: ${sitemapUrl}` : ''}
`.trim();

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site || SITE_CONFIG.siteUrl).href;
  return new Response(getRobotsTxt(sitemapUrl), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
