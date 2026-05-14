'use client';
import Link from 'next/link';
import { useAppContext } from '@/lib/providers';

export default function Footer() {
  const { language } = useAppContext();
  const currentYear = new Date().getFullYear();

  const links = {
    company: [
      { label: language === 'bn' ? 'সম্পর্কে' : 'About', href: '#' },
      { label: language === 'bn' ? 'ব্লগ' : 'Blog', href: '#' },
      { label: language === 'bn' ? 'ক্যারিয়ার' : 'Careers', href: '#' },
      { label: language === 'bn' ? 'যোগাযোগ' : 'Contact', href: '#' },
    ],
    legal: [
      { label: language === 'bn' ? 'শর্তাবলী' : 'Terms', href: '#' },
      { label: language === 'bn' ? 'গোপনীয়তা' : 'Privacy', href: '#' },
      { label: language === 'bn' ? 'কুকি নীতি' : 'Cookies', href: '#' },
    ],
    resources: [
      { label: language === 'bn' ? 'ডকুমেন্টেশন' : 'Docs', href: '#' },
      { label: language === 'bn' ? 'API' : 'API', href: '#' },
      { label: language === 'bn' ? 'সাপোর্ট' : 'Support', href: '#' },
      { label: language === 'bn' ? 'FAQ' : 'FAQ', href: '#' },
    ],
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">C</div>
              <span className="text-lg font-bold text-gradient">Capital AI</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {language === 'bn' ? 
                'AI দিয়ে আপনার সৃজনশীলতা এবং উৎপাদনশীলতা বাড়ান।' :
                'Boost your creativity and productivity with AI.'
              }
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm">👨‍💻</a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm">🐦</a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm">📘</a>
              <a href="#" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm">📺</a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">{language === 'bn' ? 'কোম্পানি' : 'Company'}</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">{language === 'bn' ? 'আইনি' : 'Legal'}</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-4">{language === 'bn' ? 'সম্পদ' : 'Resources'}</h4>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)] text-center md:text-left mb-4 md:mb-0">
            <span className="font-semibold">© {currentYear} Capital AI</span>
            {language === 'bn' ? ' - সমস্ত অধিকার সংরক্ষিত।' : ' - All rights reserved.'}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <span className="hidden sm:inline-block">
              {language === 'bn' ? 
                'নির্মিত হয়েছে ❤️ দিয়ে বাংলাদেশে' :
                'Built with ❤️ in Bangladesh'
              }
            </span>
            <span className="text-primary-400">•</span>
            <span className="inline-flex items-center gap-1">
              🚀 {language === 'bn' ? 'Gemini 2.5 দ্বারা চালিত' : 'Powered by Gemini 2.5'}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-green-400 font-semibold">
              {language === 'bn' ? 'সিস্টেম চালু আছে' : 'All Systems Operational'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
