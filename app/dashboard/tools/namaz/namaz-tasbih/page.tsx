"use client";
import { useState } from "react";

const tasbihList = [
  { name: "সুবহানাল্লাহ", arabic: "سُبْحَانَ اللَّهِ", target: 33 },
  { name: "আলহামদুলিল্লাহ", arabic: "الْحَمْدُ لِلَّهِ", target: 33 },
  { name: "আল্লাহু আকবার", arabic: "اللَّهُ أَكْبَرُ", target: 34 },
  { name: "লা ইলাহা ইল্লাল্লাহ", arabic: "لَا إِلَهَ إِلَّا اللَّهُ", target: 100 },
  { name: "আস্তাগফিরুল্লাহ", arabic: "أَسْتَغْفِرُ اللَّهَ", target: 100 },
  { name: "সুবহানাল্লাহি ওয়া বিহামদিহ", arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", target: 100 },
];

export default function TasbihPage() {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);

  const current = tasbihList[selected];
  const progress = Math.min((count / current.target) * 100, 100);

  function handleCount() {
    setCount(c => c + 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📿</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ডিজিটাল তাসবীহ</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">জিকির ও তাসবীহ গণনা</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {tasbihList.map((t, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setCount(0); }}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selected === i ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center mb-4">
        <p className="text-3xl text-gray-800 dark:text-white mb-1">{current.arabic}</p>
        <p className="text-green-600 dark:text-green-400 font-medium mb-4">{current.name}</p>

        <div className="text-8xl font-bold text-gray-800 dark:text-white mb-2">{count}</div>
        <p className="text-gray-400 text-sm mb-4">লক্ষ্য: {current.target}</p>

        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-6">
          <div
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {count >= current.target && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl p-3 mb-4 font-medium">
            🎉 আলহামদুলিল্লাহ! লক্ষ্য পূরণ হয়েছে!
          </div>
        )}

        <button
          onClick={handleCount}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xl font-bold py-6 rounded-2xl transition-all mb-3 select-none"
        >
          ✋ গণনা করুন
        </button>

        <button
          onClick={reset}
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl text-sm"
        >
          রিসেট করুন
        </button>
      </div>
    </div>
  );
}
