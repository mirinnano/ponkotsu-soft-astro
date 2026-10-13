import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getNews, getDiary, newsHref } from '../lib/content';
import { site } from '../data/site';
import { u } from '../lib/url';

// お知らせと開発日誌の RSS
export async function GET(context: APIContext) {
  const [news, diary] = await Promise.all([getNews(), getDiary()]);
  const items = [
    ...news.map((e) => ({
      title: e.data.title,
      pubDate: e.data.date,
      description: e.data.summary ?? e.body?.slice(0, 200) ?? '',
      link: newsHref(e) ?? u('/news'),
    })),
    ...diary.map((e) => ({
      title: `［日誌］${e.data.title}`,
      pubDate: e.data.date,
      description: e.body?.slice(0, 200) ?? '',
      link: u(`/diary/${e.id}`),
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({ title: site.name, description: site.description, site: context.site!, items, trailingSlash: false });
}
