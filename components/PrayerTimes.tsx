"use client";
import { useState, useEffect } from "react";

const divisions: Record<string, Record<string, { lat: number; lon: number }>> = {
  "ঢাকা": {
    "ঢাকা": { lat: 23.8103, lon: 90.4125 },
    "গাজীপুর": { lat: 23.9999, lon: 90.4203 },
    "নারায়ণগঞ্জ": { lat: 23.6238, lon: 90.4996 },
    "মানিকগঞ্জ": { lat: 23.8634, lon: 89.9987 },
    "মুন্সীগঞ্জ": { lat: 23.5422, lon: 90.5296 },
    "নরসিংদী": { lat: 23.9323, lon: 90.7153 },
    "ফরিদপুর": { lat: 23.6070, lon: 89.8429 },
    "গোপালগঞ্জ": { lat: 23.0051, lon: 89.8266 },
    "মাদারীপুর": { lat: 23.1641, lon: 90.1988 },
    "রাজবাড়ী": { lat: 23.7574, lon: 89.6444 },
    "শরীয়তপুর": { lat: 23.2180, lon: 90.4350 },
    "কিশোরগঞ্জ": { lat: 24.4449, lon: 90.7762 },
    "টাঙ্গাইল": { lat: 24.2513, lon: 89.9165 },
  },
  "চট্টগ্রাম": {
    "চট্টগ্রাম": { lat: 22.3569, lon: 91.7832 },
    "কক্সবাজার": { lat: 21.4272, lon: 92.0058 },
    "রাঙামাটি": { lat: 22.6552, lon: 92.1813 },
    "বান্দরবান": { lat: 22.1953, lon: 92.2183 },
    "খাগড়াছড়ি": { lat: 23.1193, lon: 91.9847 },
    "ফেনী": { lat: 23.0159, lon: 91.3976 },
    "নোয়াখালী": { lat: 22.8696, lon: 91.0996 },
    "লক্ষ্মীপুর": { lat: 22.9424, lon: 90.8413 },
    "কুমিল্লা": { lat: 23.4607, lon: 91.1809 },
    "চাঁদপুর": { lat: 23.2513, lon: 90.8518 },
    "ব্রাহ্মণবাড়িয়া": { lat: 23.9608, lon: 91.1115 },
  },
  "রাজশাহী": {
    "রাজশাহী": { lat: 24.3745, lon: 88.6042 },
    "নাটোর": { lat: 24.4103, lon: 89.0000 },
    "নওগাঁ": { lat: 24.8031, lon: 88.9312 },
    "চাঁপাইনবাবগঞ্জ": { lat: 24.5966, lon: 88.2746 },
    "পাবনা": { lat: 24.0064, lon: 89.2372 },
    "সিরাজগঞ্জ": { lat: 24.4533, lon: 89.7006 },
    "বগুড়া": { lat: 24.8510, lon: 89.3719 },
    "জয়পুরহাট": { lat: 25.0989, lon: 89.0258 },
  },
  "খুলনা": {
    "খুলনা": { lat: 22.8456, lon: 89.5403 },
    "বাগেরহাট": { lat: 22.6602, lon: 89.7854 },
    "সাতক্ষীরা": { lat: 22.7185, lon: 89.0705 },
    "যশোর": { lat: 23.1664, lon: 89.2080 },
    "ঝিনাইদহ": { lat: 23.5432, lon: 89.1719 },
    "মাগুরা": { lat: 23.4872, lon: 89.4204 },
    "নড়াইল": { lat: 23.1724, lon: 89.5122 },
    "কুষ্টিয়া": { lat: 23.9014, lon: 89.1203 },
    "চুয়াডাঙ্গা": { lat: 23.6401, lon: 88.8418 },
    "মেহেরপুর": { lat: 23.7624, lon: 88.6318 },
  },
  "সিলেট": {
    "সিলেট": { lat: 24.8949, lon: 91.8687 },
    "মৌলভীবাজার": { lat: 24.4829, lon: 91.7774 },
    "হবিগঞ্জ": { lat: 24.3745, lon: 91.4157 },
    "সুনামগঞ্জ": { lat: 25.0658, lon: 91.3950 },
  },
  "বরিশাল": {
    "বরিশাল": { lat: 22.7010, lon: 90.3535 },
    "ভোলা": { lat: 22.6857, lon: 90.6482 },
    "পটুয়াখালী": { lat: 22.3596, lon: 90.3296 },
    "পিরোজপুর": { lat: 22.5841, lon: 89.9648 },
    "ঝালকাঠি": { lat: 22.6402, lon: 90.1983 },
    "বরগুনা": { lat: 22.1500, lon: 90.1200 },
  },
  "রংপুর": {
    "রংপুর": { lat: 25.7439, lon: 89.2752 },
    "দিনাজপুর": { lat: 25.6217, lon: 88.6354 },
    "গাইবান্ধা": { lat: 25.3288, lon: 89.5283 },
    "কুড়িগ্রাম": { lat: 25.8034, lon: 89.6361 },
    "লালমনিরহাট": { lat: 25.9923, lon: 89.2846 },
    "নীলফামারী": { lat: 25.9310, lon: 88.8562 },
    "পঞ্চগড়": { lat: 26.3408, lon: 88.5553 },
    "ঠাকুরগাঁও": { lat: 26.0336, lon: 88.4616 },
  },
  "ময়মনসিংহ": {
    "ময়মনসিংহ": { lat: 24.7471, lon: 90.4203 },
    "জামালপুর": { lat: 24.9037, lon: 89.9378 },
    "নেত্রকোণা": { lat: 24.8731, lon: 90.7270 },
    "শেরপুর": { lat: 25.0198, lon: 90.0149 },
  },
};

