import type { APIRoute } from 'astro';
import { DOWNLOAD_SIGNING_SECRET } from 'astro:env/server';
import { MANIFESTS, json, signedManifest } from '../../lib/downloads';
import { allowed, tooMany } from '../../lib/limits';

export const prerender = false;

// 体験版：コードなしで配る。同じ人が何度もリンクを出せないよう、回数を IP ごとに絞る
export const POST: APIRoute = async ({ request }) => {
  if (!(await allowed('LINK_LIMITER', request, 'demo'))) {
    return tooMany('リンクの発行が続いています。1 分ほど待ってから、もう一度お試しください。');
  }
  if (!DOWNLOAD_SIGNING_SECRET) {
    return json({ error: '現在、体験版の配布を停止しています。' }, 503);
  }
  const manifest = await signedManifest(MANIFESTS.demo);
  if (!manifest) return json({ error: '体験版はまだ準備中です。' }, 503);
  return json(manifest);
};
