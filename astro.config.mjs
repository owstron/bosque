// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://owstron.github.io',
  base: '/bosque-restaurant',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [
    sitemap()
  ]
});
