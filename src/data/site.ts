import { u } from '../lib/url';

export const site = {
  name: 'ぽんこつソフト',
  nameEn: 'Ponkotsu Soft',
  tagline: 'ことばとしあわせのおはなし',
  title: 'ぽんこつソフト | 少しダークで切ないノベルゲームを制作するサークル',
  description:
    'ぽんこつソフトは、日常の閉塞感から抜け出すような、少しダークで切ないノベルゲームを制作するサークルです。新作『海風』制作中。',
  keywords: 'ぽんこつソフト,ノベルゲーム,ビジュアルノベル,インディーゲーム,海風,サスペンス,恋愛アドベンチャー',
  twitter: 'ponkotusoft',
  twitterUrl: 'https://twitter.com/ponkotusoft',
  founded: '2026',
};

export const nav = [
  { href: u('/'), label: 'Home' },
  { href: u('/about'), label: 'About' },
  { href: u('/works'), label: 'Works' },
  { href: u('/news'), label: 'News' },
  { href: u('/members'), label: 'Members' },
  { href: u('/contact'), label: 'Contact' },
];
