import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { BETA_ACCESS_CODES, BETA_FILE_KEY, DOWNLOAD_SIGNING_SECRET } from 'astro:env/server';
import { safeEqual, sign } from '../../lib/signing';
import { u } from '../../lib/url';

export const prerender = false;

// 製品版のビルドは aria-engine-rust の CI が R2 に置き、`<作品>/latest.json` に OS ごとの
// ファイルを書く。アクセスコードが合えば、その一覧に 10 分だけ有効な URL を付けて返す
const MANIFEST_KEY = 'hesphoros/latest.json';
const TTL_SECONDS = 600;

type ManifestFile = { platform: string; label: string; name: string; key: string; size: number; sha256: string };
type Manifest = { version: string; built_at: string; files: ManifestFile[] };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function signedUrl(key: string) {
  const s = await sign(DOWNLOAD_SIGNING_SECRET!, key, TTL_SECONDS);
  const q = new URLSearchParams({ k: s.key, e: String(s.exp), s: s.sig });
  return `${u('/api/download')}?${q}`;
}

async function readManifest(): Promise<Manifest | null> {
  const bucket = (env as { DOWNLOADS?: R2Bucket }).DOWNLOADS;
  const object = await bucket?.get(MANIFEST_KEY);
  if (!object) return null;
  const manifest = (await object.json().catch(() => null)) as Manifest | null;
  return manifest?.files?.length ? manifest : null;
}

export const POST: APIRoute = async ({ request }) => {
  const codes = (BETA_ACCESS_CODES ?? '').split(',').map((c) => c.trim()).filter(Boolean);
  if (!codes.length || !DOWNLOAD_SIGNING_SECRET) {
    return json({ error: '現在、ダウンロードの受付を停止しています。' }, 503);
  }

  const data = await request.formData().catch(() => null);
  const token = String(data?.get('token') ?? '').trim();
  if (!token || !codes.some((c) => safeEqual(c, token))) {
    return json({ error: 'アクセスコードが正しくありません。' }, 401);
  }

  const manifest = await readManifest();
  if (manifest) {
    const files = await Promise.all(
      manifest.files.map(async (f) => ({
        platform: f.platform,
        label: f.label,
        name: f.name,
        size: f.size,
        sha256: f.sha256,
        url: await signedUrl(f.key),
      })),
    );
    return json({ version: manifest.version, files });
  }

  // CI からの配布がまだないときは、手で置いた 1 ファイルを渡す
  if (BETA_FILE_KEY) return json({ url: await signedUrl(BETA_FILE_KEY) });
  return json({ error: '配布できるファイルがまだありません。' }, 503);
};
