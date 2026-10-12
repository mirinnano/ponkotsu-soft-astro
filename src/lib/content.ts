import { getCollection } from 'astro:content';
import { nav } from '../data/site';
import { u } from './url';

export const formatDate = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export async function getNews(category?: 'news' | 'press') {
  const all = await getCollection('news', (e) => !category || e.data.category === category);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// 空のコレクションを読むと警告が出るため、ファイルがない間は読まない
const hasGallery = Object.keys(import.meta.glob('../content/gallery/*.md')).length > 0;

export async function getGallery() {
  if (!hasGallery) return [];
  const all = await getCollection('gallery');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// 一覧から飛ぶ先。プレスリリースは詳細ページ、link 指定があればそちら
export const newsHref = (e: Awaited<ReturnType<typeof getNews>>[number]) =>
  e.data.category === 'press' ? u(`/press/${e.id}`) : e.data.link ? u(e.data.link) : undefined;

// ギャラリーとプレスは中身があるときだけナビに出す
export async function getNav() {
  const [press, gallery] = await Promise.all([getNews('press'), getGallery()]);
  const extra = [
    ...(gallery.length ? [{ href: u('/gallery'), label: 'Gallery' }] : []),
    ...(press.length ? [{ href: u('/press'), label: 'Press' }] : []),
  ];
  const i = nav.findIndex((n) => n.label === 'Members');
  return [...nav.slice(0, i), ...extra, ...nav.slice(i)];
}
