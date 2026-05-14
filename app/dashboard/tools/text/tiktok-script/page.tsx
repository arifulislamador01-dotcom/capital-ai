'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function TiktokScriptPage() {
  return <AITextTool title="TikTok Script" titleBn="TikTok/Reel স্ক্রিপ্ট" icon="🎵" description="ভাইরাল TikTok বা Reel এর স্ক্রিপ্ট লিখুন" placeholder="ভিডিওর আইডিয়া লিখুন..." promptTemplate={(t) => `Write a viral 30-60 second TikTok/Instagram Reel script about: ${t}\n\nInclude: Hook (first 3 seconds), Main content, Call to action, Trending sounds suggestion, and hashtags.\n\nScript:`} creditCost={2} inputLabel="ভিডিও আইডিয়া" />;
}
