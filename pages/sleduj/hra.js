import React, { useEffect, useState, useRef } from "react";
import background from "/goalie.jpg"; // obrázek v public složce

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
  const [balls, setBalls] = useState([]);
  const [selectedBalls, setSelectedBalls] = useState([]);
  const [markedBalls, setMarkedBalls] = useState([]);
  const [showNumbers, setShowNumbers] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });

  const radius = 30;
  const speed = settings.speed;
  const intervalRef = useRef(null);

  useEffect(() => {
    const newBalls = [];
    for (let i = 0; i < settings.totalBalls; i++) {
      const position = getRandomPosition(radius, 600, 400, newBalls);
      newBalls.push({
        ...position,
        dx: speed,
        dy: speed,
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
      startMovingBalls();
    }, 5000); // 5 sekund na zapamatování

    setTimeout(() => {
      stopMovingBalls();
      setGameOver(true);
    }, settings.duration * 1000 + 5000); // konec hry
  }, []);

  const startMovingBalls = () => {
    intervalRef.current = setInterval(() => {
      setBalls((prevBalls) =>
        prevBalls.map((ball) => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;

          if (newX <= radius || newX >= 600 - radius) ball.dx *= -1;
          if (newY <= radius || newY >= 400 - radius) ball.dy *= -1;

          return {
            ...ball,
            x: newX <= radius ? radius : newX >= 600 - radius ? 600 - radius : newX,
            y: newY <= radius ? radius : newY >= 400 - radius ? 400 - radius : newY,
            dx: ball.dx,
            dy: ball.dy,
          };
        })
      );
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

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sleduj – Hra</h1>
      <div
        style={{
          width: 600,
          height: 400,
          margin: "0 auto",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          position: "relative",
          border: "2px solid black",
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
              {gameOver && isMarked ? markedBalls.indexOf(ball.id) + 1 : ""}
              {showNumbers && isCorrect
                ? selectedBalls.indexOf(ball.id) + 1
                : ""}
            </div>
          );
        })}
      </div>

      {gameOver && markedBalls.length === selectedBalls.length && (
        <div style={{ margin: 10 }}>
          ✅ Správně: {results.correct} <br />
          ❌ Špatně: {results.incorrect}
        </div>
      )}

      {gameOver && (
        <button style={{ marginTop: 10 }} onClick={onRestart}>
          Nová hra
        </button>
      )}
    </div>
  );
};

export default SledujHra;
