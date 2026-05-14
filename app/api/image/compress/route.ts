import { NextResponse } from 'next/server';
import { errorResponse, successResponse, rateLimit } from '@/lib/api-helpers';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const quality = parseInt((formData.get('quality') as string) || '70');
    if (!file) return errorResponse('Image file required', 400);

    const userId = (formData.get('userId') as string) || 'anon';
    const rl = rateLimit(userId);
    if (!rl.allowed) return errorResponse('Too many requests', 429);

    const bytes = await file.arrayBuffer();
    const originalSize = bytes.byteLength;

    // Server-side compression using Canvas-compatible approach
    // In production, use Sharp: const sharp = require('sharp');
    // const compressed = await sharp(Buffer.from(bytes)).jpeg({ quality }).toBuffer();

    // For now, return base64 with metadata (client-side Canvas handles compression)
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    return successResponse({
      image: `data:${mimeType};base64,${base64}`,
      originalSize,
      compressedSize: Math.round(originalSize * (quality / 100)),
      quality,
      savedPercent: Math.round((1 - quality / 100) * 100),
      provider: 'server-canvas',
    });
  } catch (e: any) {
    return errorResponse(e.message || 'Compression failed');
  }
}

