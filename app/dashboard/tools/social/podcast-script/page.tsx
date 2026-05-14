'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function PodcastScriptPage() { return <AITextTool title="Podcast Script" titleBn="পডকাস্ট স্ক্রিপ্ট" icon="🎙️" description="AI দিয়ে পডকাস্ট স্ক্রিপ্ট লিখুন" placeholder="পডকাস্টের বিষয়... যেমন: ফ্রিল্যান্সিং বাংলাদেশে, AI এর ভবিষ্যৎ" promptTemplate={(t) => `Write a podcast script for a 15-minute episode about: ${t}\n\nInclude:\n- Intro with hook\n- Main segments (3-4)\n- Transitions\n- Key talking points\n- Outro with CTA\n\nPodcast Script:`} creditCost={3} inputLabel="পডকাস্ট বিষয়" maxTokens={800} />; }
