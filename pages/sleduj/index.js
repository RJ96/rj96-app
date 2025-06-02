// pages/sleduj/index.js
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const SledujSettings = () => {
  const router = useRouter();

  const MIN_BALLS = 3;
  const MAX_BALLS = 10;
  const MIN_MARKED = 1;
  const MIN_SPEED = 1;
  const MAX_SPEED = 10;
  const MIN_DURATION = 5;
  const MAX_DURATION = 60;

  // Výchozí hodnoty
  const [totalBalls, setTotalBalls] = useState(5);
  const [markedCount, setMarkedCount] = useState(2);
  const [speed, setSpeed] = useState(3);
  const [duration, setDuration] = useState(10);

  // Pokud se totalBalls sníží pod markedCount, automaticky uprav markedCount
  useEffect(() => {
    if (markedCount > totalBalls) {
      setMarkedCount(totalBalls);
    }
  }, [totalBalls, markedCount]);

  const startGame = () => {
    router.push({
      pathname: "/sleduj/hra",
      query: {
        totalBalls: totalBalls,
        markedCount: markedCount,
        speed: speed,
        duration: duration,
      },
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
        padding: 20,
        gap: 20,
      }}
    >
      <h1>Sleduj – Nastavení</h1>

      <label style={{ width: "300px" }}>
        Počet míčků: {totalBalls}
        <input
          type="range"
          min={MIN_BALLS}
          max={MAX_BALLS}
          value={totalBalls}
          onChange={(e) => setTotalBalls(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ width: "300px" }}>
        Počet označených míčků: {markedCount}
        <input
          type="range"
          min={MIN_MARKED}
          max={totalBalls}
          value={markedCount}
          onChange={(e) => setMarkedCount(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ width: "300px" }}>
        Rychlost míčků: {speed}
        <input
          type="range"
          min={MIN_SPEED}
          max={MAX_SPEED}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ width: "300px" }}>
        Délka hry (s): {duration}
        <input
          type="range"
          min={MIN_DURATION}
          max={MAX_DURATION}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{ width: "100%" }}
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
