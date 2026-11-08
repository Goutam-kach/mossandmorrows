import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const siteConfig = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: siteConfig.brand.siteUrl,
  output: 'static',
});
