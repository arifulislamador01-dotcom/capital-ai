'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function MindMapPage() { return <AITextTool title="Mind Map" titleBn="মাইন্ড ম্যাপ জেনারেটর" icon="🧠" description="AI দিয়ে বিষয়ভিত্তিক মাইন্ড ম্যাপ তৈরি করুন" placeholder="বিষয় লিখুন..." promptTemplate={(t) => `Create a detailed mind map structure for: ${t}\n\nFormat as indented text:\n- Main Topic\n  - Branch 1\n    - Sub-branch 1.1\n    - Sub-branch 1.2\n  - Branch 2\n    - Sub-branch 2.1\n\nMind Map:`} creditCost={2} inputLabel="মূল বিষয়" />; }
