import type { APIRoute } from 'astro';
import siteConfig from '../../site.config.json';

export const GET: APIRoute = () => {
  const sitemapUrl = `${siteConfig.brand.siteUrl.replace(/\/+$/, '')}/sitemap.xml`;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
