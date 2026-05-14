'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function BanglishPage() { return <AITextTool title="Banglish to Bangla" titleBn="ব্যাংলিশ টু বাংলা" icon="🇧🇩" description="রোমান হরফে লেখা বাংলা → প্রকৃত বাংলায় রূপান্তর" placeholder="Banglish e likhun... jemon: ami banglay gaan gai" promptTemplate={(t) => `Convert the following Banglish (Bengali written in Roman/English letters) to proper Bangla script. Only output the Bangla text:\n\n${t}\n\nBangla:`} creditCost={1} inputLabel="ব্যাংলিশে লিখুন" />; }
