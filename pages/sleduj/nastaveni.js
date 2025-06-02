import React from "react";

const SledujNastaveni = ({ settings, onChange, onStart }) => (
  <div style={{ textAlign: "center" }}>
    <h1>Sleduj – Nastavení</h1>
    <label>
      Počet míčků:{" "}
      <input
        type="number"
        value={settings.totalBalls}
        onChange={(e) => onChange({ ...settings, totalBalls: parseInt(e.target.value) })}
        min={1}
        max={10}
      />
    </label>{" "}
    <label>
      Označené míčky:{" "}
      <input
        type="number"
        value={settings.markedCount}
        onChange={(e) => onChange({ ...settings, markedCount: parseInt(e.target.value) })}
        min={1}
        max={5}
      />
    </label>{" "}
    <label>
      Rychlost (1–10):{" "}
      <input
        type="number"
        value={settings.speed}
        onChange={(e) => onChange({ ...settings, speed: parseInt(e.target.value) })}
        min={1}
        max={10}
      />
    </label>{" "}
    <label>
      Délka hry (s):{" "}
      <input
        type="number"
        value={settings.duration}
        onChange={(e) => onChange({ ...settings, duration: parseInt(e.target.value) })}
        min={1}
        max={60}
      />
    </label>{" "}
    <button onClick={onStart}>Start</button>
  </div>
);

export default SledujNastaveni;
