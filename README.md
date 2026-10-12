# ぽんこつソフト Web

Astro 製の公式サイト。Vercel にデプロイする想定（`@astrojs/vercel`）。

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

## 内容の更新

- お知らせ: `src/data/news.ts`
- 作品: `src/data/works.ts`（ページは `/works/<slug>` に自動生成）
- メンバー: `src/data/members.ts`
- サイト共通の文言・リンク: `src/data/site.ts`
- トップ画像: `src/assets/hero.png`（ビルド時に AVIF / WebP / JPEG へ最適化）

## ロゴ

`public/images/logo/` の SVG はすべて文字をパス化済み（フォント非依存）。

| ファイル | 用途 |
| --- | --- |
| `logo-horizontal-{ink,light}.svg` | ヘッダー |
| `logo-stacked-{ink,light}.svg` | フッター・About |
| `wordmark-{ink,light}.svg` | トップのサークル名 |
| `mark-{ink,light}.svg` / `public/favicon.svg` | シンボル・ファビコン |

## 環境変数（Vercel の Project Settings で設定）

`.env.example` を参照。未設定の間、フォームは「準備中」を返す。

- `BETA_ACCESS_CODES` — クローズドベータのアクセスコード（カンマ区切り）
- `BETA_DOWNLOAD_URL` — 認証成功時に返すダウンロード URL
- `CONTACT_WEBHOOK_URL` — お問い合わせの転送先（Discord / Slack の Incoming Webhook）
