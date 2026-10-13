import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// お知らせ。category で種類を分ける
//   news  … ふつうのお知らせ
//   press … プレスリリース（/press/<ファイル名> に詳細ページ）
//   event … 即売会などの参加告知（/news/<ファイル名> に詳細ページ。お品書き画像を載せられる）
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.enum(['news', 'press', 'event']).default('news'),
      // 一覧から飛ばしたい先（サイト内パスは / から書く）
      link: z.string().optional(),
      // プレスリリース・イベントの一覧に出す要約
      summary: z.string().optional(),
      // イベントの情報
      event: z
        .object({
          name: z.string(), // 例：コミックマーケット107
          date: z.coerce.date(), // 参加日
          day: z.string().optional(), // 例：2日目
          space: z.string().optional(), // 例：東ヨ-12a
          venue: z.string().optional(), // 例：東京ビッグサイト
        })
        .optional(),
      // お品書きなどの画像（同じフォルダに置き、相対パスで指定）
      image: image().optional(),
    }),
});

// ギャラリー。画像は同じフォルダに置き、image に相対パスで指定する
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      date: z.coerce.date(),
      credit: z.string().optional(),
      work: z.string().optional(),
    }),
});

// 開発日誌。告知ではなく、制作の様子を書く短い記事
const diary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diary' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      author: z.string().optional(),
      image: image().optional(),
    }),
});

export const collections = { news, gallery, diary };
