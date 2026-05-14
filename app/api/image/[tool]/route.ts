import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const toolId = url.pathname.split('/api/image/')[1]?.replace(/\/$/, '');

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `img-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) return NextResponse.json({ success: false, error: 'ইমেজ দিন।' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mime = file.type || 'image/png';

    if (toolId === 'watermark') {
      const text = (formData.get('text') as string) || 'Akash AI';
      // In production use sharp/canvas for real watermark
      // For now, return image with metadata
      return NextResponse.json({
        success: true,
        image: `data:${mime};base64,${base64}`,
        watermarkText: text,
        note: 'Install sharp for server-side watermark: npm i sharp',
      });
    }

    if (toolId === 'resize') {
      const width = parseInt((formData.get('width') as string) || '800');
      const height = parseInt((formData.get('height') as string) || '600');
      // In production: sharp(buffer).resize(width, height).toBuffer()
      return NextResponse.json({
        success: true,
        image: `data:${mime};base64,${base64}`,
        originalSize: bytes.byteLength,
        targetWidth: width, targetHeight: height,
        note: 'Install sharp for server-side resize',
      });
    }

    if (toolId === 'convert') {
      const format = (formData.get('format') as string) || 'webp';
      // In production: sharp(buffer).toFormat(format).toBuffer()
      return NextResponse.json({
        success: true,
        image: `data:image/${format};base64,${base64}`,
        originalFormat: mime,
        convertedFormat: format,
        note: 'Install sharp for format conversion',
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown image tool' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
