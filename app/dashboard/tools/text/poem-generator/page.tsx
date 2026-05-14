'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function PoemPage() {
  return <AITextTool title="Poem Generator" titleBn="কবিতা জেনারেটর" icon="🎭" description="AI দিয়ে সুন্দর কবিতা লিখুন — বাংলা বা ইংরেজি" placeholder="কবিতার বিষয় লিখুন... যেমন: প্রকৃতি, ভালোবাসা, বৃষ্টি" promptTemplate={(t) => `Write a beautiful and emotional poem about: ${t}\n\nWrite in both Bengali and English.\n\nPoem:`} creditCost={2} maxTokens={500} inputLabel="কবিতার বিষয়" />;
}
