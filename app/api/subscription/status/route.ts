import { NextResponse } from 'next/server';
import { checkAndExpireTrials, getTrialStatus } from '@/lib/subscription';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('user_id');
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 });

  // Auto-expire if needed
  await checkAndExpireTrials(userId);

  // Get current status
  const status = await getTrialStatus(userId);
  return NextResponse.json(status);
}

