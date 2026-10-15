import { env } from 'cloudflare:workers';
import { DOWNLOAD_SIGNING_SECRET } from 'astro:env/server';
import { sign } from './signing';
import { u } from './url';

// aria-engine-rust の CI が R2 に置く配布物の一覧。製品版と体験版で置き場を分ける
export const MANIFESTS = {
  full: 'hesphoros/latest.json',
  demo: 'hesphoros-demo/latest.json',
} as const;

const TTL_SECONDS = 600;

type ManifestFile = { platform: string; label: string; name: string; key: string; size: number; sha256: string };
type Manifest = { version: string; built_at: string; files: ManifestFile[] };

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export async function signedUrl(key: string) {
  const s = await sign(DOWNLOAD_SIGNING_SECRET!, key, TTL_SECONDS);
  const q = new URLSearchParams({ k: s.key, e: String(s.exp), s: s.sig });
  return `${u('/api/download')}?${q}`;
}

async function readManifest(key: string): Promise<Manifest | null> {
  const bucket = (env as { DOWNLOADS?: R2Bucket }).DOWNLOADS;
  const object = await bucket?.get(key);
  if (!object) return null;
  const manifest = (await object.json().catch(() => null)) as Manifest | null;
  return manifest?.files?.length ? manifest : null;
}

// OS ごとに 10 分間有効なリンクを付けた一覧。一覧がなければ null
export async function signedManifest(key: string) {
  const manifest = await readManifest(key);
  if (!manifest) return null;
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
  return { version: manifest.version, files };
}
