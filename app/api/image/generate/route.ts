import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const token = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    if (!token || !accountId) return NextResponse.json({ error: 'API Key নেই' }, { status: 500 });

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, num_steps: 4 })
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.log('CF Error:', JSON.stringify(err).slice(0, 300));
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    return NextResponse.json({ success: true, result: dataUri });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

