// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Leave unset until a real domain exists. A guessed domain here would be worse
  // than none — see the same reasoning documented in src/config/site.js and
  // src/layouts/Layout.astro (SEO/OG/JSON-LD is gated on this being set).
  site: process.env.PUBLIC_SITE_URL || undefined,
  trailingSlash: 'always',
  integrations: [sitemap()],
});
