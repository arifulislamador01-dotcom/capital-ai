'use client';
import { useState } from 'react';

const NID_SERVICES = [
  {
    title: '🏠 জমি সংক্রান্ত', services: [
      { name: 'জমি রেজিস্ট্রেশন', office: 'সাব-রেজিস্ট্রি অফিস', docs: ['NID মূলকপি', 'জমির দলিল', 'খাজনার রসিদ', 'পাসপোর্ট সাইজ ছবি ২ কপি', 'মিউটেশন খতিয়ান'] },
      { name: 'নামজারি/মিউটেশন', office: 'এসি ল্যান্ড অফিস', docs: ['NID কপি', 'দলিলের সত্যায়িত কপি', 'খাজনার রসিদ', 'ওয়ারিশ সনদ (প্রযোজ্য ক্ষেত্রে)'] },
      { name: 'খতিয়ান বের করা', office: 'ভূমি অফিস', docs: ['NID কপি', 'আবেদন ফরম', 'ফি ৳১০০'] },
    ]
  },
  {
    title: '🏦 ব্যাংকিং', services: [
      { name: 'ব্যাংক অ্যাকাউন্ট খোলা', office: 'যেকোনো ব্যাংক শাখা', docs: ['NID মূলকপি + ফটোকপি', 'পাসপোর্ট সাইজ ছবি ২ কপি', 'নমিনির NID ও ছবি', 'ন্যূনতম জমা ৳৫০০-১০,০০০'] },
      { name: 'মোবাইল ব্যাংকিং (bKash/Nagad)', office: 'নিকটস্থ এজেন্ট', docs: ['NID মূলকপি', 'সচল মোবাইল নম্বর', 'বায়োমেট্রিক ভেরিফিকেশন'] },
      { name: 'লোন আবেদন', office: 'ব্যাংক শাখা', docs: ['NID কপি', 'আয়ের প্রমাণপত্র', 'জমির দলিল/গ্যারান্টর', 'ট্রেড লাইসেন্স (ব্যবসায়ী)'] },
    ]
  },
  {
    title: '📄 সরকারি সেবা', services: [
      { name: 'পাসপোর্ট আবেদন', office: 'পাসপোর্ট অফিস / ইমিগ্রেশন', docs: ['NID মূলকপি', 'জন্ম নিবন্ধন', 'অনলাইন ফরম প্রিন্ট', 'ছবি (৩.৫x৪.৫ সেমি)', 'ফি ৳৩,৪৫০-৬,৯০০'] },
      { name: 'ড্রাইভিং লাইসেন্স', office: 'BRTA অফিস', docs: ['NID কপি', 'মেডিকেল সার্টিফিকেট', 'রক্তের গ্রুপ সনদ', 'শিক্ষাগত যোগ্যতা', 'ছবি ৪ কপি'] },
      { name: 'TIN সার্টিফিকেট', office: 'কর অফিস / অনলাইন', docs: ['NID নম্বর', 'মোবাইল নম্বর', 'ঠিকানা প্রমাণ'] },
      { name: 'ট্রেড লাইসেন্স', office: 'সিটি কর্পোরেশন/পৌরসভা', docs: ['NID কপি', 'দোকান/অফিস ভাড়ার চুক্তি', 'ছবি ২ কপি', 'ফি ৳৫০০-৫,০০০'] },
    ]
  },
  {
    title: '👨‍👩‍👧 পারিবারিক', services: [
      { name: 'বিবাহ নিবন্ধন', office: 'কাজী অফিস', docs: ['বর-কনে উভয়ের NID', 'জন্ম নিবন্ধন', 'ছবি (বর-কনে)', 'সাক্ষী ২ জনের NID', 'কাবিননামা ফরম'] },
      { name: 'সন্তানের জন্ম নিবন্ধন', office: 'ইউনিয়ন পরিষদ/সিটি কর্পোরেশন', docs: ['বাবা-মায়ের NID', 'হাসপাতাল সার্টিফিকেট', 'বিবাহ সনদ'] },
      { name: 'ওয়ারিশ সনদ', office: 'ইউনিয়ন পরিষদ', docs: ['মৃত ব্যক্তির NID/মৃত্যু সনদ', 'আবেদনকারীর NID', 'সাক্ষী ২ জনের NID'] },
    ]
  },
  {
    title: '📱 সিম ও ডিজিটাল', services: [
      { name: 'নতুন সিম কেনা', office: 'মোবাইল অপারেটর শপ', docs: ['NID মূলকপি', 'বায়োমেট্রিক ফিঙ্গারপ্রিন্ট', 'সর্বোচ্চ ১৫টি সিম'] },
      { name: 'ই-পাসপোর্ট', office: 'আঞ্চলিক পাসপোর্ট অফিস', docs: ['NID', 'জন্ম সনদ', 'অনলাইন আবেদন', 'বায়োমেট্রিক'] },
    ]
  },
];

