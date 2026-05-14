import { NextResponse } from 'next/server';

export async function GET() {
  // In production this would check Clerk auth and query Supabase
  return NextResponse.json({
    remaining: 20,
    isPremium: false,
    tier: 0,
    resetsAt: new Date().toISOString(),
  });
}

