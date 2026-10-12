import type { APIRoute } from 'astro';
import { BETA_ACCESS_CODES, BETA_DOWNLOAD_URL } from 'astro:env/server';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  const codes = (BETA_ACCESS_CODES ?? '').split(',').map((c) => c.trim()).filter(Boolean);
  if (codes.length === 0 || !BETA_DOWNLOAD_URL) {
    return json({ error: '現在ベータ版の配布は停止しています。' }, 503);
  }

  const data = await request.formData().catch(() => null);
  const token = String(data?.get('token') ?? '').trim();
  if (!token || !codes.includes(token)) {
    return json({ error: 'アクセスコードが正しくありません。' }, 401);
  }
  return json({ url: BETA_DOWNLOAD_URL });
};
