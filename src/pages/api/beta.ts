import type { APIRoute } from 'astro';
import { BETA_ACCESS_CODES, BETA_FILE_KEY, DOWNLOAD_SIGNING_SECRET } from 'astro:env/server';
import { safeEqual } from '../../lib/signing';
import { MANIFESTS, json, signedManifest, signedUrl } from '../../lib/downloads';
import { allowed, tooMany } from '../../lib/limits';

export const prerender = false;

// 製品版：アクセスコードが合えば、OS ごとに 10 分だけ有効なリンクを返す。
// コードの総当たりを防ぐため、試行の回数を IP ごとに絞る
export const POST: APIRoute = async ({ request }) => {
  if (!(await allowed('CODE_LIMITER', request, 'code'))) {
    return tooMany('試行が多すぎます。1 分ほど待ってから、もう一度入力してください。');
  }

  const codes = (BETA_ACCESS_CODES ?? '').split(',').map((c) => c.trim()).filter(Boolean);
  if (!codes.length || !DOWNLOAD_SIGNING_SECRET) {
    return json({ error: '現在、ダウンロードの受付を停止しています。' }, 503);
  }

  const data = await request.formData().catch(() => null);
  const token = String(data?.get('token') ?? '').trim();
  if (!token || !codes.some((c) => safeEqual(c, token))) {
    return json({ error: 'アクセスコードが正しくありません。' }, 401);
  }

  const manifest = await signedManifest(MANIFESTS.full);
  if (manifest) return json(manifest);

  // CI からの配布がまだないときは、手で置いた 1 ファイルを渡す
  if (BETA_FILE_KEY) return json({ url: await signedUrl(BETA_FILE_KEY) });
  return json({ error: '配布できるファイルがまだありません。' }, 503);
};
