import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = await req.json();
    if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 });

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 });
    }

    const audio = await response.arrayBuffer();
    return new NextResponse(audio, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

