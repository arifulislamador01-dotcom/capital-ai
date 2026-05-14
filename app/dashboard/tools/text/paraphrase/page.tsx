'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function ParaphrasePage() {
  return <AITextTool title="Paraphraser" titleBn="প্যারাফ্রেজার" icon="🔄" description="লেখা নতুন করে রিফ্রেজ করুন — AI দিয়ে" placeholder="রিফ্রেজ করতে লেখা পেস্ট করুন..." promptTemplate={(t) => `Paraphrase the following text while keeping the meaning intact:\n\n${t}\n\nParaphrased version:`} creditCost={1} inputLabel="অরিজিনাল লেখা" />;
}
