// ロゴ生成：node scripts/generate-logo.mjs
// PONKOTSU software —「ぽんこつ（ちょっと壊れている）」を、T が少し傾くことだけで表した文字ロゴ。
// 文字はすべてパス化して書き出すので、閲覧環境のフォントに左右されない。色は白と黒のみ。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/images/logo');
const fontDir = path.join(root, 'node_modules/@fontsource/jost/files');
const load = (f) => {
  const b = fs.readFileSync(path.join(fontDir, f));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const caps = load('jost-latin-700-normal.woff');
const sub = load('jost-latin-500-normal.woff');

const TILT = -12; // T の傾き（度）。小さく表示しても「わざと」と分かる角度
// 傾いた T は左（O 側）へ倒れるので、前だけ空けて後ろは少し詰める（文字サイズ比）
const T_BEFORE = 0.05, T_AFTER = -0.03;
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
const mapPts = (cmds, f) =>
  cmds.map((c) => {
    const m = { ...c };
    for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) if (m[kx] !== undefined) [m[kx], m[ky]] = f(m[kx], m[ky]);
    return m;
  });
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
// 右下を支点に回す
const tilt = (cmds, deg, base) => {
  const b = bbox(cmds), a = (deg * Math.PI) / 180, px = b.x2, py = base;
  return mapPts(cmds, (x, y) => [
    px + (x - px) * Math.cos(a) - (y - py) * Math.sin(a),
    py + (x - px) * Math.sin(a) + (y - py) * Math.cos(a),
  ]);
};

const CAP_H = 60, BASE = 70, TRACK = 0.13;
const size = CAP_H / (caps.tables.os2.sCapHeight / caps.unitsPerEm);

let x = 0, word = '';
for (const ch of 'PONKOTSU') {
  if (ch === 'T') x += T_BEFORE * size;
  let cmds = caps.getPath(ch, x, BASE, size).commands;
  if (ch === 'T') cmds = tilt(cmds, TILT, BASE);
  word += toD(cmds);
  x += caps.getAdvanceWidth(ch, size) + TRACK * size + (ch === 'T' ? T_AFTER * size : 0);
}
const wordEnd = x - TRACK * size;

// software：下段・右揃え・字間広め
const SS = 21, ST = 0.28, SW_BASE = BASE + 36;
const swW = [...'software'].reduce((w, ch) => w + sub.getAdvanceWidth(ch, SS), 0) + ST * SS * 7;
let sx = wordEnd - swW, soft = '';
for (const ch of 'software') {
  soft += toD(sub.getPath(ch, sx, SW_BASE, SS).commands);
  sx += sub.getAdvanceWidth(ch, SS) + ST * SS;
}

const svg = (vb, w, h, d, label = 'PONKOTSU software') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" role="img" aria-label="${label}">\n<title>${label}</title>\n${d}\n</svg>\n`;

fs.mkdirSync(out, { recursive: true });
const top = BASE - CAP_H - 6, W = wordEnd + 4;
for (const [name, c] of Object.entries(COLORS)) {
  // フル：PONKOTSU + software
  const H = SW_BASE + 6 - top;
  fs.writeFileSync(path.join(out, `logo-${name}.svg`), svg(`-2 ${n(top)} ${n(W)} ${n(H)}`, Math.round(W), Math.round(H), `<path fill="${c}" d="${word}${soft}"/>`));
  // コンパクト：PONKOTSU のみ（ヘッダーなど小さい場所用）
  const Hc = BASE + 4 - top;
  fs.writeFileSync(path.join(out, `logo-compact-${name}.svg`), svg(`-2 ${n(top)} ${n(W)} ${n(Hc)}`, Math.round(W), Math.round(Hc), `<path fill="${c}" d="${word}"/>`));
}

// バッジ：2000年代の PC ゲームの箱に刷られていたような、箱に収めたロゴ。下段は「細い線 ── software」
//   badge-*       塗りの箱に抜き文字＋内枠（幅 200px 以上で使う）
//   badge-small-* 内枠なし（幅 200px 未満用）
//   badge-line-*  箱を塗らず枠線だけ。背景が透けて見える（写真・イラストの上用）
{
  const PX = 30, PT = 26, PB = 24;
  // 線は software の x ハイトの中ほど
  const lineY = SW_BASE - 0.24 * SS, swBase = SW_BASE;
  const bx = -PX, by = top + 6 - PT, bw = wordEnd + PX * 2, bh = swBase + PB - by;
  const ruleEnd = wordEnd - swW - 14;
  const vb = `${n(bx)} ${n(by)} ${n(bw)} ${n(bh)}`;
  const content = (fg) => `<path fill="${fg}" d="${word}${soft}"/>\n<rect x="0" y="${n(lineY - 1.1)}" width="${n(ruleEnd)}" height="2.2" fill="${fg}"/>`;
  const write = (file, body) => fs.writeFileSync(path.join(out, file), svg(vb, Math.round(bw), Math.round(bh), body));
  for (const [name, box] of Object.entries(COLORS)) {
    const fg = name === 'black' ? COLORS.white : COLORS.black;
    const fill = `<rect x="${n(bx)}" y="${n(by)}" width="${n(bw)}" height="${n(bh)}" fill="${box}"/>`;
    const inner = `<rect x="${n(bx + 6)}" y="${n(by + 6)}" width="${n(bw - 12)}" height="${n(bh - 12)}" fill="none" stroke="${fg}" stroke-width="1.6"/>`;
    write(`logo-badge-${name}.svg`, `${fill}\n${inner}\n${content(fg)}`);
    write(`logo-badge-small-${name}.svg`, `${fill}\n${content(fg)}`);
    // 枠線だけ：線と文字が同じ色（black = 黒い線と文字）
    write(`logo-badge-line-${name}.svg`, `<rect x="${n(bx + 1.5)}" y="${n(by + 1.5)}" width="${n(bw - 3)}" height="${n(bh - 3)}" fill="none" stroke="${box}" stroke-width="3"/>\n${content(box)}`);
  }
}

// ファビコン：黒地に、傾いた白い T
{
  const s = 40 / (caps.tables.os2.sCapHeight / caps.unitsPerEm);
  let t = caps.getPath('T', 0, 0, s).commands;
  const b = bbox(t);
  t = mapPts(t, (px, py) => [px - (b.x1 + b.x2) / 2 + 32, py + 52]);
  t = tilt(t, TILT, 52);
  fs.writeFileSync(
    path.join(root, 'public/favicon.svg'),
    svg('0 0 64 64', 64, 64, `<rect width="64" height="64" rx="12" fill="#000"/>\n<path fill="#fff" d="${toD(t)}"/>`),
  );
}
console.log('logo written to', path.relative(root, out));
