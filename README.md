# ぽんこつソフト Web

Astro 製の公式サイト。Vercel にデプロイする想定（`@astrojs/vercel`）。

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

## 環境変数（Vercel の Project Settings で設定）

`.env.example` を参照。未設定の間、フォームは「準備中」を返す。

- `BETA_ACCESS_CODES` — クローズドベータのアクセスコード（カンマ区切り）
- `BETA_DOWNLOAD_URL` — 認証成功時に返すダウンロード URL
- `CONTACT_WEBHOOK_URL` — お問い合わせの転送先（Discord / Slack の Incoming Webhook）
