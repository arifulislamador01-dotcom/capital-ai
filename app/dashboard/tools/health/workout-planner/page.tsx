'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function WorkoutPlannerPage() { return <AITextTool title="Workout Planner" titleBn="ওয়ার্কআউট প্ল্যানার" icon="💪" description="AI দিয়ে ব্যায়াম প্ল্যান তৈরি করুন" placeholder="যেমন: ওজন কমানো, ঘরে ব্যায়াম, ৩০ মিনিট, বিগিনার" promptTemplate={(t) => `Create a detailed workout plan for: ${t}\n\nInclude: Warm-up, Main exercises (sets, reps, rest), Cool-down. Format clearly.\n\nWorkout Plan:`} creditCost={2} inputLabel="আপনার লক্ষ্য" maxTokens={600} />; }
