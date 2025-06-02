import React from "react";

const SledujNastaveni = ({ settings, onChange, onStart }) => {
  // Zajistíme, aby markedCount nebyl větší než totalBalls
  const handleMarkedCountChange = (value) => {
    let val = parseInt(value);
    if (val > settings.totalBalls) val = settings.totalBalls;
    if (val < 1) val = 1;
    onChange({ ...settings, markedCount: val });
  };

  const handleTotalBallsChange = (value) => {
    let val = parseInt(value);
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    // Pokud změníme totalBalls, zkontrolujeme markedCount
    const markedCount = settings.markedCount > val ? val : settings.markedCount;
    onChange({ ...settings, totalBalls: val, markedCount });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sleduj – Nastavení</h1>
      <label>
        Počet míčků:{" "}
        <input
          type="number"
          value={settings.totalBalls}
          onChange={(e) => handleTotalBallsChange(e.target.value)}
          min={1}
          max={10}
        />
      </label>{" "}
      <label>
        Označené míčky:{" "}
        <input
          type="number"
          value={settings.markedCount}
          onChange={(e) => handleMarkedCountChange(e.target.value)}
          min={1}
          max={5}
        />
      </label>{" "}
      <label>
        Rychlost (1–10):{" "}
        <input
          type="number"
          value={settings.speed}
          onChange={(e) =>
            onChange({ ...settings, speed: Math.min(Math.max(parseInt(e.target.value), 1), 10) })
          }
          min={1}
          max={10}
        />
      </label>{" "}
      <label>
        Délka hry (s):{" "}
        <input
          type="number"
          value={settings.duration}
          onChange={(e) =>
            onChange({ ...settings, duration: Math.min(Math.max(parseInt(e.target.value), 1), 60) })
          }
          min={1}
          max={60}
        />
      </label>{" "}
      <button onClick={onStart}>Start</button>
    </div>
  );
};

export default SledujNastaveni;
