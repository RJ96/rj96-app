import React, { useEffect, useState, useRef } from "react";

const getRandomPosition = (radius, width, height, existing = []) => {
  let x, y, valid;
  do {
    x = Math.random() * (width - 2 * radius) + radius;
    y = Math.random() * (height - 2 * radius) + radius;
    valid = existing.every((p) => Math.hypot(p.x - x, p.y - y) > radius * 2 + 10);
  } while (!valid);
  return { x, y };
};

const SledujHra = ({ settings, onRestart }) => {
  const {
    totalBalls = 5,
    markedCount = 2,
    speed = 3,
    duration = 10,
  } = settings;

  const [balls, setBalls] = useState([]);
  const [selectedBalls, setSelectedBalls] = useState([]);
  const [markedBalls, setMarkedBalls] = useState([]);
  const [showNumbers, setShowNumbers] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });

  const radius = 30;
  const intervalRef = useRef(null);

  useEffect(() => {
    const newBalls = [];
    for (let i = 0; i < totalBalls; i++) {
      const position = getRandomPosition(radius, 600, 400, newBalls);
      const angle = Math.random() * 2 * Math.PI;
      const dx = speed * Math.cos(angle);
      const dy = speed * Math.sin(angle);
      newBalls.push({ ...position, dx, dy, id: i });
    }

    const indices = Array.from({ length: totalBalls }, (_, i) => i).sort(() => 0.5 - Math.random());
    const selected = indices.slice(0, markedCount);

    setBalls(newBalls);
    setSelectedBalls(selected);
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
    }, duration * 1000 + 5000);

    return () => {
      clearTimeout(showNumbersTimeout);
      clearTimeout(gameDurationTimeout);
      stopMovingBalls();
    };
  }, [totalBalls, markedCount, speed, duration]);

  const startMovingBalls = () => {
    intervalRef.current = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;
          let dx = ball.dx;
          let dy = ball.dy;

          if (newX <= radius || newX >= 600 - radius) dx = -dx;
          if (newY <= radius || newY >= 400 - radius) dy = -dy;

          return {
            ...ball,
            x: Math.max(radius, Math.min(600 - radius, newX)),
            y: Math.max(radius, Math.min(400 - radius, newY)),
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

    if (newMarked.length === selectedBalls.length) {
      const correct = newMarked.filter((id) => selectedBalls.includes(id)).length;
      const incorrect = newMarked.length - correct;
      setResults({ correct, incorrect });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>Sleduj – Hra</h1>
      <div
        style={{
          width: 600,
          height: 400,
          margin: "0 auto",
          backgroundImage: `url("/goalie.jpg")`,
          backgroundSize: "cover",
          position: "relative",
          border: "2px solid black",
          userSelect: "none",
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
                backgroundColor: "yellow",
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

      {gameOver && markedBalls.length === selectedBalls.length && (
        <div style={{ margin: 10, fontSize: 18 }}>
          ✅ Správně: {results.correct} <br />
          ❌ Špatně: {results.incorrect}
        </div>
      )}

      {gameOver && (
        <button onClick={onRestart} style={{ padding: "8px 16px", fontSize: 16 }}>
          Nová hra
        </button>
      )}
    </div>
  );
};

const HraPage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem("sledujSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      window.location.href = "/sleduj/nastaveni";
    }
  }, []);

  const handleRestart = () => {
    window.location.href = "/sleduj/nastaveni";
  };

  if (!settings) return <div>Načítám nastavení...</div>;

  return <SledujHra settings={settings} onRestart={handleRestart} />;
};

export default HraPage;
