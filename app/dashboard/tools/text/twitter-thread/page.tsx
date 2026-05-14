'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function TwitterThreadPage() {
  return <AITextTool title="Twitter Thread" titleBn="টুইটার থ্রেড" icon="🐦" description="এনগেজিং টুইটার থ্রেড লিখুন" placeholder="থ্রেডের বিষয় লিখুন..." promptTemplate={(t) => `Write an engaging Twitter/X thread (10 tweets) about: ${t}\n\nFirst tweet should be a strong hook. Number each tweet. Keep under 280 characters each. End with a CTA.\n\nThread:`} creditCost={2} inputLabel="থ্রেডের বিষয়" />;
}
