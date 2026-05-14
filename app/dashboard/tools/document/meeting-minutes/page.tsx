'use client';
import AITextTool from '@/components/shared/AITextTool';
export default function MeetingMinutesPage() { return <AITextTool title="Meeting Minutes" titleBn="মিটিং মিনিটস" icon="📋" description="মিটিংয়ের মিনিটস তৈরি করুন" placeholder="মিটিংয়ের নোট বা বিষয়গুলো লিখুন..." promptTemplate={(t) => `Generate professional meeting minutes from these notes: ${t}\n\nFormat:\n- Meeting Title\n- Date & Time\n- Attendees\n- Agenda Items\n- Discussion Points\n- Action Items (who, what, deadline)\n- Next Meeting\n\nMeeting Minutes:`} creditCost={2} inputLabel="মিটিং নোটস" maxTokens={600} />; }
