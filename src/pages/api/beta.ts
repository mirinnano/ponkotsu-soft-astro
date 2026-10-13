import type { APIRoute } from 'astro';
import { BETA_ACCESS_CODES, BETA_FILE_KEY, DOWNLOAD_SIGNING_SECRET } from 'astro:env/server';
import { safeEqual, sign } from '../../lib/signing';
import { u } from '../../lib/url';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// アクセスコードが合っていれば、10 分だけ有効なダウンロード URL を返す
export const POST: APIRoute = async ({ request }) => {
  const codes = (BETA_ACCESS_CODES ?? '').split(',').map((c) => c.trim()).filter(Boolean);
  if (!codes.length || !BETA_FILE_KEY || !DOWNLOAD_SIGNING_SECRET) {
    return json({ error: '現在ベータ版の配布は停止しています。' }, 503);
  }

  const data = await request.formData().catch(() => null);
  const token = String(data?.get('token') ?? '').trim();
  if (!token || !codes.some((c) => safeEqual(c, token))) {
    return json({ error: 'アクセスコードが正しくありません。' }, 401);
  }

  const s = await sign(DOWNLOAD_SIGNING_SECRET, BETA_FILE_KEY, 600);
  const q = new URLSearchParams({ k: s.key, e: String(s.exp), s: s.sig });
  return json({ url: `${u('/api/download')}?${q}` });
};
