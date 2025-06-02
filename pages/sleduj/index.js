import { useRouter } from "next/router";
import React, { useState } from "react";

const SledujSettings = () => {
  const router = useRouter();

  // Nastavení hry
  const [totalBalls, setTotalBalls] = useState(5);
  const [markedCount, setMarkedCount] = useState(2);
  const [speed, setSpeed] = useState(3);
  const [duration, setDuration] = useState(10);

  const startGame = () => {
    // Navigace do hry s parametry v query stringu
    router.push({
      pathname: "/sleduj/hra",
      query: { totalBalls, markedCount, speed, duration },
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url("/goalie.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textShadow: "0 0 5px black",
      }}
    >
      <h1>Sleduj – Nastavení</h1>

      <label>
        Počet míčků: {totalBalls}
        <input
          type="range"
          min={3}
          max={10}
          value={totalBalls}
          onChange={(e) => {
            const val = Number(e.target.value);
            setTotalBalls(val);
            if (markedCount > val) setMarkedCount(val);
          }}
        />
      </label>

      <label>
        Počet označených míčků: {markedCount}
        <input
          type="range"
          min={1}
          max={totalBalls}
          value={markedCount}
          onChange={(e) => setMarkedCount(Number(e.target.value))}
        />
      </label>

      <label>
        Rychlost míčků: {speed}
        <input
          type="range"
          min={1}
          max={10}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>

      <label>
        Délka hry (s): {duration}
        <input
          type="range"
          min={5}
          max={60}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </label>

      <button
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 18,
          cursor: "pointer",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#4CAF50",
          color: "white",
        }}
        onClick={startGame}
      >
        Start
      </button>
    </div>
  );
};

export default SledujSettings;
