'use client';
import Link from 'next/link';
import { useAppContext } from '@/lib/providers';

interface ToolCardProps {
  tool: any;
  showUsageCount?: boolean;
  badge?: 'new' | 'popular' | 'trending' | 'featured';
}

export default function ToolCard({ tool, showUsageCount = true, badge }: ToolCardProps) {
  const { language } = useAppContext();

  const badgeConfig = {
    new: { label: language === 'bn' ? 'নতুন' : 'New', color: 'from-amber-500 to-orange-600' },
    popular: { label: language === 'bn' ? 'জনপ্রিয়' : 'Popular', color: 'from-blue-500 to-cyan-600' },
    trending: { label: language === 'bn' ? 'ট্রেন্ডিং' : 'Trending', color: 'from-red-500 to-pink-600' },
    featured: { label: language === 'bn' ? 'বৈশিষ্ট্য' : 'Featured', color: 'from-purple-500 to-pink-600' },
  };

  const getBadge = () => {
    if (badge && badgeConfig[badge]) {
      const config = badgeConfig[badge];
      return (
        <span className={`absolute -top-2 -right-2 px-2.5 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r ${config.color} shadow-lg animate-pulse`}>
          {config.label}
        </span>
      );
    }
    return null;
  };

  const usageCount = showUsageCount ? Math.floor(Math.random() * 9999) + 1000 : null;

  return (
    <Link href={tool.href} className="tool-card group h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-300" />
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
      
      <div className="relative z-10">
        {/* Badge */}
        {getBadge()}

        {/* Icon */}
        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
        
        {/* Title */}
        <h3 className="font-semibold text-[var(--text-primary)] text-sm line-clamp-2 mb-1 group-hover:text-primary-400 transition-colors">
          {language === 'bn' ? tool.nameBn : tool.name}
        </h3>
        
        {/* Description */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 mb-3">{tool.description}</p>
        
        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
          {/* Credit badge */}
          <div>
            {tool.creditCost === 0 ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">{language === 'bn' ? 'ফ্রি' : 'Free'}</span>
            ) : (
              <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-medium">{tool.creditCost} {language === 'bn' ? 'ক্রে' : 'CR'}</span>
            )}
          </div>
          
          {/* Usage count */}
          {usageCount && (
            <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
              {usageCount.toLocaleString()} {language === 'bn' ? 'ব্যবহার' : 'uses'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
