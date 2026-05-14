/**
 * Akash AI — Demo Mode Responses
 * When APIs fail or keys are missing, return realistic demo outputs
 * so users NEVER see blank screens or errors
 */

// ═══════════════════════════════
// IMAGE DEMOS
// ═══════════════════════════════
export function demoImageGenerate(prompt: string): string {
  // Return an SVG placeholder that shows the prompt
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#6366f1"/><stop offset="100%" style="stop-color:#d946ef"/></linearGradient></defs>
    <rect width="512" height="512" fill="url(#g)" rx="16"/>
    <text x="256" y="220" font-family="sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.9">🎨 AI Generated Image</text>
    <text x="256" y="260" font-family="sans-serif" font-size="13" fill="white" text-anchor="middle" opacity="0.6">${prompt.slice(0, 50)}</text>
    <text x="256" y="300" font-family="sans-serif" font-size="11" fill="white" text-anchor="middle" opacity="0.4">[Demo Mode — Add HF API key]</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export function demoRemoveBg(): string {
  return demoSvg('🖼️', 'Background Removed', 'Demo — transparent bg applied');
}

export function demoCartoon(): string {
  return demoSvg('🎭', 'Cartoon Style Applied', 'Demo — AnimeGAN style');
}

export function demoColorize(): string {
  return demoSvg('🌈', 'Image Colorized', 'Demo — colors added');
}

// ═══════════════════════════════
// TEXT DEMOS
// ═══════════════════════════════
export function demoSummarize(text: string): string {
  const sentences = text.split(/[.!?।]+/).filter(s => s.trim().length > 5);
  return sentences.slice(0, 2).join('. ').trim() + '.';
}

export function demoParaphrase(text: string): string {
  const synonyms: Record<string, string> = { 'good': 'excellent', 'bad': 'poor', 'big': 'large', 'small': 'tiny', 'fast': 'rapid', 'slow': 'gradual', 'happy': 'joyful', 'sad': 'melancholic', 'ভালো': 'চমৎকার', 'খারাপ': 'অপ্রীতিকর', 'বড়': 'বিশাল', 'ছোট': 'ক্ষুদ্র' };
  let result = text;
  for (const [w, r] of Object.entries(synonyms)) result = result.replace(new RegExp(`\\b${w}\\b`, 'gi'), r);
  return result || text;
}

export function demoGrammar(text: string): { corrected: string; issues: number } {
  return { corrected: text, issues: 0 };
}

export function demoTranslate(text: string, to: string): string {
  if (to === 'bn') return `[বাংলা অনুবাদ] ${text.slice(0, 100)}... (Demo — API key দিন)`;
  return `[Translation] ${text.slice(0, 100)}... (Demo — add API key)`;
}

export function demoSentiment(): { sentiment: string; confidence: string } {
  return { sentiment: 'ইতিবাচক 😊', confidence: '78.5%' };
}

export function demoKeywords(text: string): { word: string; score: string }[] {
  const words = text.split(/\s+/).filter(w => w.length > 4).slice(0, 5);
  return words.map((w, i) => ({ word: w.replace(/[^a-zA-Z\u0980-\u09FF]/g, ''), score: `${90 - i * 10}%` }));
}

// ═══════════════════════════════
// AUDIO DEMOS
// ═══════════════════════════════
export function demoTTS(): string {
  return 'demo_mode'; // Frontend handles with browser SpeechSynthesis
}

export function demoSTT(): string {
  return 'এটি একটি ডেমো ট্রান্সক্রিপশন। আসল ফলাফল পেতে HuggingFace API key দিন।';
}

// ═══════════════════════════════
// AI CHAT / WRITING DEMOS
// ═══════════════════════════════
export function demoChat(prompt: string): string {
  const responses: Record<string, string> = {
    default: `আপনার প্রশ্ন পেয়েছি: "${prompt.slice(0, 50)}..."\n\nএটি ডেমো মোড। সম্পূর্ণ AI উত্তর পেতে HuggingFace API key সেট করুন (.env.local ফাইলে)।\n\nনির্দেশনা:\n1. huggingface.co/settings/tokens এ যান\n2. নতুন token তৈরি করুন\n3. .env.local এ HUGGINGFACE_API_KEY=hf_xxx যোগ করুন\n4. সার্ভার রিস্টার্ট করুন`,
  };
  return responses.default;
}

export function demoStory(genre: string): string {
  return `📖 **ডেমো গল্প — ${genre || 'অ্যাডভেঞ্চার'}**\n\nএকদিন সকালে আকাশ ঘুম থেকে উঠে দেখল জানালার বাইরে সবকিছু বদলে গেছে...\n\n[সম্পূর্ণ গল্প পেতে API key দিন]`;
}

export function demoEmail(type: string): string {
  return `বিষয়: ${type || 'গুরুত্বপূর্ণ'}\n\nপ্রিয় মহোদয়,\n\nআপনাকে জানাচ্ছি যে...\n\n[ডেমো মোড — সম্পূর্ণ ইমেইল পেতে API key দিন]\n\nবিনীত,\nনাম`;
}

export function demoCode(language: string, desc: string): string {
  const samples: Record<string, string> = {
    javascript: `// ${desc || 'Hello World'}\nfunction demo() {\n  console.log("Demo mode — add API key for real code generation");\n  return true;\n}`,
    python: `# ${desc || 'Hello World'}\ndef demo():\n    print("Demo mode — add API key")\n    return True`,
    default: `// ${desc}\n// Demo mode — add HuggingFace API key for real code generation`,
  };
  return samples[language?.toLowerCase()] || samples.default;
}

// ═══════════════════════════════
// UTILITY DEMOS (always work, no API needed)
// ═══════════════════════════════
// These don't need demos as they're pure JS

// ═══════════════════════════════
// HEALTH DEMOS
// ═══════════════════════════════
export function demoDietPlan(): string {
  return `🥗 **৭-দিনের ডায়েট প্ল্যান (ডেমো)**\n\n**দিন ১:**\n- সকাল: ওটমিল + কলা\n- দুপুর: ভাত + মাছ + সবজি\n- রাত: রুটি + ডাল\n\n[সম্পূর্ণ প্ল্যান পেতে API key দিন]`;
}

export function demoWorkout(): string {
  return `💪 **সাপ্তাহিক ওয়ার্কআউট (ডেমো)**\n\n**সোম:** Push-ups 3x10, Squats 3x15\n**মঙ্গল:** Jogging 20 min\n**বুধ:** Rest\n\n[সম্পূর্ণ প্ল্যান পেতে API key দিন]`;
}

// ═══════════════════════════════
// EDUCATION DEMOS
// ═══════════════════════════════
export function demoQuiz(topic: string): string {
  return `📝 **কুইজ: ${topic} (ডেমো)**\n\n**১.** ${topic} কী?\nA) বিকল্প ১\nB) বিকল্প ২ ✅\nC) বিকল্প ৩\nD) বিকল্প ৪\n\n[আরো প্রশ্ন পেতে API key দিন]`;
}

export function demoAssignment(topic: string): string {
  return `📄 **${topic} — অ্যাসাইনমেন্ট (ডেমো)**\n\n**ভূমিকা:**\n${topic} একটি গুরুত্বপূর্ণ বিষয়...\n\n[সম্পূর্ণ অ্যাসাইনমেন্ট পেতে API key দিন]`;
}

// ═══════════════════════════════
// HELPER
// ═══════════════════════════════
function demoSvg(icon: string, title: string, subtitle: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#1a1a2e" rx="16"/><text x="256" y="230" font-size="48" text-anchor="middle">${icon}</text><text x="256" y="280" font-family="sans-serif" font-size="16" fill="white" text-anchor="middle">${title}</text><text x="256" y="310" font-family="sans-serif" font-size="11" fill="#888" text-anchor="middle">${subtitle}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export const DEMO_FLAG = { isDemo: true, note: '⚡ ডেমো মোড — সম্পূর্ণ ফলাফল পেতে API key সেট করুন' };
