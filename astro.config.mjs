// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// .env is not loaded into process.env for the config file; loadEnv reads it (plus real env vars).
// astro dev/build set NODE_ENV before loading this file; the fallback covers bare tooling.
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  // Leave unset until a real domain exists. A guessed domain here would be worse
  // than none (canonical/OG/JSON-LD should be gated on this being set).
  site: env.PUBLIC_SITE_URL || undefined,
  trailingSlash: 'always',
  // The sitemap needs `site`; without one it only prints a warning.
  integrations: env.PUBLIC_SITE_URL ? [sitemap()] : [],
});
