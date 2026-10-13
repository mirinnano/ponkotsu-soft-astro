import { getCollection } from 'astro:content';
import { nav } from '../data/site';
import { u } from './url';

export const formatDate = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

type NewsCategory = 'news' | 'press' | 'event';

export async function getNews(category?: NewsCategory) {
  const all = await getCollection('news', (e) => !category || e.data.category === category);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
export type NewsEntry = Awaited<ReturnType<typeof getNews>>[number];

// まだ終わっていないイベントのうち、いちばん近いもの（ビルドした日を基準にする）
export async function getUpcomingEvent() {
  const today = new Date(new Date().toISOString().slice(0, 10));
  const events = (await getNews('event')).filter((e) => e.data.event && e.data.event.date >= today);
  return events.sort((a, b) => a.data.event!.date.getTime() - b.data.event!.date.getTime())[0];
}

// 空のコレクションを読むと警告が出るため、ファイルがない間は読まない
const hasGallery = Object.keys(import.meta.glob('../content/gallery/*.md')).length > 0;
const hasDiary = Object.keys(import.meta.glob('../content/diary/*.md')).length > 0;

export async function getGallery() {
  if (!hasGallery) return [];
  const all = await getCollection('gallery');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getDiary() {
  if (!hasDiary) return [];
  const all = await getCollection('diary');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// 一覧から飛ぶ先。プレスとイベントは詳細ページ、link 指定があればそちら
export const newsHref = (e: NewsEntry) =>
  e.data.category === 'press'
    ? u(`/press/${e.id}`)
    : e.data.category === 'event'
      ? u(`/news/${e.id}`)
      : e.data.link
        ? u(e.data.link)
        : undefined;

// イベントの「2026.12.30（2日目）東ヨ-12a」のような一行
export const eventLine = (e: NewsEntry) => {
  const ev = e.data.event;
  if (!ev) return '';
  return [ev.name, `${formatDate(ev.date)}${ev.day ? `（${ev.day}）` : ''}`, ev.space].filter(Boolean).join('　');
};

// ギャラリー・日誌・プレスは中身があるときだけナビに出す
export async function getNav() {
  const [press, gallery, diary] = await Promise.all([getNews('press'), getGallery(), getDiary()]);
  const extra = [
    ...(diary.length ? [{ href: u('/diary'), label: 'Diary' }] : []),
    ...(gallery.length ? [{ href: u('/gallery'), label: 'Gallery' }] : []),
    ...(press.length ? [{ href: u('/press'), label: 'Press' }] : []),
  ];
  const i = nav.findIndex((n) => n.label === 'Members');
  return [...nav.slice(0, i), ...extra, ...nav.slice(i)];
}
