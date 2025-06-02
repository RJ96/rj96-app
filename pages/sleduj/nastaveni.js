// pages/sleduj/nastaveni.js
import { useRouter } from "next/router";
import { useState } from "react";

export default function SledujNastaveni() {
  const router = useRouter();
  const [pocetMicek, setPocetMicek] = useState(3);
  const [rychlost, setRychlost] = useState(5);

  const startHra = () => {
    router.push({
      pathname: "/sleduj/hra",
      query: { pocetMicek, rychlost },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">Nastavení hry</h1>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">Počet míčků:</label>
        <div className="flex items-center justify-center space-x-4">
          <button onClick={() => setPocetMicek(Math.max(1, pocetMicek - 1))} className="px-4 py-2 bg-red-500 text-white rounded">-</button>
          <span className="text-xl font-bold">{pocetMicek}</span>
          <button onClick={() => setPocetMicek(Math.min(10, pocetMicek + 1))} className="px-4 py-2 bg-green-500 text-white rounded">+</button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium mb-1">Rychlost (1–10):</label>
        <div className="flex items-center justify-center space-x-4">
          <button onClick={() => setRychlost(Math.max(1, rychlost - 1))} className="px-4 py-2 bg-red-500 text-white rounded">-</button>
          <span className="text-xl font-bold">{rychlost}</span>
          <button onClick={() => setRychlost(Math.min(10, rychlost + 1))} className="px-4 py-2 bg-green-500 text-white rounded">+</button>
        </div>
      </div>

      <button onClick={startHra} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded text-xl shadow">Start</button>
    </div>
  );
}
