import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import siteConfig from '../../site.config.json';

const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const GET: APIRoute = async () => {
  const baseUrl = siteConfig.brand.siteUrl.replace(/\/+$/, '');
  const products = await getCollection('products');
  const paths = [
    '/',
    '/shop/',
    ...products.map((product) => `/shop/${product.id}/`),
    '/custom-orders/',
    '/about/',
    '/contact/',
    '/privacy/',
  ];
  const entries = paths.map((path) => `  <url><loc>${escapeXml(`${baseUrl}${path}`)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
