'use client';
import { useState } from 'react';

export default function QRCodePage() {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  const generate = () => {
    if (!text.trim()) return;
    // Using QR Server API (free, no key needed)
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}&bgcolor=0a0a0a&color=818cf8`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📱</span>
          <h1 className="text-2xl font-bold font-display">QR Code Generator</h1>
        </div>
        <p className="text-gray-400 font-bengali">যেকোনো টেক্সট বা URL থেকে QR Code তৈরি করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span>
      </div>

      <div className="glass-card p-6 space-y-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="URL বা টেক্সট লিখুন..." className="input-field" />
        <button onClick={generate} disabled={!text.trim()} className="btn-glow disabled:opacity-50">📱 QR Code তৈরি করো</button>
      </div>

      {qrUrl && (
        <div className="glass-card p-6 text-center space-y-4">
          <img src={qrUrl} alt="QR Code" className="mx-auto rounded-xl border border-white/10" />
          <a href={qrUrl} download="qr-code.png" className="btn-glow !py-2 !px-5 text-sm inline-block">📥 ডাউনলোড</a>
        </div>
      )}
    </div>
  );
}
