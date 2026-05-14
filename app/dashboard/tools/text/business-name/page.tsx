'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function BusinessNamePage() {
  return <AITextTool title="Business Name" titleBn="বিজনেস নেম জেনারেটর" icon="🏢" description="আপনার ব্যবসার জন্য ক্রিয়েটিভ নাম তৈরি করুন" placeholder="ব্যবসার ধরন বলুন... যেমন: অনলাইন ফুড ডেলিভারি ঢাকায়" promptTemplate={(t) => `Generate 10 creative, catchy, and memorable business name ideas for: ${t}\n\nFor each name, explain why it works. Include both English and Bengali name options.\n\nBusiness names:`} creditCost={2} inputLabel="ব্যবসার বিবরণ" />;
}
