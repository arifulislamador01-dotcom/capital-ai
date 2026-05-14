'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function TriviaPage() { return <AITextTool title="Trivia Quiz" titleBn="ট্রিভিয়া কুইজ" icon="🧩" description="মজার ট্রিভিয়া প্রশ্ন তৈরি করুন" placeholder="বিষয় লিখুন... যেমন: বাংলাদেশ, বিজ্ঞান, ক্রিকেট" promptTemplate={(t) => `Generate 10 fun trivia questions about: ${t}\n\nFormat each:\nQ: [question]\nA: [answer]\n\nTrivia:`} creditCost={2} inputLabel="বিষয়" />; }
