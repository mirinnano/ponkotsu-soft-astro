# ぽんこつソフト Web

Astro 製の公式サイト。本番は Cloudflare Workers（`@astrojs/cloudflare`）、配布ファイルは Cloudflare R2。

- 本番: https://ponkotsu-soft.ponkotu.workers.dev
- プレビュー（GitHub Pages・フォームなし）: https://mirinnano.github.io/ponkotsu-soft-astro/

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

`main` に push すると GitHub Actions で https://mirinnano.github.io/ponkotsu-soft-astro/ にプレビューが公開される（静的配信のためフォームは動かない）。

## 内容の更新

- お知らせ: `src/content/news/*.md` を1件1ファイルで追加（`date` の新しい順に表示）
- プレスリリース: 同じフォルダに `category: press` と `summary` を付けて追加 → `/press/<ファイル名>` に詳細ページができ、ナビに Press が出る
- ギャラリー: `src/content/gallery/` に画像と .md を追加 → ナビに Gallery が出る（手順は同フォルダの `README.md.txt`）
- 作品: `src/data/works.ts`（ページは `/works/<slug>` に自動生成）
- メンバー: `src/data/members.ts`
- サイト共通の文言・リンク: `src/data/site.ts`
- トップ画像: `src/assets/hero.png`（ビルド時に AVIF / WebP / JPEG へ最適化）

## ロゴ

PONKOTSU software。白と黒のみ。「ぽんこつ（ちょっと壊れている）」を、T が少し傾くことだけで表した文字ロゴ。
`npm run logo`（= `node scripts/generate-logo.mjs`）で `public/images/logo/` と `public/favicon.svg` を書き出す。文字はすべてパス化済み。

| ファイル | 用途 |
| --- | --- |
| `logo-badge-line-{black,white}.svg` | 写真・イラストの上（トップ）。箱は塗らず枠線だけ |
| `logo-badge-{black,white}.svg` | 箱入り。幅 200px 以上で使う（フッターなど） |
| `logo-badge-small-{black,white}.svg` | 箱入りの内枠なし版。幅 200px 未満用 |
| `logo-{black,white}.svg` | 箱なし。PONKOTSU + software |
| `logo-compact-{black,white}.svg` | PONKOTSU のみ。ヘッダーなど小さい場所 |

## 作品ロゴ

`npm run work-logo`（= `node scripts/generate-work-logo.mjs`）で `public/images/works/umikaze-logo[-vertical]-{black,white}.svg` を書き出す。
題字は Shippori Mincho B1、欧文は Cormorant Garamond。水平線を一本添える（縦組みは「海」と「風」のあいだ、横組みは題字と UMIKAZE のあいだ）。

## 本番（Cloudflare）

構成：ページは静的に書き出し、`/api/*`（ベータ認証・ダウンロード・お問い合わせ）だけを Worker で動かす。
ベータ版のファイルは R2 に置き、アクセスコードが合った人にだけ 10 分間有効な署名付き URL を渡す。

初回だけ行う作業：

```bash
npx wrangler login
# ダッシュボードで R2 を有効化してから
npx wrangler r2 bucket create ponkotsu-downloads
# wrangler.jsonc の r2_buckets のコメントを外す
npx wrangler r2 object put ponkotsu-downloads/umikaze/<ファイル名> --file <ローカルのファイル> --remote
npx wrangler secret put BETA_ACCESS_CODES
npx wrangler secret put DOWNLOAD_SIGNING_SECRET
npx wrangler secret put BETA_FILE_KEY
npx wrangler secret put CONTACT_WEBHOOK_URL
npx wrangler secret put TURNSTILE_SECRET_KEY
npm run build && npx wrangler deploy
```

以後は GitHub Actions で自動デプロイできる：Secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID`、Variables に `CLOUDFLARE_DEPLOY=true`（必要なら `SITE_URL` と `PUBLIC_TURNSTILE_SITE_KEY`）を登録する。

ローカルで API まで試すときは `.dev.vars.example` を `.dev.vars` にコピーして値を入れ、`npm run build && npx astro preview`。

## 環境変数

`.dev.vars.example` を参照。未設定の間、ベータ認証とフォームは「停止中／準備中」を返す。
