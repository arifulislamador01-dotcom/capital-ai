import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-color-palette', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    try {
      const response = await fetch('http://colormind.io/api/', {
        method: 'POST',
        body: JSON.stringify({ model: "default" })
      });
      
      if (!response.ok) throw new Error('Colormind API failed');
      const data = await response.json();
      
      // Convert RGB arrays to Hex
      const hexPalette = data.result.map((rgb: number[]) => {
        return "#" + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
      });
      
      return NextResponse.json({ success: true, result: hexPalette });
    } catch {
      return NextResponse.json({ success: true, result: ['#0A0A0A', '#00D4FF', '#7B2FBE', '#FFFFFF', '#94A3B8'], ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কালার প্যালেট তৈরি ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}

