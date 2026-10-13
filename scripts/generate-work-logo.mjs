// 作品ロゴ生成：node scripts/generate-work-logo.mjs
// Hesphoros — 宵の明星（Hesperos）と明けの明星（Phosphoros）を一語にした題。
// 飾りは付けず、小文字の語だけを IBM Plex Sans で置く。文字はパス化して書き出す。色は白と黒のみ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/images/works');
const b = fs.readFileSync(path.join(root, 'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff'));
const font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
const COLORS = { black: '#000000', white: '#ffffff' };

// opentype.js の toPathData は一部の座標で NaN を出すため自前で直列化する
const n = (v) => String(Math.round(v * 100) / 100);
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

const WORD = 'hesphoros';
const SIZE = 100;
const TRACK = 0.02 * SIZE;
const ascent = (font.tables.os2.sTypoAscender / font.unitsPerEm) * SIZE;
const descent = (-font.tables.os2.sTypoDescender / font.unitsPerEm) * SIZE;
// 上下は h の上端と p の下端まで
const base = ascent * 0.98;
let x = 0, d = '';
for (const ch of WORD) {
  d += toD(font.getPath(ch, x, base, SIZE).commands);
  x += font.getAdvanceWidth(ch, SIZE) + TRACK;
}
const W = x - TRACK;
const H = base + descent * 0.95;

fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (f.endsWith('.svg')) fs.rmSync(path.join(out, f));
for (const [name, c] of Object.entries(COLORS)) {
  fs.writeFileSync(
    path.join(out, `hesphoros-logo-${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(W)} ${n(H)}" width="${Math.round(W)}" height="${Math.round(H)}" role="img" aria-label="Hesphoros">
<title>Hesphoros</title>
<path fill="${c}" d="${d}"/>
</svg>
`,
  );
}
console.log('work logo written to', path.relative(root, out), Math.round(W), Math.round(H));
