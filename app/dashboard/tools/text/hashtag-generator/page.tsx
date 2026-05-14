'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function HashtagPage() {
  return <AITextTool title="Hashtag Generator" titleBn="হ্যাশট্যাগ জেনারেটর" icon="#️⃣" description="সোশ্যাল মিডিয়ার জন্য ট্রেন্ডিং হ্যাশট্যাগ তৈরি করুন" placeholder="বিষয় লিখুন... যেমন: food photography, travel Bangladesh" promptTemplate={(t) => `Generate 30 relevant and trending hashtags for: ${t}\n\nGroup them into: High volume, Medium volume, and Niche hashtags.\n\nHashtags:`} creditCost={2} inputLabel="বিষয়" />;
}
