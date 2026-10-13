export type Character = { name: string; role: string; description: string };
export type Feature = { title: string; body: string };
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
  features: Feature[];
  setting: string;
  betaOpen: boolean;
};

export const works: Work[] = [
  {
    slug: 'umikaze',
    title: '海風',
    titleEn: 'Umikaze',
    status: '制作中',
    genre: 'Kinetic Novel',
    catchcopy: '十万円と鈍行列車で、海の果てまで。',
    setting: '2001年 秋 ／ 横浜 → 山陰',
    synopsis: [
      '9月21日、朝6時の横浜駅。',
      '工業高校に退学届を出した翌日、「俺」は、通信制に入り直すためにと親が用意した十万円を持って、始発の東海道線に乗った。正しく生きることにも、悪く生きることにも、もう何も感じなくなっていた。',
      '隣には、入院と退院を繰り返してきたクラスメイトのミオ。薬を飲むのをやめた彼女は、どこへ行きたいとも言わずに、西へ向かう切符を買った。',
      '鈍行を乗り継いで、海沿いを西へ。駅弁を三つ目で投げ出し、嵐の日には『銀河鉄道の夜』を読み、くだらない冗談にいちいち「アホか」と返す。',
      '財布の十万円が少しずつ減っていくように、ミオが一度に食べられる量も、少しずつ減っていく。',
      'これは、行き先を決めないまま始まった、十四日間の逃避行の記録。',
    ],
    progress: [{ label: 'シナリオ・スクリプト', value: 25 }],
    features: [
      {
        title: '鈍行で、西へ',
        body: '横浜から山陰の海まで、新幹線は使わない。乗り換えのたびに景色が変わり、泊まる場所はラブホテル、駅の待合室、老婆の民宿と、その日の財布と体力で決まる。',
      },
      {
        title: '減っていくもの',
        body: '十万円の残高と、ミオが一度に食べられる量。大きな出来事ではなく、数字と食卓の変化で、二人に残された時間を描く。',
      },
      {
        title: 'MD と『銀河鉄道の夜』',
        body: 'ポケットのオイルライター、MD、ゲームボーイカラー。2001年の秋を、当時の手ざわりのまま。クリア後には、本編では見えなかった、もうひとつの視点も用意している。',
      },
      {
        title: '風景で読ませる',
        body: '立ち絵は大事な場面だけ。背景と文章で読み進める、選択肢のないキネティックノベル。',
      },
    ],
    characters: [
      {
        name: '俺',
        role: 'Protagonist',
        description:
          '工業高校一年。正しく生きることにも、悪く生きることにも燃え尽きて、退学届を出したばかり。口が悪く、気持ちの話になると、すぐ飯や金や乗り換えの話にすり替える。本名は、最後まで出てこない。',
      },
      {
        name: 'ミオ',
        role: 'Heroine',
        description:
          '入院と退院を繰り返してきた十五歳。よく笑い、よく食べ、よくふざけて、たいていのことは「なんちゃって」で流す。長くは生きられないことを、本人がいちばん平気な顔で話す。主人公のことは「君」と呼ぶ。',
      },
    ],
    betaOpen: true,
  },
];

export const totalProgress = (w: Work) =>
  Math.round(w.progress.reduce((s, p) => s + p.value, 0) / w.progress.length);
