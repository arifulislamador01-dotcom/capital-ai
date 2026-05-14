'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function WouldYouRatherPage() { return <AITextTool title="Would You Rather" titleBn="Would You Rather" icon="🤔" description="মজার 'Would You Rather' প্রশ্ন তৈরি করুন" placeholder="বিষয় বা থিম... যেমন: সুপারপাওয়ার, খাবার, ভ্রমণ" promptTemplate={(t) => `Generate 10 fun "Would You Rather" questions about: ${t}\n\nFormat: Would you rather [option A] or [option B]?\nInclude both English and Bengali versions.\n\nQuestions:`} creditCost={1} inputLabel="থিম" />; }
