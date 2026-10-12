// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// DEPLOY_TARGET=pages のときは GitHub Pages 向けの静的ビルド（API ルートなし）
const isPages = process.env.DEPLOY_TARGET === 'pages';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://ponkotsu-soft.vercel.app',
  base: process.env.BASE_PATH ?? '/',
  adapter: isPages ? undefined : vercel(),
  integrations: [sitemap()],
  env: {
    schema: {
      BETA_ACCESS_CODES: envField.string({ context: 'server', access: 'secret', optional: true }),
      BETA_DOWNLOAD_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
