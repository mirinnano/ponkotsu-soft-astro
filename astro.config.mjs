// @ts-check
import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// DEPLOY_TARGET=pages のときは GitHub Pages 向けの静的ビルド（API ルートなし）
const isPages = process.env.DEPLOY_TARGET === 'pages';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://ponkotsu-soft.ponkotu.workers.dev',
  base: process.env.BASE_PATH ?? '/',
  // 画像はビルド時に最適化（実行時の画像変換は使わない）
  adapter: isPages ? undefined : cloudflare({ imageService: 'compile' }),
  integrations: [sitemap()],
  // 旧タイトル「海風」の URL から移す
  redirects: { '/works/umikaze': '/works/hesphoros' },
  env: {
    schema: {
      // クローズドベータ
      BETA_ACCESS_CODES: envField.string({ context: 'server', access: 'secret', optional: true }),
      DOWNLOAD_SIGNING_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      BETA_FILE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // お問い合わせ
      CONTACT_WEBHOOK_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
