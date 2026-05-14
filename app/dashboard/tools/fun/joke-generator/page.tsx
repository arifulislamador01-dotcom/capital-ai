'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function JokePage() { return <AITextTool title="Joke Generator" titleBn="জোক জেনারেটর" icon="😂" description="AI দিয়ে মজার জোক তৈরি করুন — বাংলায়" placeholder="জোকের ধরন... যেমন: পরীক্ষা, প্রেম, প্রোগ্রামিং, পাড়ার আড্ডা" promptTemplate={(t) => `Generate 5 funny jokes in Bengali about: ${t}\n\nMake them family-friendly and culturally relevant to Bangladesh.\n\nJokes:`} creditCost={1} inputLabel="বিষয়" />; }
