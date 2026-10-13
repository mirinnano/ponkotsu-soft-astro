export type Character = { name: string; role: string; line?: string; description: string };
export type Spec = { term: string; desc: string };
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