const prayerNames = ["ফজর", "সূর্যোদয়", "যোহর", "আসর", "মাগরিব", "এশা"];
const ishrakOffset = 15;

function to12Hour(time: string) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function addMinutes(time: string, mins: number) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export default function PrayerTimes() {
  const [division, setDivision] = useState("ঢাকা");
  const [district, setDistrict] = useState("ঢাকা");
  const [times, setTimes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const districts = divisions[division] || {};

  useEffect(() => {
    const today = new Date();
    setDate(today.toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  useEffect(() => {
    if (division && district && divisions[division]?.[district]) {
      fetchPrayerTimes();
    }
  }, [division, district]);

  async function fetchPrayerTimes() {
    setLoading(true);
    const { lat, lon } = divisions[division][district];
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=1&school=1`
      );
      const data = await res.json();
      if (data.code === 200) {
        setTimes(data.data.timings);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const prayerList = [
    { name: "ফজর", time: times.Fajr, icon: "🌙" },
    { name: "ইশরাক", time: addMinutes(times.Sunrise, ishrakOffset), icon: "🌅" },
    { name: "যোহর", time: times.Dhuhr, icon: "☀️" },
    { name: "আসর", time: times.Asr, icon: "🌤️" },
    { name: "মাগরিব", time: times.Maghrib, icon: "🌇" },
    { name: "এশা", time: times.Isha, icon: "🌃" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🕌</span>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">নামাজের সময়সূচি</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{date} • ইসলামিক ফাউন্ডেশন বাংলাদেশ</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={division}
          onChange={(e) => { setDivision(e.target.value); setDistrict(Object.keys(divisions[e.target.value])[0]); }}
          className="flex-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200"
        >
          {Object.keys(divisions).map((d) => <option key={d}>{d}</option>)}
        </select>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="flex-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200"
        >
          {Object.keys(districts).map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-400">লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {prayerList.map((p) => (
            <div key={p.name} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-750 rounded-xl p-3 text-center border border-green-100 dark:border-gray-600">
              <div className="text-xl mb-1">{p.icon}</div>
              <div className="text-xs font-semibold text-green-700 dark:text-green-400">{p.name}</div>
              <div className="text-base font-bold text-gray-800 dark:text-white mt-1">{to12Hour(p.time)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
