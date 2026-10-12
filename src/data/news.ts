import { u } from '../lib/url';

export type NewsItem = { date: string; title: string; body: string; href?: string };

// 新しいものを上に
export const news: NewsItem[] = [
  {
    date: '2026-04-08',
    title: 'クローズドベータテスト開始',
    body: '「海風」のクローズドベータテストを開始しました。なんかChromeじゃないとダウンロードできないっぽい；；',
    href: u('/works/umikaze#download'),
  },
  {
    date: '2026-04-07',
    title: 'ウェブサイトを公開しました',
    body: 'ぽんこつソフトの公式ウェブサイトをオープンしました。色々めちゃくちゃだけど許して＞＜',
  },
  {
    date: '2026-03-20',
    title: '「海風」制作開始',
    body: '新作ビジュアルノベルの制作を開始しました。',
  },
];

export const formatDate = (iso: string) => iso.replaceAll('-', '.');
