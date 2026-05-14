import { NextResponse } from 'next/server';
import { hfBinaryInference, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'voice-clone', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (apiKey && !apiKey.startsWith('your')) {
      // ElevenLabs voice synthesis
      const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model_id: 'eleven_monolingual_v1', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
      });
      if (res.ok) {
        const buf = await res.arrayBuffer();
        return NextResponse.json({ success: true, audio: `data:audio/mpeg;base64,${Buffer.from(buf).toString('base64')}`, provider: 'elevenlabs' });
      }
    }

    // Fallback: HF TTS
    const result = await hfBinaryInference(MODELS.MMS_TTS, Buffer.from(JSON.stringify({ inputs: text })));
    if (result.type === 'binary') {
      return NextResponse.json({ success: true, audio: `data:audio/wav;base64,${result.buffer.toString('base64')}`, provider: 'huggingface' });
    }

    return NextResponse.json({ success: false, error: 'Voice clone unavailable' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

