import { env } from 'cloudflare:workers';

// Workers の Rate Limiting（wrangler.jsonc の ratelimits）。追加料金はかからない。
// 数え方は IP ごと・Cloudflare の拠点ごとのおおよその値で、厳密な上限ではない。
// R2 の読み出し回数と帯域を、総当たりや繰り返しダウンロードで無駄に使わせないために置く
type Limiter = { limit(options: { key: string }): Promise<{ success: boolean }> };
export type LimiterName = 'CODE_LIMITER' | 'LINK_LIMITER' | 'FETCH_LIMITER';

export async function allowed(name: LimiterName, request: Request, scope: string) {
  const limiter = (env as Record<string, Limiter | undefined>)[name];
  if (!limiter) return true; // ローカルなど、設定がない環境では数えない
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const { success } = await limiter.limit({ key: `${scope}:${ip}` });
  return success;
}

export const tooMany = (message: string) =>
  new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
  });
