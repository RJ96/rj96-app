import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

const getRandomPosition = (radius, width, height, existing = []) => {
  let x, y, valid;
  do {
    x = Math.random() * (width - 2 * radius - 60) + radius + 30;
    y = Math.random() * (height - 2 * radius - 60) + radius + 30;
    valid = existing.every((p) => Math.hypot(p.x - x, p.y - y) > radius * 2 + 10);
  } while (!valid);
  return { x, y };
};

const SledujHra = () => {
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [balls, setBalls] = useState([]);
  const [selectedBalls, setSelectedBalls] = useState([]);
  const [markedBalls, setMarkedBalls] = useState([]);
  const [showNumbers, setShowNumbers] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });

  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const radius = 20; // menší koule

  useEffect(() => {
    if (!router.isReady) return;

    const { totalBalls, markedCount, speed, duration } = router.query;

    setSettings({
      totalBalls: parseInt(totalBalls),
      markedCount: parseInt(markedCount),
      speed: parseFloat(speed),
      duration: parseInt(duration),
    });
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!settings || !containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;

    const newBalls = [];
    for (let i = 0; i < settings.totalBalls; i++) {
      const pos = getRandomPosition(radius, clientWidth, clientHeight, newBalls);
      newBalls.push({
        ...pos,
        dx: settings.speed,
        dy: settings.speed,
        id: i,
      });
    }

    const indices = [...Array(settings.totalBalls).keys()];
    indices.sort(() => 0.5 - Math.random());
    const selected = indices.slice(0, settings.markedCount);

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

    const endGameTimeout = setTimeout(() => {
      stopMovingBalls();
      setGameOver(true);
    }, settings.duration * 1000 + 5000);

    return () => {
      clearTimeout(showNumbersTimeout);
      clearTimeout(endGameTimeout);
      stopMovingBalls();
    };
  }, [settings]);

  const startMovingBalls = () => {
    intervalRef.current = setInterval(() => {
      setBalls((prevBalls) => {
        if (!containerRef.current) return prevBalls;

        const { clientWidth, clientHeight } = containerRef.current;

        return prevBalls.map((ball) => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;

          if (newX <= radius + 30 || newX >= clientWidth - radius - 30) ball.dx *= -1;
          if (newY <= radius + 30 || newY >= clientHeight - radius - 30) ball.dy *= -1;

          return {
            ...ball,
            x: Math.min(Math.max(newX, radius + 30), clientWidth - radius - 30),
            y: Math.min(Math.max(newY, radius + 30), clientHeight - radius - 30),
          };
        });
      });
    }, 30);
  };

  const stopMovingBalls = () => clearInterval(intervalRef.current);

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

  if (!settings) return <div>Načítání...</div>;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        margin: 0,
        overflow: "hidden",
        backgroundImage: "url(/goalie.jpg)",
        backgroundSize: "contain", // Zmenšený brankář
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "black",
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 30,
          bottom: 30,
          left: 30,
          right: 30,
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
                backgroundColor: "#d4ff00", // žlutozelená (tenisák)
                backgroundImage:
                  "repeating-linear-gradient(45deg, #aaa 0px, #aaa 2px, #d4ff00 2px, #d4ff00 6px)", // šedý vzor
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
              {gameOver && isMarked ? markedBalls.indexOf(ball.id) + 1 : ""}
              {showNumbers && isCorrect ? selectedBalls.indexOf(ball.id) + 1 : ""}
            </div>
          );
        })}
      </div>

      {gameOver && markedBalls.length === selectedBalls.length && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            color: "white",
            fontSize: 20,
            textShadow: "1px 1px 3px black",
          }}
        >
          ✅ Správně: {results.correct} <br />
          ❌ Špatně: {results.incorrect}
        </div>
      )}

      {gameOver && (
        <button
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
          }}
          onClick={() => router.push("/sleduj")}
        >
          Nová hra
        </button>
      )}
    </div>
  );
};

export default SledujHra;
