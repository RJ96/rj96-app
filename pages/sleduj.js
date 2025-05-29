import React, { useEffect, useState, useRef } from "react";

const getRandomPosition = (radius, width, height, existing = []) => {
  let x, y, valid;
  do {
    x = Math.random() * (width - 2 * radius) + radius;
    y = Math.random() * (height - 2 * radius) + radius;
    valid = existing.every(
      (p) => Math.hypot(p.x - x, p.y - y) > radius * 2 + 10
    );
  } while (!valid);
  return { x, y };
};

const Sleduj = () => {
  const boardRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [balls, setBalls] = useState([]);
  const [selectedBalls, setSelectedBalls] = useState([]);
  const [markedBalls, setMarkedBalls] = useState([]);
  const [showNumbers, setShowNumbers] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [settings, setSettings] = useState({
    totalBalls: 6,
    markedCount: 3,
    speed: 5,
    duration: 10,
  });

  const [results, setResults] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    if (gameStarted) {
      const newBalls = [];
      for (let i = 0; i < settings.totalBalls; i++) {
        const position = getRandomPosition(15, 600, 400, newBalls);
        newBalls.push({
          ...position,
          dx: (Math.random() - 1) * settings.speed * 2,
          dy: (Math.random() - 1) * settings.speed * 2,
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

      setTimeout(() => {
        setShowNumbers(false);
        startMovingBalls(newBalls);
      }, 5000);

      setTimeout(() => {
        stopMovingBalls();
        setGameOver(true);
      }, settings.duration * 1000 + 5000);
    }
  }, [gameStarted]);

  const intervalRef = useRef(null);

  const startMovingBalls = (initialBalls) => {
    intervalRef.current = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;

          if (newX <= 15 || newX >= 585) ball.dx *= -1;
          if (newY <= 15 || newY >= 385) ball.dy *= -1;

          return {
            ...ball,
            x: newX <= 15 ? 15 : newX >= 585 ? 585 : newX,
            y: newY <= 15 ? 15 : newY >= 385 ? 385 : newY,
            dx: ball.dx,
            dy: ball.dy,
          };
        })
      );
    }, 30);
  };

  const stopMovingBalls = () => {
    clearInterval(intervalRef.current);
  };

  const handleBallClick = (id) => {
    if (!gameOver || markedBalls.includes(id)) return;

    const newMarked = [...markedBalls, id];
    setMarkedBalls(newMarked);

    if (newMarked.length === selectedBalls.length) {
      const correct = newMarked.filter((id) => selectedBalls.includes(id))
        .length;
      const incorrect = newMarked.length - correct;
      setResults({ correct, incorrect });
    }
  };

  const startGame = () => {
    if (settings.markedCount > settings.totalBalls) {
      alert("Označených míčků nemůže být víc než celkový počet!");
      return;
    }
    setGameStarted(true);
  };

  return (
    <div>
      <h1>Sleduj</h1>
      <div
        ref={boardRef}
        style={{
          width: 600,
          height: 400,
          border: "2px solid black",
          marginBottom: 20,
          position: "relative",
        }}
      >
        {balls.map((ball, index) => {
          const isSelected = selectedBalls.includes(ball.id);
          const isMarked = markedBalls.indexOf(ball.id);
          const wasCorrect = selectedBalls.includes(ball.id);
          const showMark = gameOver && markedBalls.includes(ball.id);
          const resultColor =
            showMark && wasCorrect
              ? "green"
              : showMark && !wasCorrect
              ? "red"
              : "red";

          return (
            <div
              key={ball.id}
              onClick={() => handleBallClick(ball.id)}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: resultColor,
                position: "absolute",
                left: ball.x - 15,
                top: ball.y - 15,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontWeight: "bold",
                cursor: gameOver ? "pointer" : "default",
              }}
            >
              {showNumbers && isSelected
                ? selectedBalls.indexOf(ball.id) + 1
                : gameOver && markedBalls.includes(ball.id)
                ? markedBalls.indexOf(ball.id) + 1
                : ""}
            </div>
          );
        })}
      </div>

      {gameOver && markedBalls.length === selectedBalls.length && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "green" }}>
            ✅ Správně označeno: {results.correct}
          </div>
          <div style={{ color: "red" }}>
            ❌ Špatně označeno: {results.incorrect}
          </div>
        </div>
      )}

      {!gameStarted && (
        <div>
          <label>
            Počet míčků:{" "}
            <input
              type="number"
              value={settings.totalBalls}
              onChange={(e) =>
                setSettings({ ...settings, totalBalls: parseInt(e.target.value) })
              }
              min={1}
              max={10}
            />
          </label>{" "}
          <label>
            Označené míčky:{" "}
            <input
              type="number"
              value={settings.markedCount}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  markedCount: parseInt(e.target.value),
                })
              }
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
                setSettings({ ...settings, speed: parseInt(e.target.value) })
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
                setSettings({ ...settings, duration: parseInt(e.target.value) })
              }
              min={1}
              max={60}
            />
          </label>{" "}
          <button onClick={startGame}>Start</button>
        </div>
      )}

      {gameOver && (
        <button
          onClick={() => {
            setGameStarted(false);
          }}
        >
          Nová hra
        </button>
      )}
    </div>
  );
};

export default Sleduj;
