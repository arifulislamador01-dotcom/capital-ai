'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function NoteSummarizerPage() { return <AITextTool title="Note Summarizer" titleBn="নোট সারাংশ" icon="📝" description="লম্বা নোট থেকে ছোট সারাংশ তৈরি করুন" placeholder="নোট পেস্ট করুন..." promptTemplate={(t) => `Summarize the following study notes into concise bullet points. Highlight key concepts:\n\n${t}\n\nSummary:`} creditCost={1} inputLabel="নোট" />; }
