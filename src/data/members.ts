import type { ImageMetadata } from 'astro';
import setsumiAvatar from '../assets/member-setsumi.jpg';

export type Member = {
  name: string;
  roles: string[];
  bio: string;
  avatar?: ImageMetadata;
  // リンクは出したい人だけ
  x?: string;
  github?: string;
};

export const members: Member[] = [
  {
    // 名前・アイコン・プロフィールは X（@102502）から
    name: 'せつみせんせい',
    roles: ['Scenario', 'Direction', 'Web Development'],
    bio: '片岡とも 麻枝准 折戸伸治 都乃河勇人 田中ロミオ 魁 海富一 木緒なち 王雀孫 藤間仁 蒼樹うめ\nサナララ リトルバスターズ！ Narcissu Summer Pockets 素晴らしき日々 家族計画',
    avatar: setsumiAvatar,
    x: '102502',
    github: 'mirinnano',
  },
  {
    name: 'あくめ',
    roles: ['Illustration'],
    bio: 'イラストを担当しています。',
  },
];
