import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { DOWNLOAD_SIGNING_SECRET } from 'astro:env/server';
import { verify } from '../../lib/signing';

export const prerender = false;

// 署名付き URL を確かめて、R2 からファイルを流す。Range に対応しているので中断しても再開できる
export const GET: APIRoute = async ({ url, request }) => {
  const key = url.searchParams.get('k') ?? '';
  const exp = Number(url.searchParams.get('e'));
  const sig = url.searchParams.get('s') ?? '';
  if (!DOWNLOAD_SIGNING_SECRET || !key || !(await verify(DOWNLOAD_SIGNING_SECRET, key, exp, sig))) {
    return new Response('リンクの有効期限が切れています。もう一度アクセスコードを入力してください。', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const bucket = (env as { DOWNLOADS?: R2Bucket }).DOWNLOADS;
  if (!bucket) return new Response('配布ファイルの置き場が設定されていません。', { status: 503 });

  const object = await bucket.get(key, { range: request.headers, onlyIf: request.headers });
  if (!object) return new Response('ファイルが見つかりません。', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'private, no-store');
  headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(key.split('/').pop() ?? key)}`);

  if (!('body' in object)) return new Response(null, { status: 304, headers });

  const range = object.range as { offset?: number; length?: number } | undefined;
  if (range && request.headers.has('range')) {
    const start = range.offset ?? 0;
    const end = start + (range.length ?? object.size - start) - 1;
    headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(object.body, { status: 206, headers });
  }
  headers.set('Content-Length', String(object.size));
  return new Response(object.body, { headers });
};
