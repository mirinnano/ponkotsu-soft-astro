// サイト内パスにベースパスを付ける（GitHub Pages などサブパス配信のため）
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const u = (path: string) => `${base}${path}` || '/';
