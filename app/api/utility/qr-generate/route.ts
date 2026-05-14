import { errorResponse, successResponse, validateFields, rateLimit } from '@/lib/api-helpers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const err = validateFields(body, ['text']);
    if (err) return errorResponse(err, 400);

    const { text, size = 256, userId = 'anon' } = body;
    if (text.length > 2000) return errorResponse('Text too long. Max 2000 chars.', 400);

    const rl = rateLimit(userId);
    if (!rl.allowed) return errorResponse('Too many requests', 429);

    // Use Google Charts QR API (free, no key)
    const qrUrl = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(text)}&choe=UTF-8`;

    // Verify it works
    const res = await fetch(qrUrl);
    if (!res.ok) throw new Error('QR generation failed');

    const buf = await res.arrayBuffer();
    return successResponse({
      qr: `data:image/png;base64,${Buffer.from(buf).toString('base64')}`,
      text, size,
      provider: 'google-charts',
    });
  } catch (e: any) {
    // Fallback: qrserver.com
    try {
      const body2 = await req.clone().json().catch(() => ({ text: '' }));
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(body2.text || 'hello')}`;
      return successResponse({ qr: url, provider: 'qrserver-fallback' });
    } catch {
      return errorResponse(e.message || 'QR generation failed');
    }
  }
}

