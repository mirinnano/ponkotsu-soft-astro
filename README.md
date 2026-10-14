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
- イベント参加（お品書き）: お知らせに `category: event` で追加 → `/news/<ファイル名>` に詳細ページ、開催前ならトップに「次の頒布」（書き方は `src/content/news/README.md.txt`）
- 開発日誌: `src/content/diary/` に .md を追加 → ナビに Diary が出る
- 作品のキービジュアル・PV・販売リンク・発売予定: `src/data/works.ts` の `keyVisual` `trailer` `stores` `release`（空のあいだは表示しない）
- プレスキット: `/presskit`（作品データとロゴから自動で作る）。RSS: `/rss.xml`
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

`npm run work-logo`（= `node scripts/generate-work-logo.mjs`）で `public/images/works/hesphoros-logo-{black,white}.svg` を書き出す。
飾りは付けず、小文字の hesphoros を IBM Plex Sans で置くだけ。

## 本番（Cloudflare）

構成：ページは静的に書き出し、`/api/*`（ベータ認証・ダウンロード・お問い合わせ）だけを Worker で動かす。
製品版のファイルは R2 に置き、アクセスコードが合った人にだけ 10 分間有効な署名付き URL を渡す。

### 製品版の配布の流れ

1. aria-engine-rust の `main` に push すると、CI（`umikaze-release.yml`）が Windows・macOS・Linux 版を作り、
   R2 の `hesphoros/builds/<版>/<OS>/` にインストーラーを置く。最後に `hesphoros/latest.json`（版・OS ごとのファイル名・大きさ・SHA-256）を書き換える。
   古い main のビルドは新しい 5 つを残して消す。タグ（`umikaze-v*`）のビルドは消さない。
2. 作品ページでアクセスコードを入れると、`/api/beta` が `latest.json` を読み、OS ごとのダウンロードリンクを返す。
3. リンクは `/api/download` を通って R2 から直接流れる。期限が切れたら、もう一度コードを入れる。

体験版（DAY 0–4）のインストーラーも同じバケットの `hesphoros-demo/` に置き、作品ページからコードなしで配る（`/api/demo`）。
リポジトリが公開なので、どちらも GitHub の Release や Actions の成果物には置かない。ブラウザ版の体験版は GitHub Pages。

### 課金を防ぐための設定

R2 は転送量が無料で、保存 10 GB・書き込み 100 万回・読み出し 1,000 万回までが毎月の無料枠。それを超えないように：

- バケット `ponkotsu-downloads`（APAC・Standard）は公開 URL なし。読めるのは署名を確かめた `/api/download` だけ。
  読み出しのたびに料金がかかる Infrequent Access は使わない
- IP ごとの回数制限（`wrangler.jsonc` の `ratelimits`、追加料金なし）：アクセスコードの試行は 1 分に 5 回、
  体験版のリンク発行は 1 分に 3 回、ファイルの取得は 1 分に 20 回まで。コードが合うまで R2 は読まない
- 保存量：CI が main のビルドを新しい 5 つだけ残す。バケットのライフサイクルルールで、main のビルドは 180 日、
  途中で止まったアップロードは 1 日で消える
- 念のため、Cloudflare ダッシュボードの「Billing → Billable Usage」で通知を設定しておく

aria-engine-rust 側に登録するもの（Settings → Secrets and variables → Actions）：

| 種類 | 名前 | 中身 |
| --- | --- | --- |
| Secret | `R2_ACCOUNT_ID` | Cloudflare のアカウント ID |
| Secret | `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 の API トークン（対象バケットへの読み書き権限）で発行した S3 互換キー |
| Variable（任意） | `R2_BUCKET` | バケット名。未設定なら `ponkotsu-downloads` |

Secrets が未登録のあいだも、ビルドとテストは動く（配布だけ行わない）。

初回だけ行う作業：

```bash
npx wrangler login
# ダッシュボードで R2 を有効化してから
npx wrangler r2 bucket create ponkotsu-downloads
# wrangler.jsonc の r2_buckets のコメントを外す
npx wrangler r2 object put ponkotsu-downloads/hesphoros/<ファイル名> --file <ローカルのファイル> --remote
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

フォーム（ベータ認証・お問い合わせ）は、Secrets を登録したうえで `PUBLIC_FORMS_ENABLED=1` を付けてビルドしたときだけ表示する（例：`PUBLIC_FORMS_ENABLED=1 npm run build && npx wrangler deploy`）。それまでは X の DM への案内を出す。

`.dev.vars.example` を参照。未設定の間、ベータ認証とフォームは「停止中／準備中」を返す。
