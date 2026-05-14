'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function ProductDescPage() {
  return <AITextTool title="Product Description" titleBn="প্রোডাক্ট ডেসক্রিপশন" icon="🛒" description="AI দিয়ে আকর্ষণীয় প্রোডাক্ট বর্ণনা লিখুন" placeholder="প্রোডাক্টের নাম ও বিবরণ দিন... যেমন: নীল রঙের কটন শার্ট, সাইজ M-XL" promptTemplate={(t) => `Write a compelling e-commerce product description for: ${t}\n\nInclude: Catchy title, Key features (bullet points), Benefits, and a persuasive call-to-action.\n\nDescription:`} creditCost={2} inputLabel="প্রোডাক্ট বিবরণ" />;
}
