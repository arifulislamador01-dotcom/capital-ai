import React from 'react';

export interface ToolInfo {
  id: string; name: string; nameBn: string; description: string;
  icon: React.ReactNode; category: string; creditCost: number; isPremium: boolean; href: string;
}
export interface CategoryInfo {
  id: string; name: string; nameBn: string; icon: React.ReactNode; color: string; tools: ToolInfo[];
}

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    image: 'from-rose-500 to-pink-600',
    text: 'from-indigo-500 to-blue-600',
    education: 'from-emerald-500 to-teal-600',
    career: 'from-sky-500 to-blue-600',
    media: 'from-amber-500 to-orange-600',
    utility: 'from-violet-500 to-purple-600',
    audio: 'from-amber-500 to-orange-600',
    video: 'from-purple-500 to-fuchsia-600',
    design: 'from-pink-500 to-rose-600',
    finance: 'from-green-500 to-emerald-600',
    health: 'from-red-500 to-rose-600',
    bangladesh: 'from-emerald-600 to-green-700',
    fun: 'from-orange-500 to-amber-600',
    social: 'from-rose-500 to-red-600',
    developer: 'from-teal-500 to-emerald-600',
    document: 'from-slate-500 to-gray-600',
    ecommerce: 'from-amber-500 to-yellow-600',
    namaz: 'from-green-600 to-teal-600'
  };
  return colors[cat] || 'from-slate-700 to-slate-800';
};

export const SmartIcon = ({ emoji, cat }: { emoji: string, cat?: string }) => (
  <div className={`flex items-center justify-center min-w-[36px] w-9 h-9 rounded-xl bg-gradient-to-br ${getCategoryColor(cat || 'utility')} shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-white/10 shrink-0`}>
    <span className="text-lg drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">{emoji}</span>
  </div>
);

const t = (id:string,name:string,nameBn:string,desc:string,icon:string,cat:string,cost:number,pre=false):ToolInfo=>({id,name,nameBn,description:desc,icon: <SmartIcon emoji={icon} cat={cat} />,category:cat,creditCost:cost,isPremium:pre,href:`/dashboard/tools/${cat}/${id}`});

