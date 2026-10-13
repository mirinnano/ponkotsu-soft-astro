// 作品ロゴ生成：node scripts/generate-work-logo.mjs
// 海風 — 題字に一本の水平線（海の線）を添える。縦組みでは「海」と「風」のあいだ、横組みでは題字と UMIKAZE のあいだを通る。
// 文字はすべてパス化して書き出す。色は白と黒のみ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/images/works');
const fs_ = (pkg, file) => path.join(root, 'node_modules/@fontsource', pkg, 'files', file);
const load = (f) => {
  const b = fs.readFileSync(f);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const mincho = load(fs_('shippori-mincho-b1', 'shippori-mincho-b1-japanese-600-normal.woff'));
const latin = load(fs_('cormorant-garamond', 'cormorant-garamond-latin-500-normal.woff'));
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
const bbox = (cmds) => {
  const xs = [], ys = [];
  for (const c of cmds)
    for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']])
      if (c[kx] !== undefined) {
        xs.push(c[kx]);
        ys.push(c[ky]);
      }
  return { x1: Math.min(...xs), x2: Math.max(...xs), y1: Math.min(...ys), y2: Math.max(...ys) };
};
// 字面の左上を (x, y) に合わせて置く
const place = (font, ch, size, x, y) => {
  const raw = font.getPath(ch, 0, 0, size).commands;
  const b = bbox(raw);
  const moved = raw.map((c) => {
    const m = { ...c };
    for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']])
      if (m[kx] !== undefined) {
        m[kx] += x - b.x1;
        m[ky] += y - b.y1;
      }
    return m;
  });
  return { d: toD(moved), w: b.x2 - b.x1, h: b.y2 - b.y1, box: { x: x, y: y, w: b.x2 - b.x1, h: b.y2 - b.y1 } };
};
const latinLine = (str, size, track, cx, baseline) => {
  const w = [...str].reduce((s, ch) => s + latin.getAdvanceWidth(ch, size), 0) + track * size * (str.length - 1);
  let x = cx - w / 2, d = '';
  for (const ch of str) {
    d += toD(latin.getPath(ch, x, baseline, size).commands);
    x += latin.getAdvanceWidth(ch, size) + track * size;
  }
  return d;
};

const S = 120; // 題字の大きさ
const GAP_OUT = 0.05 * S; // 線を文字から離す幅

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}" width="${Math.round(w)}" height="${Math.round(h)}" role="img" aria-label="海風 UMIKAZE">\n<title>海風</title>\n${body}\n</svg>\n`;

// 線（水平線）。字面の箱（少し広げる）の所だけ抜く。字の中の空きに線が見えないよう、輪郭ではなく箱で抜く
const sea = (id, boxes, x1, x2, y, color) => `<defs><mask id="${id}" maskUnits="userSpaceOnUse">
  <rect x="${n(x1 - 10)}" y="${n(y - 20)}" width="${n(x2 - x1 + 20)}" height="40" fill="#fff"/>
  ${boxes.map((b) => `<rect x="${n(b.x - GAP_OUT * 2)}" y="${n(y - 20)}" width="${n(b.w + GAP_OUT * 4)}" height="40" fill="#000"/>`).join('')}
</mask></defs>
<rect x="${n(x1)}" y="${n(y - 0.75)}" width="${n(x2 - x1)}" height="1.5" fill="${color}" mask="url(#${id})"/>`;

fs.mkdirSync(out, { recursive: true });

// 横組み：海　風 を並べ、水平線をはさんで UMIKAZE
{
  const pad = 8, gap = 0.3 * S;
  const umi = place(mincho, '海', S, pad + 0.35 * S, pad);
  const kaze = place(mincho, '風', S, pad + 0.35 * S + umi.w + gap, pad);
  const right = pad + 0.35 * S + umi.w + gap + kaze.w;
  const h = Math.max(umi.h, kaze.h);
  const W = right + 0.35 * S + pad;
  const lineY = pad + h + 0.2 * S;
  const enBase = lineY + 0.3 * S;
  const en = latinLine('UMIKAZE', 0.15 * S, 0.7, W / 2, enBase);
  const H = enBase + pad;
  for (const [name, c] of Object.entries(COLORS)) {
    fs.writeFileSync(
      path.join(out, `umikaze-logo-${name}.svg`),
      svg(W, H, `${sea(`sea-h-${name}`, [], pad, W - pad, lineY, c)}\n<path fill="${c}" d="${umi.d}${kaze.d}"/>\n<path fill="${c}" d="${en}"/>`),
    );
  }
}

// 縦組み：海 の上、風 の下。線は二字のあいだ（海と風の境目）を横に通る
{
  const pad = 8, gap = 0.34 * S;
  const umi = place(mincho, '海', S, 0, 0);
  const kaze = place(mincho, '風', S, 0, 0);
  const colW = Math.max(umi.w, kaze.w);
  const W = colW + 0.7 * S + pad * 2;
  const cx = W / 2;
  const u = place(mincho, '海', S, cx - umi.w / 2, pad);
  const k = place(mincho, '風', S, cx - kaze.w / 2, pad + umi.h + gap);
  const lineY = pad + umi.h + gap / 2;
  const enBase = pad + umi.h + gap + kaze.h + 0.36 * S;
  const en = latinLine('UMIKAZE', 0.15 * S, 0.7, cx, enBase);
  const H = enBase + pad;
  for (const [name, c] of Object.entries(COLORS)) {
    fs.writeFileSync(
      path.join(out, `umikaze-logo-vertical-${name}.svg`),
      svg(W, H, `${sea(`sea-v-${name}`, [], pad, W - pad, lineY, c)}\n<path fill="${c}" d="${u.d}${k.d}"/>\n<path fill="${c}" d="${en}"/>`),
    );
  }
}
console.log('work logo written to', path.relative(root, out));
