'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function QuizPage() { return <AITextTool title="Quiz Generator" titleBn="কুইজ জেনারেটর" icon="❓" description="MCQ কুইজ তৈরি করুন — উত্তরসহ" placeholder="বিষয় লিখুন..." promptTemplate={(t) => `Generate a quiz with 10 multiple choice questions about: ${t}\n\nFormat:\nQ1: [question]\na) [option] b) [option] c) [option] d) [option]\nAnswer: [correct letter]\n\nQuiz:`} creditCost={2} inputLabel="কুইজের বিষয়" maxTokens={800} />; }
