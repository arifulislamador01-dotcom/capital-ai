import { NextResponse } from 'next/server';
import { hfBinaryInference, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { demoTTS, DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'audio-tts', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text, lang = 'bn', voice = 'male' } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (apiKey && !apiKey.startsWith('your')) {
        // ElevenLabs voice synthesis
        const voiceId = lang === 'bn' ? (voice === 'male' ? 'pNInz6obpgDQGcFmaJcg' : 'EXAVITQu4vr4xnSDxMaL') : (voice === 'male' ? 'ErXwobaYiN019PkySvjV' : 'MF3mGyEYCl7XYWbV9V6O');
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, model_id: lang === 'bn' ? 'eleven_multilingual_v2' : 'eleven_monolingual_v1', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
        });
        if (res.ok) {
          const buf = await res.arrayBuffer();
          return NextResponse.json({ success: true, audio: `data:audio/mpeg;base64,${Buffer.from(buf).toString('base64')}`, provider: 'elevenlabs' });
        }
      }

      // Fallback: HF TTS (English only for MMS currently, so we use it as fallback)
      const result = await hfBinaryInference(MODELS.MMS_TTS, Buffer.from(JSON.stringify({ inputs: text })));
      if (result.type === 'binary') {
        return NextResponse.json({ success: true, audio: `data:audio/wav;base64,${result.buffer.toString('base64')}`, provider: 'huggingface' });
      }

      throw new Error('TTS failed');
    } catch {
      return NextResponse.json({ success: true, audio: demoTTS(), provider: 'browser', ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: true, audio: demoTTS(), provider: 'browser', ...DEMO_FLAG });
  }
}

