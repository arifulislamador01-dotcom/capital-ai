'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useAppContext } from '@/lib/providers';
import { Bell, Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, notifications, clearNotifications } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] flex items-center justify-between px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-[rgba(99,102,241,0.1)] transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'টুল খুঁজুন...' : 'Search tools...'}
            className="input-field pl-10 bg-[var(--bg-primary)] w-full"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Credits badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
          <span className="text-sm">⚡</span>
          <span className="text-sm font-semibold text-primary-400">20 ক্রেডিট</span>
        </div>

        {/* Mobile credits icon */}
        <div className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
          <span className="text-sm">⚡</span>
          <span className="text-xs font-semibold text-primary-400">20</span>
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="hidden md:block p-2 rounded-lg hover:bg-[rgba(99,102,241,0.1)] transition-colors text-xl">
          {mounted && (theme === 'dark' ? '☀️' : '🌙')}
        </button>

        {/* Language toggle */}
        <button onClick={toggleLanguage} className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.1)] transition-colors text-xs md:text-sm font-bold text-[var(--text-secondary)]">
          {language === 'bn' ? 'EN' : 'বাং'}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.1)] transition-colors relative group">
            <Bell className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-primary-400 transition-colors" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[var(--bg-secondary)] shadow-lg shadow-red-500/50 animate-pulse"></span>
            )}
            {/* New Feature Badge */}
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-full font-bold animate-bounce shadow-lg shadow-cyan-500/50">নতুন</span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 md:w-72 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl py-2 z-50">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-[var(--border-color)]">
                <h3 className="font-semibold text-[var(--text-primary)]">{language === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</h3>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-xs text-primary-500 hover:text-primary-400">
                    {language === 'bn' ? 'ক্লিয়ার' : 'Clear'}
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto pt-2">
                {notifications.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)] px-4 py-3 text-center">
                    {language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No new notifications'}
                  </p>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="px-4 py-3 hover:bg-[rgba(99,102,241,0.05)] border-b border-[var(--border-color)] last:border-0">
                      <p className="text-sm text-[var(--text-primary)]">{notif}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <UserButton 
          afterSignOutUrl="/"
          userProfileMode="navigation"
          userProfileUrl="/dashboard/profile"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9 shadow-[0_0_15px_rgba(0,212,255,0.4)]"
            }
          }}
        />
      </div>
    </header>
  );
}
