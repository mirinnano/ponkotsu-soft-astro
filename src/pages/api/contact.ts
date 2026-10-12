import type { APIRoute } from 'astro';
import { CONTACT_WEBHOOK_URL } from 'astro:env/server';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const field = (data: FormData, key: string, max: number) => String(data.get(key) ?? '').trim().slice(0, max);

export const POST: APIRoute = async ({ request }) => {
  if (!CONTACT_WEBHOOK_URL) {
    return json({ error: 'フォームは現在準備中です。X のDMからご連絡ください。' }, 503);
  }

  const data = await request.formData().catch(() => null);
  if (!data) return json({ error: '送信内容を読み取れませんでした。' }, 400);

  // ボット対策のハニーポット
  if (field(data, 'website', 200)) return json({ ok: true });

  const name = field(data, 'name', 100);
  const email = field(data, 'email', 200);
  const subject = field(data, 'subject', 200);
  const message = field(data, 'message', 4000);
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: '未入力の項目があるか、メールアドレスの形式が正しくありません。' }, 400);
  }

  const content = [`**お問い合わせ** ${subject || '(件名なし)'}`, `from: ${name} <${email}>`, '', message].join('\n');
  const res = await fetch(CONTACT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Discord は content、Slack は text を読む
    body: JSON.stringify({ content, text: content }),
  }).catch(() => null);

  if (!res?.ok) return json({ error: '送信に失敗しました。時間をおいて再度お試しください。' }, 502);
  return json({ ok: true });
};
