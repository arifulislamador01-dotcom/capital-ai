"use client";
import { useState } from "react";

const steps = [
  { title: "নিয়ত করা", desc: "মনে মনে কোন নামাজ পড়ছেন তার নিয়ত করুন। মুখে বলা জরুরি নয়।", icon: "🤲" },
  { title: "তাকবীরে তাহরীমা", desc: "উভয় হাত কান বরাবর উঠিয়ে 'আল্লাহু আকবার' বলুন।", icon: "🙌" },
  { title: "হাত বাঁধা ও সানা পড়া", desc: "বাম হাতের উপর ডান হাত রাখুন। সানা পড়ুন।", icon: "🤝" },
  { title: "সূরা ফাতিহা পড়া", desc: "'আউযুবিল্লাহ' ও 'বিসমিল্লাহ' পড়ে সূরা ফাতিহা পড়ুন।", icon: "📖" },
  { title: "অন্য সূরা পড়া", desc: "ফাতিহার পর যেকোনো সূরা বা আয়াত পড়ুন।", icon: "📜" },
  { title: "রুকু করা", desc: "'আল্লাহু আকবার' বলে রুকুতে যান। তিনবার 'সুবহানা রাব্বিয়াল আযীম' পড়ুন।", icon: "🫅" },
  { title: "রুকু থেকে উঠা", desc: "'সামিআল্লাহু লিমান হামিদাহ' বলে সোজা হয়ে দাঁড়ান।", icon: "🧍" },
  { title: "সিজদা করা", desc: "'আল্লাহু আকবার' বলে সিজদায় যান। তিনবার 'সুবহানা রাব্বিয়াল আলা' পড়ুন।", icon: "🙇" },
  { title: "দুই সিজদার মাঝে বসা", desc: "'আল্লাহু আকবার' বলে বসুন। 'রাব্বিগফিরলী' পড়ুন।", icon: "🧎" },
  { title: "দ্বিতীয় সিজদা", desc: "আবার 'আল্লাহু আকবার' বলে সিজদায় যান।", icon: "🙇" },
  { title: "তাশাহহুদ পড়া", desc: "দুই রাকাত পর বসে তাশাহহুদ ও দরুদ পড়ুন।", icon: "🤲" },
  { title: "সালাম ফেরানো", desc: "ডানে ও বামে 'আস্সালামু আলাইকুম ওয়া রাহমাতুল্লাহ' বলুন।", icon: "🫶" },
];

export default function NamazGuidePage() {
  const [active, setActive] = useState(0);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📚</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">নামাজ শিক্ষা</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">সহীহভাবে নামাজ পড়ার গাইড</p>
      </div>

      <div className="flex gap-4">
        <div className="w-48 flex-shrink-0 space-y-1">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${active === i ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50"}`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 text-center">
          <div className="text-6xl mb-4">{steps[active].icon}</div>
          <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-2">ধাপ {active + 1}/{steps.length}</div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{steps[active].title}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{steps[active].desc}</p>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30"
            >← আগের</button>
            <button
              onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
              disabled={active === steps.length - 1}
              className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-30"
            >পরের →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
