'use client';

interface LoadingStateProps {
  type?: 'text' | 'image' | 'card' | 'list';
  lines?: number;
}

export default function LoadingState({ type = 'text', lines = 4 }: LoadingStateProps) {
  if (type === 'image') {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="skeleton w-full aspect-square max-w-md mx-auto" />
        <div className="flex justify-center gap-3">
          <div className="skeleton h-10 w-28 rounded-lg" />
          <div className="skeleton h-10 w-28 rounded-lg" />
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 animate-fade-in">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
