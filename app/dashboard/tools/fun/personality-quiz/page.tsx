'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function PersonalityPage() { return <AITextTool title="Personality Quiz" titleBn="পার্সোনালিটি কুইজ" icon="🧠" description="মজার পার্সোনালিটি কুইজ তৈরি করুন" placeholder="কুইজের থিম... যেমন: কোন সুপারহিরো আপনি?, আপনার স্পিরিট এনিমাল" promptTemplate={(t) => `Create a fun personality quiz about: ${t}\n\nInclude 5 questions, each with 4 options (A/B/C/D). At the end, provide 4 personality results based on most chosen letter.\n\nQuiz:`} creditCost={2} inputLabel="কুইজ থিম" maxTokens={700} />; }
