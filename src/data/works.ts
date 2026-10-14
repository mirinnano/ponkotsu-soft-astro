export type Character = { name: string; role: string; line?: string; description: string };
import type { ImageMetadata } from 'astro';
import hesphorosTitle from '../assets/works/hesphoros/screen-title.png';
import hesphorosDayCard from '../assets/works/hesphoros/screen-day1-card.png';
import hesphorosPlatform from '../assets/works/hesphoros/screen-day1-platform.png';
import hesphorosTrain from '../assets/works/hesphoros/screen-day1-train.png';

export type Spec = { term: string; desc: string };
// ゲーム画面。体験版（DAY 0–4）の範囲から選び、先の展開は載せない
export type Screenshot = { src: ImageMetadata; alt: string; caption?: string };
// 販売・配布ページ（BOOTH、DLsite、Steam のウィッシュリストなど）
export type StoreLink = { label: string; href: string };
export type Work = {
  slug: string;
  title: string;
  titleEn: string;
  reading: string;
  status: string;
  genre: string;
  catchcopy: string;
  synopsis: string[];
  progress: { label: string; value: number }[];
  characters: Character[];
  specs: Spec[];
  // 以下は用意できたら書く。空のあいだはページに出ない
  keyVisual?: ImageMetadata; // キービジュアル（src/assets に置いて import）
  keyVisualAlt?: string;
  trailer?: string; // PV の YouTube 動画 ID
  screenshots?: Screenshot[];
  stores?: StoreLink[];
  release?: string; // 発売・頒布の予定（例：2027年 夏）
  setting: string;
  betaOpen: boolean;
};

export const works: Work[] = [
  {
    slug: 'hesphoros',
    title: 'HesPhoros',
    titleEn: 'HesPhoros',
    // 宵の明星（Hesperos）と明けの明星（Phosphoros）を一語にした造語
    reading: 'ヘスフォロス',
    status: '制作中',
    genre: 'Kinetic Novel',
    catchcopy: '十万円と鈍行列車で、日本海まで。',
    setting: '2001年 秋 ／ 横浜 → 山陰',
    // あらすじは導入だけ（シナリオ Day 1 冒頭）。感情は説明せず、物と動作で書く
    synopsis: [
      '九月二十一日、朝六時の横浜駅。',
      'ホームの端で煙草に火をつけて、数口で消した。ポケットには、通信制に入り直すためにと親が用意した十万円が入っている。退学届は、昨日出した。',
      'ミオは少し離れて、時刻表を見ていた。薄手のスカートで、寒い、と言った。薬は、もう飲まないらしい。',
      'ドアの前で、一度だけ足が止まる。今なら、まだ戻れる。',
      '発車ベルが鳴った。',
    ],
    progress: [{ label: 'シナリオ・スクリプト', value: 25 }],
    screenshots: [
      { src: hesphorosTitle, alt: 'タイトル画面。夜の街の写真に、引用の断片が散らばっている', caption: 'タイトル' },
      { src: hesphorosDayCard, alt: '海沿いのホームの写真に「DAY 1　西へ　9月21日・横浜駅」と出ている', caption: '日付カード' },
      { src: hesphorosPlatform, alt: '海沿いのホーム。字幕に「発車ベルが鳴る。」', caption: 'DAY 1' },
      { src: hesphorosTrain, alt: '電車の窓から見える夕方の街。字幕に「それ以上は聞けなかった。」', caption: 'DAY 1' },
    ],
    specs: [
      { term: '形式', desc: 'キネティックノベル（選択肢なし）' },
      { term: '舞台', desc: '2001年の秋。横浜から、鈍行で山陰の海まで' },
      { term: '期間', desc: '十四日間' },
      { term: '画面', desc: '背景と文章で進み、立ち絵は大事な場面だけ' },
      { term: 'エンジン', desc: '自作のノベルゲームエンジン AriaEngine' },
    ],
    characters: [
      {
        name: '俺',
        role: 'Protagonist',
        line: 'お前、そんな薄手で家を出てきて何したいんだ',
        description: '十五歳。工業高校を辞めたばかり。',
      },
      {
        name: 'ミオ',
        role: 'Heroine',
        line: '……別に、これがおしゃれだから',
        description: '十五歳。入院と退院を繰り返してきた。',
      },
    ],
    betaOpen: true,
  },
];

export const totalProgress = (w: Work) =>
  Math.round(w.progress.reduce((s, p) => s + p.value, 0) / w.progress.length);
