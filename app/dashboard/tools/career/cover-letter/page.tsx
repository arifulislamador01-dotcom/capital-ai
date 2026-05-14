'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function CoverLetterPage() { return <AITextTool title="Cover Letter" titleBn="কভার লেটার" icon="📄" description="প্রফেশনাল কভার লেটার তৈরি করুন" placeholder="পদ ও যোগ্যতা বলুন... যেমন: Software Engineer পদে আবেদন, ৩ বছরের অভিজ্ঞতা React এ" promptTemplate={(t) => `Write a professional cover letter for: ${t}\n\nFollow standard format: Header, greeting, intro paragraph, experience/skills paragraph, closing paragraph, sign-off.\n\nCover Letter:`} creditCost={2} inputLabel="পদ ও যোগ্যতা" maxTokens={600} />; }
