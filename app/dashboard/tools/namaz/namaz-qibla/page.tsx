"use client";
import { useState, useEffect } from "react";

export default function QiblaPage() {
  const [qibla, setQibla] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  function getQibla() {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const makkahLat = 21.4225;
        const makkahLon = 39.8262;
        const dLon = ((makkahLon - lon) * Math.PI) / 180;
        const lat1 = (lat * Math.PI) / 180;
        const lat2 = (makkahLat * Math.PI) / 180;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        let bearing = (Math.atan2(y, x) * 180) / Math.PI;
        bearing = (bearing + 360) % 360;
        setQibla(Math.round(bearing));
        setLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setLoading(false);
      },
      () => { setLoading(false); alert("Location access denied!"); }
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="text-4xl mb-3">🧭</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">কিবলা দিকনির্দেশনা</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">আপনার অবস্থান থেকে মক্কার দিক</p>

        {qibla !== null ? (
          <div className="mb-6">
            <div className="relative w-48 h-48 mx-auto mb-4">
              <div className="w-48 h-48 rounded-full border-4 border-green-200 dark:border-green-800 flex items-center justify-center bg-green-50 dark:bg-gray-700">
                <div
                  className="text-4xl transition-transform duration-500"
                  style={{ transform: `rotate(${qibla}deg)` }}
                >
                  🕋
                </div>
              </div>
            </div>
            <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">{qibla}°</div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">উত্তর থেকে ঘড়ির কাঁটার দিকে</p>
            <p className="text-gray-400 text-xs mt-1">📍 {location}</p>
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto mb-6 rounded-full border-4 border-gray-200 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-700">
            <span className="text-6xl opacity-30">🕋</span>
          </div>
        )}

        <button
          onClick={getQibla}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {loading ? "খুঁজছি..." : "কিবলা খুঁজুন"}
        </button>
      </div>
    </div>
  );
}
