'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function AdCopyPage() {
  return <AITextTool title="Ad Copy" titleBn="অ্যাড কপি জেনারেটর" icon="📢" description="Facebook/Google বিজ্ঞাপনের কপি তৈরি করুন" placeholder="প্রোডাক্ট বা সার্ভিসের বিবরণ দিন..." promptTemplate={(t) => `Write 3 high-converting ad copies for: ${t}\n\nFor each ad, provide:\n1. Headline (under 30 chars)\n2. Primary text (compelling, under 125 chars)\n3. Description\n4. Call-to-action button text\n\nWrite for both Facebook Ads and Google Ads formats.\n\nAd copies:`} creditCost={2} inputLabel="প্রোডাক্ট/সার্ভিস" />;
}
