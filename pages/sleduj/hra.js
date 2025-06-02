// pages/sleduj/hra.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const BALL_SIZE = 40;

export default function SledujHra() {
  const router = useRouter();
  const { pocetMicek = 3, rychlost = 5 } = router.query;
  const [balls, setBalls] = useState([]);
  const [targetIds, setTargetIds] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [showTargets, setShowTargets] = useState(false);
  const [running, setRunning] = useState(true);
  const [resultShown, setResultShown] = useState(false);

  useEffect(() => {
    const count = parseInt(pocetMicek);
    const speed = parseInt(rychlost);
    const newBalls = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      dx: (Math.random() - 0.5) * speed * 1.5,
      dy: (Math.random() - 0.5) * speed * 1.5,
    }));
    const targets = [...Array(count).keys()].sort(() => 0.5 - Math.random()).slice(0, count);
    setBalls(newBalls);
    setTargetIds(targets);

    const interval = setInterval(() => {
      setBalls(prev =>
        prev.map(ball => ({
          ...ball,
          x: Math.max(5, Math.min(95, ball.x + ball.dx)),
          y: Math.max(5, Math.min(90, ball.y + ball.dy)),
        }))
      );
    }, 100);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setRunning(false);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [pocetMicek, rychlost]);

  const handleClick = (id) => {
    if (!running && !showTargets && clicks.length < parseInt(pocetMicek)) {
      setClicks((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  const checkResult = () => {
    setShowTargets(true);
    setResultShown(true);
  };

  const restart = () => {
    router.reload();
  };

  const back = () => {
    router.push("/sleduj/nastaveni");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/goalie.jpg"
        alt="Goalie"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />

      {balls.map((ball) => {
        const isClicked = clicks.includes(ball.id);
        const isTarget = targetIds.includes(ball.id);
        const correct = showTargets && isTarget && isClicked;
        const missed = showTargets && isTarget && !isClicked;
        const wrong = showTargets && !isTarget && isClicked;

        let bg = "#c8ff00"; // základní žlutozelená
        if (correct) bg = "green";
        else if (missed) bg = "red";
        else if (wrong) bg = "gray";
        else if (isClicked) bg = "#999";

        return (
          <div
            key={ball.id}
            onClick={() => handleClick(ball.id)}
            className="absolute rounded-full border-4 border-white"
            style={{
              width: BALL_SIZE,
              height: BALL_SIZE,
              backgroundColor: bg,
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              cursor: running || showTargets ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            🎾
          </div>
        );
      })}

      {!running && !showTargets && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={checkResult}
            className="px-6 py-3 bg-yellow-500 text-white text-lg rounded shadow"
          >
            Ukázat správnost
          </button>
        </div>
      )}

      {resultShown && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-x-4">
          <button
            onClick={restart}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded shadow"
          >
            Restart
          </button>
          <button
            onClick={back}
            className="px-6 py-3 bg-gray-700 text-white text-lg rounded shadow"
          >
            Nastavení
          </button>
        </div>
      )}
    </div>
  );
}
