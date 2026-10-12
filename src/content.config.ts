import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// お知らせとプレスリリース。category: press のものは /press に詳細ページが作られる
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['news', 'press']).default('news'),
    // 一覧から飛ばしたい先（サイト内パスは / から書く）
    link: z.string().optional(),
    // プレスリリース一覧に出す要約
    summary: z.string().optional(),
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

export const collections = { news, gallery };
