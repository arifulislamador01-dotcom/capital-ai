'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function BlogOutlinePage() {
  return <AITextTool title="Blog Outline" titleBn="ব্লগ আউটলাইন" icon="📋" description="SEO-ফ্রেন্ডলি ব্লগের কাঠামো তৈরি করুন" placeholder="ব্লগের টপিক লিখুন..." promptTemplate={(t) => `Create a detailed blog outline for: ${t}\n\nInclude: Title (H1), Introduction hook, Main sections (H2) with subsections (H3), Key points for each section, Conclusion, and SEO keywords.\n\nOutline:`} creditCost={2} inputLabel="ব্লগ টপিক" maxTokens={600} />;
}
