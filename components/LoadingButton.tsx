'use client';

export function LoadingButton({ 
  loading, 
  text, 
  loadingText = 'কাজ হচ্ছে...',
  onClick, 
  disabled = false,
  className = ''
}: {
  loading: boolean;
  text: string;
  loadingText?: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button 
      onClick={onClick} 
      disabled={loading || disabled} 
      className={`btn-glow w-full flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-80' : ''} ${className}`}
    >
      {loading ? (
        <>
          <span className="inline-flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
              <path d="M12 2A10 10 0 0112 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          {loadingText}
        </>
      ) : (
        text
      )}
    </button>
  );
}
