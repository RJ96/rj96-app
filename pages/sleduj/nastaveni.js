import React, { useState } from "react";
import { useRouter } from "next/router";

const Nastaveni = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    totalBalls: 5,
    markedCount: 2,
    speed: 3,
    duration: 10,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const startGame = () => {
    localStorage.setItem("sledujSettings", JSON.stringify(settings));
    router.push("/sleduj/hra");
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>Sleduj – Nastavení</h1>

      <label>
        Počet míčků:
        <input
          type="number"
          min={1}
          max={10}
          value={settings.totalBalls}
          onChange={(e) => handleChange("totalBalls", Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10))}
          style={{ marginLeft: 10, width: 60 }}
        />
      </label>
      <br /><br />

      <label>
        Označené míčky:
        <input
          type="number"
          min={1}
          max={10}
          value={settings.markedCount}
          onChange={(e) => handleChange("markedCount", Math.min(Math.max(parseInt(e.target.value) || 1, 1), settings.totalBalls))}
          style={{ marginLeft: 10, width: 60 }}
        />
      </label>
      <br /><br />

      <label>
        Rychlost (1–10):
        <input
          type="number"
          min={1}
          max={10}
          value={settings.speed}
          onChange={(e) => handleChange("speed", Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10))}
          style={{ marginLeft: 10, width: 60 }}
        />
      </label>
      <br /><br />

      <label>
        Délka hry (v sekundách):
        <input
          type="number"
          min={1}
          max={60}
          value={settings.duration}
          onChange={(e) => handleChange("duration", Math.min(Math.max(parseInt(e.target.value) || 1, 1), 60))}
          style={{ marginLeft: 10, width: 60 }}
        />
      </label>
      <br /><br />

      <button onClick={startGame} style={{ padding: "8px 16px", fontSize: 16 }}>
        Start
      </button>
    </div>
  );
};

export default Nastaveni;
