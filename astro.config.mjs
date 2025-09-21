// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bosquewinebar.netlify.app',
  // Remove base for Netlify - only needed for GitHub Pages subdirectories
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [
    sitemap()
  ]
});
