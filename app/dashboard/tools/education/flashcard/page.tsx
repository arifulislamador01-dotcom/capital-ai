'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function FlashcardPage() { return <AITextTool title="Flashcard" titleBn="ফ্ল্যাশকার্ড জেনারেটর" icon="🃏" description="AI দিয়ে পড়ার ফ্ল্যাশকার্ড তৈরি করুন" placeholder="বিষয় লিখুন... যেমন: বাংলাদেশের ইতিহাস, Physics Newton's Laws" promptTemplate={(t) => `Create 10 study flashcards (Question on front, Answer on back) about: ${t}\n\nFormat each as:\nQ: [question]\nA: [concise answer]\n\nFlashcards:`} creditCost={2} inputLabel="বিষয়" />; }
