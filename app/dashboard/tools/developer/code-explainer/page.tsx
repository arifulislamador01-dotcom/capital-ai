'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function CodeExplainerPage() { return <AITextTool title="Code Explainer" titleBn="কোড এক্সপ্লেইনার" icon="💻" description="যেকোনো কোড সহজ ভাষায় বুঝুন — বাংলায়" placeholder="কোড পেস্ট করুন..." promptTemplate={(t) => `Explain the following code in simple Bengali language. Line by line if needed:\n\n${t}\n\nExplanation in Bengali:`} creditCost={2} inputLabel="কোড" maxTokens={600} />; }
