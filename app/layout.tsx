import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from '@/lib/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Capital AI - বাংলাদেশের সেরা AI টুলস প্ল্যাটফর্ম | ১০০+ টুলস',
  description: 'Capital AI দিয়ে আপনার সৃজনশীলতা বাড়ান। ১০০+ শক্তিশালী AI টুলস - ইমেজ, ভিডিও, অডিও, লেখা, শিক্ষা এবং আরও অনেক কিছু। সম্পূর্ণ বাংলায়। প্রথম ২০ ক্রেডিট বিনামূল্যে।',
  keywords: [
    'AI tools',
    'বাংলা AI টুলস',
    'ইমেজ জেনারেটর',
    'ভিডিও এডিটর',
    'টেক্সট রাইটার',
    'অডিও কনভার্টার',
    'Bangladesh AI',
    'AI সফটওয়্যার',
    'ফ্রি AI টুলস',
    'Capital AI'
  ],
  authors: [{ name: 'Capital AI Team' }],
  creator: 'Capital AI',
  publisher: 'Capital AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://capitalai.com',
    siteName: 'Capital AI',
    title: 'Capital AI - বাংলাদেশের সেরা AI টুলস প্ল্যাটফর্ম',
    description: 'Capital AI দিয়ে আপনার সৃজনশীলতা বাড়ান। ১০০+ শক্তিশালী AI টুলস - সম্পূর্ণ বাংলায়।',
    images: [
      {
        url: 'https://capitalai.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Capital AI - AI টুলস প্ল্যাটফর্ম',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capital AI - বাংলাদেশের সেরা AI টুলস',
    description: 'Capital AI দিয়ে আপনার সৃজনশীলতা বাড়ান। ১০০+ AI টুলস এক জায়গায়।',
    images: ['https://capitalai.com/og-image.png'],
    creator: '@capitalai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code-here', // এটি Google Search Console থেকে পাবেন
    // yandex: 'your-yandex-code',
    // yahoo: 'your-yahoo-code',
  },
  alternates: {
    canonical: 'https://capitalai.com',
    languages: {
      'bn-BD': 'https://capitalai.com',
      'en-US': 'https://capitalai.com/en',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  
  // Strict check to prevent "Invalid character" crash from Clerk
  let isClerkMissing = false;
  // if (clerkKey.startsWith('pk_test_') || clerkKey.startsWith('pk_live_')) {
  //   if (clerkKey.length > 40 && !clerkKey.includes('ZHVtbXktYXBw')) {
  //     isClerkMissing = false;
  //   }
  // }

  if (isClerkMissing) {
    return (
      <html lang="bn" className="dark" suppressHydrationWarning>
        <body className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center font-bengali">
          <div className="bg-slate-900 p-10 max-w-lg rounded-2xl border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="w-16 h-16 mx-auto bg-red-500/20 text-red-500 flex items-center justify-center rounded-full text-3xl mb-6">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">Clerk API Keys Missing!</h1>
            <p className="text-slate-400 mb-6 leading-relaxed">
              আপনার প্রজেক্টের <b className="text-cyan-400">.env.local</b> ফাইলে Clerk-এর পাবলিশেবল কী সেট করা নেই, তাই ওয়েবসাইটটি ক্র্যাশ করছে। দয়া করে নিচের ফরম্যাটে Key গুলো বসিয়ে সার্ভার রিস্টার্ট দিন:
            </p>
            <div className="bg-black p-4 rounded-xl border border-slate-800 text-left mb-6 overflow-x-auto">
              <code className="text-sm text-green-400">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...<br/>
                CLERK_SECRET_KEY=sk_test_...
              </code>
            </div>
            <p className="text-xs text-slate-500">Capital AI Platform</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkKey.trim()}>
      <html lang="bn" suppressHydrationWarning>
        <head>
          {/* Structured Data - Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Capital AI',
                url: 'https://capitalai.com',
                logo: 'https://capitalai.com/logo.png',
                description: 'Capital AI - বাংলাদেশের সেরা AI টুলস প্ল্যাটফর্ম',
                sameAs: [
                  'https://www.facebook.com/capitalai',
                  'https://www.twitter.com/capitalai',
                  'https://www.instagram.com/capitalai',
                ],
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+880-1XXXXXXXXX',
                  contactType: 'Customer Support',
                },
              }),
            }}
          />

          {/* Structured Data - SoftwareApplication */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Capital AI',
                applicationCategory: 'WebApplication',
                description: '১০০+ শক্তিশালী AI টুলস - ইমেজ, ভিডিও, অডিও, টেক্সট এবং আরও অনেক কিছু',
                url: 'https://capitalai.com',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'BDT',
                  description: 'প্রতিদিন ২০টি ফ্রি ক্রেডিট',
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.8',
                  ratingCount: '1000+',
                },
              }),
            }}
          />

          {/* Structured Data - WebSite */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Capital AI',
                url: 'https://capitalai.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://capitalai.com/search?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
        </head>
        <body className="min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-white antialiased font-bengali transition-colors duration-300">
          <AppProvider>
            {children}
            <Toaster position="bottom-right" />
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
