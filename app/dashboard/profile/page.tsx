'use client';
import { UserProfile } from '@clerk/nextjs';
import { useAppContext } from '@/lib/providers';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { language } = useAppContext();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 font-display text-[var(--text-primary)]">
          {language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}
        </h1>
        <p className="text-[var(--text-secondary)] font-bengali">
          {language === 'bn' ? 'আপনার প্রোফাইল, পাসওয়ার্ড এবং অন্যান্য তথ্য আপডেট করুন।' : 'Update your profile, password, and other information.'}
        </p>
      </div>

      <div className="glass-card p-6 flex justify-center border border-[var(--border-color)]">
        <UserProfile
          appearance={{
            elements: {
              card: "shadow-none bg-transparent",
              navbar: "hidden", // We can hide the default sidebar if we want, but it's okay to leave it
              rootBox: "w-full mx-auto"
            }
          }}
        />
      </div>
    </div>
  );
}
