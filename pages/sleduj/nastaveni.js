// sleduj/nastaveni.js

import { useState } from "react";
import { useRouter } from "next/router";

export default function NastaveniSleduj() {
  const router = useRouter();
  const [pocetMicku, setPocetMicku] = useState(3);
  const [rychlost, setRychlost] = useState(5);

  const startHra = () => {
    router.push({
      pathname: "/sleduj/hra",
      query: { pocetMicku, rychlost },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black gap-4">
      <h1 className="text-2xl font-bold">Nastavení módu Sleduj</h1>

      <div className="flex flex-col items-center">
        <label>Počet míčků:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={pocetMicku}
          onChange={(e) => setPocetMicku(Number(e.target.value))}
          className="border p-2 rounded w-24 text-center"
        />
      </div>

      <div className="flex flex-col items-center">
        <label>Rychlost (1 pomalá – 10 rychlá):</label>
        <input
          type="number"
          min="1"
          max="10"
          value={rychlost}
          onChange={(e) => setRychlost(Number(e.target.value))}
          className="border p-2 rounded w-24 text-center"
        />
      </div>

      <button
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        onClick={startHra}
      >
        Start
      </button>
    </div>
  );
}
