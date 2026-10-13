// 作品ロゴ生成：node scripts/generate-work-logo.mjs
// HesPhoros — 宵の明星（Hesperos）と明けの明星（Phosphoros）を一語にした題。飾りは足さず、字形だけで見せる。
//   ・二つの o は、寸分違わず同じ正円にする（宵の明星と明けの明星は同じ星）
//   ・H と P は自作し、H の横棒と P の膨らみの付け根を同じ高さに揃える（宵の H と明けの P を一本の高さでつなぐ）
//   ・ほかの文字は IBM Plex Sans Light。自作の字も同じ線の太さで描く
// 文字はパス化して書き出す。色は白と黒のみ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/images/works');
const b = fs.readFileSync(path.join(root, 'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-300-normal.woff'));
const font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
const COLORS = { black: '#000000', white: '#ffffff' };

const n = (v) => String(Math.round(v * 100) / 100);
// opentype.js の toPathData は一部の座標で NaN を出すため自前で直列化する
const toD = (cmds) =>
  cmds
    .map((c) => {
      switch (c.type) {
        case 'M':
        case 'L':
          return `${c.type}${n(c.x)} ${n(c.y)}`;
        case 'Q':
          return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
        case 'C':
          return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
        default:
          return 'Z';
      }
    })
    .join('');

// 寸法は Plex Sans Light を 100 の大きさで置いたときの実測値（ベースラインが y=0、上が負）
const SIZE = 100;
const CAP = 69.8; // 大文字の高さ
const XH = 51.2; // 小文字の高さ
const OVER = 1.2; // 丸い字のはみ出し
const STEM = 6.0; // 縦線の太さ
const BAR = 5.6; // 横線の太さ
const JOIN = -31; // H の横棒の下端 ＝ P の膨らみの付け根（下端）

// 自作の字：{ d: 塗りのパス, evenodd: 穴あきのパス, lsb, width, rsb }
const rect = (x, y, w, h) => `M${n(x)} ${n(y)}H${n(x + w)}V${n(y + h)}H${n(x)}Z`;

function H() {
  const w = 50; // 外形の幅
  return {
    lsb: 9.9, width: w, rsb: 9.9,
    d: (x) => rect(x, -CAP, STEM, CAP) + rect(x + w - STEM, -CAP, STEM, CAP) + rect(x, JOIN - BAR, w, BAR),
  };
}

function P() {
  const R = (CAP + JOIN) / 2; // 膨らみの外側の半径（上端から付け根まで）
  const flat = 20; // 縦線から曲がり始めるまで
  return {
    lsb: 9.9, width: flat + R, rsb: 4.5,
    d: (x) => rect(x, -CAP, STEM, CAP),
    evenodd: (x) => {
      const bx = x + flat, cy = -CAP + R, r = R - STEM;
      return `M${n(x)} ${n(-CAP)}H${n(bx)}A${n(R)} ${n(R)} 0 0 1 ${n(bx)} ${n(cy + R)}H${n(x)}Z` +
        `M${n(x)} ${n(-CAP + STEM)}H${n(bx)}A${n(r)} ${n(r)} 0 0 1 ${n(bx)} ${n(cy + r)}H${n(x)}Z`;
    },
  };
}

function O() {
  const D = XH + OVER * 2 - 4; // 正円の直径（Plex の o より少し小さく、x ハイトに収める）
  const R = D / 2, cy = -XH / 2;
  return {
    lsb: 5.2, width: D, rsb: 5.2,
    evenodd: (x) => {
      const cx = x + R, r = R - STEM;
      return `M${n(cx - R)} ${n(cy)}A${n(R)} ${n(R)} 0 1 0 ${n(cx + R)} ${n(cy)}A${n(R)} ${n(R)} 0 1 0 ${n(cx - R)} ${n(cy)}Z` +
        `M${n(cx - r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx + r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx - r)} ${n(cy)}Z`;
    },
  };
}

const custom = { H: H(), P: P(), o: O() };
const TRACK = 0.6;

let pen = 0, fill = '', holes = '';
for (const ch of 'HesPhoros') {
  const g = custom[ch];
  if (g) {
    const x = pen + g.lsb;
    if (g.d) fill += g.d(x);
    if (g.evenodd) holes += g.evenodd(x);
    pen += g.lsb + g.width + g.rsb + TRACK;
  } else {
    fill += toD(font.getPath(ch, pen, 0, SIZE).commands);
    pen += font.getAdvanceWidth(ch, SIZE) + TRACK;
  }
}

// 字面だけを切り出す（左右の余白と、h の上端から下端まで）
const left = 9.9 - 1, right = pen - TRACK - 4.1 + 1;
const top = -74 - 1, bottom = OVER + 1;
const vb = `${n(left)} ${n(top)} ${n(right - left)} ${n(bottom - top)}`;
const W = right - left, Hh = bottom - top;

fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (f.endsWith('.svg')) fs.rmSync(path.join(out, f));
for (const [name, c] of Object.entries(COLORS)) {
  fs.writeFileSync(
    path.join(out, `hesphoros-logo-${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${Math.round(W * 4)}" height="${Math.round(Hh * 4)}" role="img" aria-label="HesPhoros">
<title>HesPhoros</title>
<path fill="${c}" d="${fill}"/>
<path fill="${c}" fill-rule="evenodd" d="${holes}"/>
</svg>
`,
  );
}
console.log('work logo written to', path.relative(root, out), Math.round(W * 4), Math.round(Hh * 4));
