export type Character = { name: string; role: string; line?: string; description: string };
import type { ImageMetadata } from 'astro';
import hesphorosPageDay1 from '../assets/works/hesphoros/screen-page-day1.jpg';
import dayPrologue from '../assets/works/hesphoros/days/hospital-corridor-overcast-v1.webp';
import day1 from '../assets/works/hesphoros/days/platform-sign-dawn.webp';
import day2 from '../assets/works/hesphoros/days/rain-window-dusk-v1.webp';
import day3 from '../assets/works/hesphoros/days/rail-window-sunset-v1.webp';
import day4 from '../assets/works/hesphoros/days/shore-storm-sunset-v1.webp';

export type Spec = { term: string; desc: string };
// ゲーム画面。体験版（DAY 0–4）の範囲から選び、先の展開は載せない
export type Screenshot = { src: ImageMetadata; alt: string; caption?: string };
// 販売・配布ページ（BOOTH、DLsite、Steam のウィッシュリストなど）
export type StoreLink = { label: string; href: string };
// 旅程の一日。ゲームの日付カード（台本の chapter 宣言）と同じ文を使う
export type Day = { label: string; title: string; date: string; synopsis: string; image: ImageMetadata; imageAlt: string };
// ゲームを読み進める様子を録った、音のない縦長の映像（public/ に置く）
export type Clip = { mp4: string; webm: string; poster: string; alt: string };
export type Work = {
  slug: string;
  title: string;
  titleEn: string;
  reading: string;
  status: string;
  genre: string;
  catchcopy: string;
  synopsis: string[];
  summary?: string; // 何の作品かを言う一文（最初の画面）
  clip?: Clip;
  days?: Day[]; // 体験版の範囲だけ。先の日は daysRest で一行にまとめる
  daysRest?: string;
  // 原稿の一行がゲームの頁になる見本。原稿のまま（字下げなし、空行は段落の区切り）
  manuscriptSample?: string;
  manuscriptPhoto?: ImageMetadata;
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
  demoOpen?: boolean; // 体験版をコードなしで配る（/api/demo）
  playUrl?: string; // ブラウザで読める体験版（public/ に置いた Web 版）
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
    summary: '2001年の秋、十五歳の二人が横浜から山陰の海へ向かう十四日間を描く、キネティックノベル（選択肢のないノベルゲーム）。',
    clip: {
      mp4: '/video/works/hesphoros-reading.mp4',
      webm: '/video/works/hesphoros-reading.webm',
      poster: '/video/works/hesphoros-reading-poster.jpg',
      alt: 'スマートフォンを縦にして DAY 1 を読み進める画面。駅の案内板の写真の上に、一行ずつ文章が足されていく',
    },
    days: [
      { label: 'PROLOGUE', title: '病室の窓', date: '春から秋', synopsis: '病室の窓から季節を見送る日々に、一時帰宅の話が出る。', image: dayPrologue, imageAlt: '曇りの日の病院の廊下' },
      { label: 'DAY 1', title: '西へ', date: '9月21日・横浜駅', synopsis: '西へ向かう最初の列車が、朝のホームを離れる。', image: day1, imageAlt: '朝のホームに下がる行き先の案内板' },
      { label: 'DAY 2', title: '雨上がり', date: '9月22日・三ノ宮', synopsis: '雨上がりの三ノ宮の街へ出る。', image: day2, imageAlt: '雨粒のついた窓の向こうの海沿いの道' },
      { label: 'DAY 3', title: '宍道湖まで', date: '9月23日・岡山', synopsis: '岡山を発ち、夕暮れの宍道湖へ歩いていく。', image: day3, imageAlt: '夕方の車窓から見える街' },
      { label: 'DAY 4', title: '波の音', date: '9月24日・松江', synopsis: 'ミオがMDを持って、日本海の波の音を録りに行く。', image: day4, imageAlt: '嵐の雲の下の夕暮れの海' },
    ],
    daysRest: 'DAY 5 から DAY 14 までは、製品版で読めます。',
    manuscriptSample: 'ホームの端に、灰皿があった。\nミオは灰皿から少し離れ、時刻表をまじまじと見ていた。\n\n「寒い……」\n\n「お前、そんな薄手で家を出てきてさ」',
    manuscriptPhoto: day1,
    screenshots: [
      { src: hesphorosPageDay1, alt: '駅の案内板の写真の上に、DAY 1 の冒頭の五行が本の頁のように置かれている。最後の行の後ろに小さな菱形の印', caption: 'DAY 1' },
    ],
    specs: [
      { term: '形式', desc: 'キネティックノベル（選択肢なし）' },
      { term: '舞台', desc: '2001年の秋。横浜から、鈍行で山陰の海まで' },
      { term: '期間', desc: '十四日間' },
      { term: '画面', desc: '写真の上に、文章を本の頁のように置く。スマートフォンでは、縦向きでも横向きでも読める' },
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
    demoOpen: true,
    playUrl: '/play/hesphoros/',
  },
];

export const totalProgress = (w: Work) =>
  Math.round(w.progress.reduce((s, p) => s + p.value, 0) / w.progress.length);
