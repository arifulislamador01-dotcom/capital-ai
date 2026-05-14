'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function InstagramBioPage() {
  return <AITextTool title="Instagram Bio" titleBn="ইনস্টাগ্রাম বায়ো" icon="📱" description="আকর্ষণীয় Instagram বায়ো তৈরি করুন" placeholder="আপনি কী করেন বলুন... যেমন: ফটোগ্রাফার, ফুড ব্লগার, স্টুডেন্ট" promptTemplate={(t) => `Generate 5 creative and catchy Instagram bio options for someone who is: ${t}\n\nEach bio should be under 150 characters, include emojis, and have a unique style (professional, funny, aesthetic, minimal, bold).\n\nBios:`} creditCost={2} inputLabel="আপনার পরিচয়" />;
}
