import { NextResponse } from 'next/server';
import { hfImageGeneration, hfBinaryInference, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const tool = url.pathname.split('/api/video/')[1];

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `video-${tool}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    if (tool === 'thumbnail') {
      const { title, style, channel_name } = await req.json();
      if (!title) return NextResponse.json({ success: false, error: 'Title দিন।' }, { status: 400 });

      const prompt = `YouTube thumbnail, ${style || 'professional'}, bold text "${title}", ${channel_name ? `channel ${channel_name}` : ''}, vibrant colors, high quality, 1280x720`;
      const buf = await hfImageGeneration(MODELS.FLUX_SCHNELL, prompt, { timeoutMs: 45000 });

      return NextResponse.json({
        success: true,
        image: `data:image/png;base64,${buf.toString('base64')}`,
      });
    }

    if (tool === 'caption') {
      const formData = await req.formData();
      const file = formData.get('audio') as File;
      if (!file) return NextResponse.json({ success: false, error: 'Audio/Video ফাইল দিন।' }, { status: 400 });

      const bytes = await file.arrayBuffer();
      const result = await hfBinaryInference(MODELS.WHISPER_LARGE, bytes, { timeoutMs: 60000 });

      const text = result.type === 'json' ? result.data?.text : '';
      // Generate SRT format
      const words = (text || '').split(' ');
      const srtLines: string[] = [];
      for (let i = 0; i < words.length; i += 10) {
        const chunk = words.slice(i, i + 10).join(' ');
        const start = Math.floor(i / 3);
        const end = start + 3;
        const idx = Math.floor(i / 10) + 1;
        srtLines.push(`${idx}\n${formatSRT(start)} --> ${formatSRT(end)}\n${chunk}\n`);
      }

      return NextResponse.json({ success: true, text, srt: srtLines.join('\n') });
    }

    return NextResponse.json({ success: false, error: 'Unknown video tool' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

function formatSRT(seconds: number): string {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s},000`;
}
