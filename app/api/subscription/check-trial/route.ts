import { NextResponse } from 'next/server';
import { hasUsedTrial } from '@/lib/subscription';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id');
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 });

  const used = await hasUsedTrial(userId);
  return NextResponse.json({ hasUsedTrial: used });
}

