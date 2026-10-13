import { u } from '../lib/url';

export const site = {
  name: 'ぽんこつソフト',
  nameEn: 'Ponkotsu Soft',
  tagline: 'ことばとしあわせのおはなし',
  title: 'ぽんこつソフト | 少しダークで切ないノベルゲームを制作するサークル',
  description:
    'ぽんこつソフトは、少しダークで切ないノベルゲームをつくる同人サークルです。新作『海風』を制作中。',
  keywords: 'ぽんこつソフト,ノベルゲーム,ビジュアルノベル,キネティックノベル,同人ゲーム,海風',
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