export const CATEGORIES: CategoryInfo[] = [
  // 1. 🖼️ ইমেজ টুলস
  { id:'image', name:'Image Tools', nameBn:'🖼️ ইমেজ টুলস', icon:<SmartIcon emoji="🖼️" cat="image" />, color:'#f43f5e', tools:[
    t('text-to-image','Text to Image','টেক্সট টু ইমেজ','AI দিয়ে ছবি তৈরি','🖼️','image',3),
    t('background-remove','Background Remove','ব্যাকগ্রাউন্ড রিমুভ','ব্যাকগ্রাউন্ড মুছুন','✂️','image',3),
    t('meme-generator','Meme Generator','মিম জেনারেটর','মজার মিম তৈরি','😂','image',0),
    t('image-colorize','Image Colorizer','ইমেজ কালারাইজার','সাদাকালো ছবিতে রঙ','🌈','image',3),
    t('image-compress','Image Compressor','ইমেজ কম্প্রেসর','সাইজ কমান','📦','image',0),
    t('image-upscale','Image Upscale','ইমেজ রিসাইজ','কোয়ালিটি বাড়ান','🔍','image',3),
    t('watermark','Watermark Adder','ওয়াটারমার্ক','ওয়াটারমার্ক যোগ','💧','image',0),
    t('photo-filter','Photo Filters','ফটো কনভার্ট','ছবিতে ফিল্টার','📸','image',0),
    t('avatar-generator','Avatar Generator','অ্যাভাটার জেনারেটর','কাস্টম অ্যাভাটার','👤','image',0),
    t('product-bg','Product Background','প্রোডাক্ট ব্যাকগ্রাউন্ড','ব্যাকগ্রাউন্ড বদলান','🛍️','image',2),
  ]},

  // 2. ✍️ টেক্সট টুলস
  { id:'text', name:'Text Tools', nameBn:'✍️ টেক্সট টুলস', icon:<SmartIcon emoji="✍️" cat="text" />, color:'#6366f1', tools:[
    t('chatbot','AI Chatbot','AI চ্যাটবট','AI এর সাথে কথা','🤖','text',2),
    t('caption-generator','Caption Generator','ক্যাপশন জেনারেটর','সোশ্যাল ক্যাপশন','📸','text',2),
    t('email-writer','Email Writer','ইমেইল রাইটার','প্রফেশনাল ইমেইল','📧','text',2),
    t('grammar-check','Grammar Checker','গ্রামার চেকার','ব্যাকরণ ঠিক করুন','✅','text',1),
    t('summarize','Text Summarizer','সারাংশ','লম্বা লেখা ছোট করুন','📝','text',1),
    t('translate','Translator','অনুবাদক','যেকোনো ভাষায় অনুবাদ','🌐','text',1),
    t('cover-letter','Cover Letter','কভার লেটার','কভার লেটার','✉️','text',2),
    t('poem-generator','Poem Generator','কবিতা জেনারেটর','AI কবিতা','🎭','text',2),
    t('paraphrase','AI Paraphraser','প্যারাফ্রেজার','লেখা রিফ্রেজ','🔄','text',1),
    t('story-generator','Story Generator','গল্প জেনারেটর','AI দিয়ে গল্প','📖','text',2),
    t('youtube-script','YouTube Script','ইউটিউব স্ক্রিপ্ট','ভিডিও স্ক্রিপ্ট','🎬','text',2),
    t('blog-outline','Blog Outline','ব্লগ আউটলাইন','ব্লগের কাঠামো','📋','text',2),
    t('ad-copy','Ad Copy Generator','অ্যাড কপি','বিজ্ঞাপন কপি','📢','text',2),
    t('hashtag-generator','Hashtag Generator','হ্যাশট্যাগ','ট্রেন্ডিং হ্যাশট্যাগ','#️⃣','text',2),
    t('product-description','Product Description','প্রোডাক্ট ডেসক্রিপশন','পণ্যের বর্ণনা','🛒','text',2),
    t('business-name','Business Name','বিজনেস নেম','ব্যবসার নাম','🏢','text',2),
    t('tiktok-script','TikTok Script','TikTok স্ক্রিপ্ট','Reel স্ক্রিপ্ট','🎵','text',2),
    t('twitter-thread','Twitter Thread','টুইটার থ্রেড','থ্রেড লিখুন','🐦','text',2),
    t('instagram-bio','Instagram Bio','ইনস্টাগ্রাম বায়ো','বায়ো তৈরি','📱','text',2),
    t('code-explainer','Code Explainer','কোড এক্সপ্লেইনার','কোড বুঝুন','💻','text',2),
  ]},

  // 3. 🎓 শিক্ষা টুলস
  { id:'education', name:'Education Tools', nameBn:'🎓 শিক্ষা টুলস', icon:<SmartIcon emoji="🎓" cat="education" />, color:'#10b981', tools:[
    t('flashcard','Flashcard Generator','ফ্ল্যাশকার্ড','পড়ার ফ্ল্যাশকার্ড','🃏','education',2),
    t('quiz-generator','Quiz Generator','কুইজ জেনারেটর','MCQ কুইজ','❓','education',2),
    t('note-summarizer','Note Summarizer','নোট সারাংশ','নোট ছোট করুন','📝','education',1),
    t('mind-map','Mind Map','মাইন্ড ম্যাপ','বিষয়ের মানচিত্র','🧠','education',2),
    t('pomodoro','Pomodoro Timer','পমোডোরো টাইমার','পড়ার টাইমার','⏰','education',0),
    t('vocabulary','Vocabulary Builder','শব্দভাণ্ডার','শব্দ শিখুন','📖','education',0),
  ]},

  // 4. 💼 ক্যারিয়ার টুলস
  { id:'career', name:'Career Tools', nameBn:'💼 ক্যারিয়ার টুলস', icon:<SmartIcon emoji="💼" cat="career" />, color:'#0ea5e9', tools:[
    t('resume-builder','Resume Builder','রিজিউমে বিল্ডার','CV/Resume তৈরি','📄','career',5),
    t('interview-qa','Interview Q&A','ইন্টারভিউ প্রশ্ন','ইন্টারভিউ প্রস্তুতি','🎯','career',2),
    t('linkedin-bio','LinkedIn Bio','লিংকডইন বায়ো','প্রফাইল বায়ো','💼','career',2),
    t('darkhast','Darkhast Writer','দরখাস্ত লেখক','দরখাস্ত লিখুন','📄','career',2),
  ]},

  // 5. 🎵 মিডিয়া টুলস
  { id:'media', name:'Media Tools', nameBn:'🎵 মিডিয়া টুলস', icon:<SmartIcon emoji="🎵" cat="media" />, color:'#f59e0b', tools:[
    t('speech-to-text','Speech to Text','অডিও টু টেক্সট','কথা থেকে লেখা','🎤','audio',5),
    t('text-to-speech','Text to Speech','টেক্সট টু স্পিচ','লেখা থেকে কথা','🔊','audio',5),
    t('generate','AI Video Generate','ভিডিও জেনারেট','টেক্সট থেকে ভিডিও','🎥','video',5),
    t('script','Video Script Generator','ভিডিও স্ক্রিপ্ট','ভিডিওর জন্য স্ক্রিপ্ট','📜','video',2),
    t('seo','Video SEO Generator','ভিডিও SEO','ট্যাগ ও ডেসক্রিপশন','🔍','video',2),
    t('subtitle','Video Subtitle Generator','সাবটাইটেল জেনারেটর','ভিডিও সাবটাইটেল','📝','video',3),
    t('thumbnail','YouTube Thumbnail Maker','থাম্বনেইল মেকার','YouTube থাম্বনেইল','🖼️','video',3),
    t('reel-idea','Reel/TikTok Idea','রিল আইডিয়া','শর্ট ভিডিও আইডিয়া','💡','video',1),
    t('voice-recorder','Voice Recorder','ভয়েস রেকর্ডার','অডিও রেকর্ড','⏺️','audio',0),
    t('audio-visualizer','Audio Visualizer','অডিও ভিজুয়ালাইজার','শব্দ দেখুন','🎵','audio',0),
    t('extract-audio','Video to Audio Extract','অডিও এক্সট্র্যাক্ট','ভিডিও থেকে অডিও','🎵','video',0),
    t('compress','Video Compress','ভিডিও কম্প্রেস','সাইজ কমান','📦','video',0),
    t('podcast-script','Podcast Script','পডকাস্ট স্ক্রিপ্ট','পডকাস্ট লিখুন','🎙️','social',3),
    t('content-calendar','Content Calendar','কন্টেন্ট ক্যালেন্ডার','৩০ দিনের প্ল্যান','📅','social',3),
  ]},

  // 6. 🛠️ ইউটিলিটি টুলস (সব misc, bangladesh, finance, health, fun, design, document, ecommerce)
  { id:'utility', name:'Utility Tools', nameBn:'🛠️ ইউটিলিটি টুলস', icon:<SmartIcon emoji="🛠️" cat="utility" />, color:'#8b5cf6', tools:[
    // Bangladesh Section
    t('prayer-time','Prayer Time','নামাজের সময়','নামাজের সময়সূচী','🕌','bangladesh',0),
    t('banglish-to-bangla','Banglish to Bangla','বাংলিশ টু বাংলা','বাংলিশ রূপান্তর','🔤','bangladesh',1),
    t('bd-news','BD News','বাংলাদেশ নিউজ','সর্বশেষ সংবাদ','📰','bangladesh',0),
    t('bus-route','Bus Route','বাস রুট','ঢাকা বাস রুট','🚌','bangladesh',0),
    t('post-code','Post Code Finder','পোস্ট কোড','পোস্ট কোড খুঁজুন','📮','bangladesh',0),
    t('dollar-gold-rate','Dollar/Gold Rate','ডলার/গোল্ড রেট','লাইভ দাম','💰','bangladesh',0),
    t('nid-helper','NID Helper','NID সহায়ক','NID দিয়ে সেবা গাইড','🪪','bangladesh',0),
    t('bill-calculator','Bill Calculator','বিল ক্যালকুলেটর','বিদ্যুৎ/পানি/গ্যাস','🧾','bangladesh',0),
    t('bangla-checker','Bangla Checker','শুদ্ধ বাংলা চেকার','বানান ঠিক করুন','✍️','bangladesh',0),
    t('bangla-meme','Bangla Meme','বাংলা মিম','বাংলা মিম তৈরি','🤣','bangladesh',0),
    t('bank-interest','Bank Interest','ব্যাংক সুদ','ব্যাংক সুদ হিসাব','🏦','bangladesh',0),
    
    // Namaz Section
    t('namaz-time','নামাজের সময়সূচি','নামাজের সময়সূচি','সকল জেলার সঠিক নামাজের সময়','🕐','namaz',0),
    t('namaz-qibla','কিবলা দিকনির্দেশনা','কিবলা','কিবলার সঠিক দিক','🧭','namaz',0),
    t('namaz-dua','নামাজের দোয়া','দোয়া ও তাসবীহ','বাংলা অর্থসহ সকল দোয়া','📖','namaz',0),
    t('namaz-guide','নামাজ শিক্ষা','নামাজ গাইড','সহীহ নামাজ পড়ার গাইড','📚','namaz',0),
    t('namaz-tasbih','ডিজিটাল তাসবীহ','তাসবীহ কাউন্টার','জিকির গণনার কাউন্টার','📿','namaz',0),
    
    // Finance Section
    t('currency-converter','Currency Converter','কারেন্সি কনভার্টার','মুদ্রা রূপান্তর','💱','finance',0),
    t('crypto-tracker','Crypto Tracker','ক্রিপ্টো ট্র্যাকার','ক্রিপ্টো দাম','₿','finance',0),
    t('emi-calculator','EMI Calculator','EMI ক্যালকুলেটর','লোন EMI','🏦','finance',0),
    t('tax-calculator','Tax Calculator','ট্যাক্স ক্যালকুলেটর','ট্যাক্স/VAT','📊','finance',0),
    t('gold-tracker','Gold Tracker','গোল্ড ট্র্যাকার','স্বর্ণের দাম','🥇','finance',0),
    t('budget-planner','Budget Planner','বাজেট প্ল্যানার','৫০/৩০/২০ বাজেট','📊','finance',0),
    t('sip-calculator','SIP Calculator','SIP ক্যালকুলেটর','বিনিয়োগ হিসাব','📈','finance',0),
    
    // Health & Fitness
    t('bmi-calculator','BMI Calculator','BMI ক্যালকুলেটর','BMI মাপুন','⚖️','health',0),
    t('calorie-counter','Calorie Counter','ক্যালরি কাউন্টার','ক্যালরি গণনা','🍎','health',0),
    t('workout-planner','Workout Planner','ওয়ার্কআউট প্ল্যানার','ব্যায়াম প্ল্যান','💪','health',2),
    t('water-tracker','Water Tracker','পানি ট্র্যাকার','পানি ট্র্যাক','💧','health',0),
    t('sleep-tracker','Sleep Tracker','স্লিপ ট্র্যাকার','ঘুম ট্র্যাক','😴','health',0),
    t('symptom-checker','Symptom Checker','সিম্পটম চেকার','উপসর্গ চেক','🩺','health',2),
    t('meditation-timer','Meditation Timer','মেডিটেশন টাইমার','ধ্যান টাইমার','🧘','health',0),
    
    // Games & Fun
    t('typing-test','Typing Test','টাইপিং টেস্ট','টাইপিং স্পিড','⌨️','fun',0),
    t('joke-generator','Joke Generator','জোক জেনারেটর','মজার জোক','😄','fun',2),
    t('decision-maker','Decision Maker','ডিসিশন মেকার','সিদ্ধান্ত নিন','🎯','fun',0),
    t('quote-generator','Quote Generator','উক্তি জেনারেটর','অনুপ্রেরণা','💬','fun',0),
    t('word-game','Bangla Word Game','বাংলা শব্দ খেলা','শব্দ অনুমান','🎮','fun',0),
    t('trivia-quiz','Trivia Quiz','ট্রিভিয়া কুইজ','মজার ট্রিভিয়া','🧩','fun',2),
    t('personality-quiz','Personality Quiz','পার্সোনালিটি কুইজ','মজার কুইজ','🧠','fun',2),
    t('adventure-game','Adventure Game','অ্যাডভেঞ্চার গেম','AI RPG গেম','⚔️','fun',2),
    t('would-you-rather','Would You Rather','Would You Rather','মজার প্রশ্ন','🤔','fun',1),
    
    // Utilities & Tools
    t('qr-code','QR Code Generator','QR কোড','QR কোড তৈরি','📱','utility',0),
    t('password-generator','Password Generator','পাসওয়ার্ড','শক্তিশালী পাসওয়ার্ড','🔑','utility',0),
    t('json-formatter','JSON Formatter','JSON ফরম্যাটার','JSON সুন্দর করুন','📋','utility',0),
    t('unit-converter','Unit Converter','ইউনিট কনভার্টার','একক রূপান্তর','📐','utility',0),
    t('color-palette','Color Palette','কালার প্যালেট','রঙ তৈরি','🎨','utility',0),
    t('age-calculator','Age Calculator','বয়স ক্যালকুলেটর','বয়স হিসাব','🎂','utility',0),
    t('url-shortener','URL Shortener','URL শর্টনার','লিংক ছোট','🔗','utility',0),
    t('base64','Base64 Encoder','Base64 এনকোডার','এনকোড/ডিকোড','🔐','utility',0),
    t('markdown-editor','Markdown Editor','Markdown এডিটর','লাইভ প্রিভিউ','📝','utility',0),
    t('barcode-gen','Barcode Generator','বারকোড','বারকোড তৈরি','📊','utility',0),
    t('discount-calc','Discount Calculator','ডিসকাউন্ট','ডিসকাউন্ট/টিপ','🏷️','utility',0),
    t('markdown-preview','Markdown Preview','Markdown প্রিভিউ','লাইভ প্রিভিউ','📄','developer',0),
    
    // Design & Templates
    t('logo-maker','Logo Maker','লোগো মেকার','কাস্টম লোগো','⭐','design',0),
    t('thumbnail-maker','Thumbnail Maker','থাম্বনেইল মেকার','YouTube থাম্বনেইল','🖼️','design',0),
    t('certificate-gen','Certificate Generator','সার্টিফিকেট','সার্টিফিকেট তৈরি','📜','design',0),
    t('business-card','Business Card','বিজনেস কার্ড','কার্ড তৈরি','💳','design',0),
    t('poster-maker','Poster Maker','পোস্টার মেকার','পোস্টার/ব্যানার','🎨','design',0),
    t('birthday-card','Birthday Card','বার্থডে কার্ড','শুভেচ্ছা কার্ড','🎂','design',0),
    t('invoice-gen','Invoice Generator','ইনভয়েস','ইনভয়েস তৈরি','🧾','design',0),
    
    // Documents
    t('privacy-policy','Privacy Policy','প্রাইভেসি পলিসি','পলিসি তৈরি','🔒','document',2),
    t('terms-of-service','Terms of Service','টার্মস অফ সার্ভিস','TOS তৈরি','📃','document',2),
    t('nda-template','NDA Generator','NDA টেমপ্লেট','NDA তৈরি','🤝','document',2),
    t('meeting-minutes','Meeting Minutes','মিটিং মিনিটস','মিটিং নোটস','📋','document',2),
    
    // E-Commerce
    t('review-response','Review Response','রিভিউ রেসপন্স','রিভিউ উত্তর','⭐','ecommerce',2),
    t('shipping-calc','Shipping Calculator','শিপিং ক্যালকুলেটর','শিপিং খরচ','📦','ecommerce',0),
    t('price-tag','Price Tag Maker','প্রাইস ট্যাগ','দামের ট্যাগ','🏷️','ecommerce',0),
    t('stock-photos','Stock Photos','স্টক ফটো','ফ্রি ছবি খুঁজুন','📷','ecommerce',0),
  ]},
];

export function getAllTools(): ToolInfo[] { return CATEGORIES.flatMap(c => c.tools); }
export function getToolById(id: string): ToolInfo | undefined { return getAllTools().find(t => t.id === id); }
export function getCategoryById(id: string): CategoryInfo | undefined { return CATEGORIES.find(c => c.id === id); }
export function getTotalToolCount(): number { return getAllTools().length; }
