'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function StoryGeneratorPage() {
  return <AITextTool title="Story Generator" titleBn="গল্প জেনারেটর" icon="📖" description="AI দিয়ে সুন্দর গল্প লিখুন — বাংলা বা ইংরেজি" placeholder="গল্পের বিষয় লিখুন... যেমন: একটি ছোট ছেলে যে মহাকাশে যেতে চায়" promptTemplate={(t) => `Write a creative and engaging short story about: ${t}\n\nStory:`} creditCost={2} maxTokens={800} inputLabel="গল্পের বিষয়" />;
}
