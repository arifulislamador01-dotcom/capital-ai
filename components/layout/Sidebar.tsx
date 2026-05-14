'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/tools-data';
import { useAppContext } from '@/lib/providers';
import { X } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const { language } = useAppContext();

  return (
    <aside className={`h-full transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[260px]'} bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--border-color)]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">C</div>
            <span className="text-lg font-bold text-gradient">Capital AI</span>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.1)] text-[var(--text-secondary)] transition-colors hidden md:block">
            {collapsed ? '→' : '←'}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.1)] text-[var(--text-secondary)] transition-colors md:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-3">
        <Link href="/dashboard" className="sidebar-link">
          <span>📊</span>
          {!collapsed && <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>}
        </Link>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {!collapsed && <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-3 py-2">Tools</p>}
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            <button
              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
              className="sidebar-link w-full justify-between"
            >
              <div className="flex items-center gap-3">
                <span>{cat.icon}</span>
                {!collapsed && <span>{language === 'bn' ? cat.nameBn : cat.name}</span>}
              </div>
              {!collapsed && (
                <span className={`text-xs transition-transform ${expandedCategory === cat.id ? 'rotate-90' : ''}`}>▶</span>
              )}
            </button>
            {!collapsed && expandedCategory === cat.id && (
              <div className="ml-4 pl-4 border-l border-[var(--border-color)] space-y-0.5 mt-1 animate-slide-up">
                {cat.tools.map(tool => (
                  <Link key={tool.id} href={tool.href} className="sidebar-link text-sm py-2">
                    <span className="text-xs">{tool.icon}</span>
                    <span className="truncate">{language === 'bn' ? tool.nameBn : tool.name}</span>
                    {tool.creditCost === 0 && <span className="ml-auto text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">{language === 'bn' ? 'ফ্রি' : 'Free'}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Credit info */}
      {!collapsed && (
        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="glass-card p-4 text-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/30 hover:border-primary-500/50 transition-all">
            <p className="text-xs text-[var(--text-secondary)] font-bengali mb-1">{language === 'bn' ? 'আপনার ক্রেডিট' : 'Your Credits'}</p>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">20</span>
              <span className="text-xs text-gray-500">/ ∞</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{language === 'bn' ? 'ফ্রি প্ল্যানে' : 'Free Plan'}</p>
            <Link href="/pricing" className="w-full block px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105 btn-glow">
              {language === 'bn' ? '⭐ প্রিমিয়াম আপগ্রেড' : '⭐ Go Premium'}
            </Link>
            <p className="text-[10px] text-gray-600 mt-2">{language === 'bn' ? 'প্রথম মাস ৫০% ছাড় পাবেন' : 'Get 50% off first month'}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
