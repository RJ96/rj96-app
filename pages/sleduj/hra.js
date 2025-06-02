import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

const getRandomPosition = (radius, width, height, existing = []) => {
  let x, y, valid;
  do {
    x = Math.random() * (width - 2 * radius) + radius;
    y = Math.random() * (height - 2 * radius) + radius;
    valid = existing.every((p) => Math.hypot(p.x - x, p.y - y) > radius * 2 + 10);
  } while (!valid);
  return { x, y };
};

const SledujHra = () => {
  const router = useRouter();
  const { totalBalls, markedCount, speed, duration } = router.query;

  // Default hodnoty, pokud query ještě nejsou načteny
  const total = totalBalls ? Number(totalBalls) : 5;
  const marked = markedCount ? Number(markedCount) : 2;
  const spd = speed ? Number(speed) : 3;
  const dur = duration ? Number(duration) : 10;

  const [balls, setBalls] = useState([]);
  const [markedBalls, setMarkedBalls] = useState([]);
  const [showNumbers, setShowNumbers] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });

  const radius = 20;
  const width = typeof window !== "undefined" ? window.innerWidth : 600;
  const height = typeof window !== "undefined" ? window.innerHeight : 400;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!router.isReady) return;

    // Vygenerovat míčky
    const newBalls = [];
    for (let i = 0; i < total; i++) {
      const position = getRandomPosition(radius, width, height, newBalls);
      const angle = Math.random() * 2 * Math.PI;
      const dx = spd * Math.cos(angle);
      const dy = spd * Math.sin(angle);
      newBalls.push({ ...position, dx, dy, id: i });
    }

    // Náhodně vybrat označené míčky
    const indices = Array.from({ length: total }, (_, i) => i).sort(() => 0.5 - Math.random());
    const selected = indices.slice(0, marked);

    setBalls(newBalls);
    setMarkedBalls([]);
    setShowNumbers(true);
    setGameOver(false);
    setResults({ correct: 0, incorrect: 0 });

    const showNumbersTimeout = setTimeout(() => {
      setShowNumbers(false);
      startMovingBalls();
    }, 5000);

    const gameDurationTimeout = setTimeout(() => {
      stopMovingBalls();
      setGameOver(true);
    }, dur * 1000 + 5000);

    return () => {
      clearTimeout(showNumbersTimeout);
      clearTimeout(gameDurationTimeout);
      stopMovingBalls();
    };
  }, [router.isReady, total, marked, spd, dur]);

  const startMovingBalls = () => {
    intervalRef.current = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;
          let dx = ball.dx;
          let dy = ball.dy;

          if (newX <= radius || newX >= width - radius) dx = -dx;
          if (newY <= radius || newY >= height - radius) dy = -dy;

          return {
            ...ball,
            x: Math.max(radius, Math.min(width - radius, newX)),
            y: Math.max(radius, Math.min(height - radius, newY)),
            dx,
            dy,
          };
        })
      );
    }, 30);
  };

  const stopMovingBalls = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleBallClick = (id) => {
    if (!gameOver || markedBalls.includes(id)) return;
    const newMarked = [...markedBalls, id];
    setMarkedBalls(newMarked);

    if (newMarked.length === marked) {
      const correct = newMarked.filter((id) => selectedBalls.includes(id)).length;
      const incorrect = newMarked.length - correct;
      setResults({ correct, incorrect });
    }
  };

  // Pro správné hodnocení musíme vědět označené míčky (selectedBalls)
  // Přidáme stav pro ně a uložíme je v useEffect
  const [selectedBalls, setSelectedBalls] = useState([]);
  useEffect(() => {
    if (!router.isReady) return;
    const indices = Array.from({ length: total }, (_, i) => i).sort(() => 0.5 - Math.random());
    setSelectedBalls(indices.slice(0, marked));
  }, [router.isReady, total, marked]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url("/goalie.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <h1
        style={{
          color: "white",
          textShadow: "0 0 5px black",
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Sleduj – Hra
      </h1>
      <div
        style={{
          width: "100%",
          height: "calc(100vh - 70px)",
          position: "relative",
        }}
      >
        {balls.map((ball) => {
          const isMarked = markedBalls.includes(ball.id);
          const isCorrect = selectedBalls.includes(ball.id);

          return (
            <div
              key={ball.id}
              onClick={() => handleBallClick(ball.id)}
              style={{
                width: radius * 2,
                height: radius * 2,
                borderRadius: "50%",
                backgroundColor: "rgba(173, 255, 47, 0.8)", // žlutozelená (tenisák)
                position: "absolute",
                left: ball.x - radius,
                top: ball.y - radius,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                color: "black",
                cursor: gameOver ? "pointer" : "default",
                border: isMarked
                  ? isCorrect
                    ? "3px solid green"
                    : "3px solid red"
                  : "none",
                boxShadow:
                  "0 0 5px 2px rgba(173, 255, 47, 0.9), inset 0 0 10px 3px #b0e135",
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, transparent 30%, rgba(0,0,0,0.1) 40%, transparent 50%), radial-gradient(circle at 70% 70%, transparent 30%, rgba(0,0,0,0.1) 40%, transparent 50%)",
              }}
            >
              {gameOver && isMarked
                ? markedBalls.indexOf(ball.id) + 1
                : showNumbers && isCorrect
                ? selectedBalls.indexOf(ball.id) + 1
                : ""}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            padding: 20,
            borderRadius: 10,
            textAlign: "center",
            width: "90%",
            maxWidth: 400,
          }}
        >
          <p>
            Správně označeno: {results.correct} <br />
            Špatně označeno: {results.incorrect}
          </p>
          <button
            onClick={() => router.push("/sleduj/hra?" + new URLSearchParams(router.query))}
            style={{
              marginRight: 10,
              padding: "10px 20px",
              fontSize: 16,
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#2196F3",
              color: "white",
            }}
          >
            Restart
          </button>
          <button
            onClick={() => router.push("/sleduj")}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              cursor: "pointer",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#f44336",
              color: "white",
            }}
          >
            Nastavení
          </button>
        </div>
      )}
    </div>
  );
};

export default SledujHra;
