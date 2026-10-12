export type Character = { name: string; role: string; description: string };
export type Work = {
  slug: string;
  title: string;
  titleEn: string;
  status: string;
  genre: string;
  catchcopy: string;
  synopsis: string[];
  progress: { label: string; value: number }[];
  characters: Character[];
  betaOpen: boolean;
};

export const works: Work[] = [
  {
    slug: 'umikaze',
    title: '海風',
    titleEn: 'Umikaze',
    status: '制作中',
    genre: 'Kinetic Novel',
    catchcopy: '死生観を問う、優しくて冷たいキネティックノベル',
    synopsis: [
      '2001年、秋。',
      '未来に希望を持てない停滞した日常を持て余していた主人公は、余命宣告を受けたクラスメイトの少女・ミオと共に宛てのない逃避行に出る。',
      '延命治療を拒み、薬を捨てて「普通の女の子」としての最期を駆け抜けようとするミオ。彼女の嘘と強がりを知りながらも、主人公は共犯者として寄り添い続ける。',
      '冷たい雨が降る安ホテル、深夜のコンビニ飯、そして少しずつ削られていく命の時間。',
      'これは、行き止まりの世界で「本当のさいわい」を探す、優しくて痛々しい14日間の記録。',
    ],
    progress: [{ label: 'シナリオ・スクリプト', value: 25 }],
    characters: [
      {
        name: '主人公',
        role: 'Protagonist',
        description:
          '息苦しい日常から逃げ出した家出少年。何者かになりたいわけでもなく、ただあてのない逃避行の中で無駄な時間を消費している。',
      },
      {
        name: 'ミオ',
        role: 'Heroine',
        description:
          '主人公と共に逃避行を続ける少女。すでに生への未練を捨てており、残された時間をただ使い潰している。',
      },
    ],
    betaOpen: true,
  },
];

export const totalProgress = (w: Work) =>
  Math.round(w.progress.reduce((s, p) => s + p.value, 0) / w.progress.length);