export default function NIDHelperPage() {
  const [nid, setNid] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [openSection, setOpenSection] = useState<number | null>(null);

  const validateNID = () => {
    const clean = nid.replace(/\s/g, '');
    if (clean.length === 10 || clean.length === 13 || clean.length === 17) {
      if (/^\d+$/.test(clean)) { setValidated(true); setError(''); return; }
    }
    setError('❌ সঠিক NID নম্বর দিন (১০, ১৩, বা ১৭ ডিজিট)');
    setValidated(false);
  };

  const printGuide = () => { window.print(); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">🪪</span><h1 className="text-2xl font-bold font-display">NID দিয়ে কী কী করা যায়</h1></div>
        <p className="text-gray-400 font-bengali text-sm">জাতীয় পরিচয়পত্র দিয়ে সরকারি সেবার সম্পূর্ণ গাইড</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span>
      </div>

      {/* NID Input */}
      <div className="glass-card p-6 space-y-4">
        <label className="text-sm text-gray-300 font-bengali">আপনার NID নম্বর (শুধু ফরম্যাট চেক হবে, সংরক্ষণ হবে না)</label>
        <div className="flex gap-3">
          <input value={nid} onChange={e => setNid(e.target.value)} placeholder="১০/১৩/১৭ ডিজিট NID নম্বর" className="input-field flex-1 text-lg tracking-wider" maxLength={17} />
          <button onClick={validateNID} className="btn-glow !px-6">চেক করো</button>
        </div>
        {error && <p className="text-red-400 text-sm font-bengali">{error}</p>}
        {validated && <div className="flex items-center gap-2 text-green-400 text-sm font-bengali"><span>✅</span> NID ফরম্যাট সঠিক — {nid.replace(/\s/g, '').length} ডিজিট ({nid.replace(/\s/g, '').length === 10 ? 'পুরনো' : nid.replace(/\s/g, '').length === 13 ? 'নতুন (স্মার্ট)' : '১৭ ডিজিট'} NID)</div>}
      </div>

      {/* Services Accordion */}
      {validated && (
        <div className="space-y-3 print:space-y-4" id="nid-guide">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-bengali">📋 NID দিয়ে যেসব কাজ করতে পারবেন</h2>
            <button onClick={printGuide} className="btn-outline !py-1.5 !px-3 text-xs print:hidden">🖨️ প্রিন্ট</button>
          </div>

          {NID_SERVICES.map((section, si) => (
            <div key={si} className="glass-card overflow-hidden">
              <button onClick={() => setOpenSection(openSection === si ? null : si)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors">
                <span className="font-semibold text-white font-bengali">{section.title}</span>
                <span className={`text-gray-400 transition-transform ${openSection === si ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {openSection === si && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                  {section.services.map((svc, svi) => (
                    <div key={svi} className="bg-white/[0.02] rounded-xl p-4">
                      <h4 className="font-semibold text-primary-400 font-bengali text-sm">{svc.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 font-bengali">📍 কোথায়: <span className="text-gray-300">{svc.office}</span></p>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 font-bengali mb-1.5">📄 প্রয়োজনীয় কাগজপত্র:</p>
                        <ul className="space-y-1">{svc.docs.map((d, di) => (
                          <li key={di} className="flex items-start gap-2 text-xs text-gray-300 font-bengali">
                            <input type="checkbox" className="mt-0.5 accent-primary-500" /><span>{d}</span>
                          </li>
                        ))}</ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
