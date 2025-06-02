import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const BALL_SIZE = 30; // menší než 40px

export default function SledujHra() {
  const router = useRouter();
  const { pocetMicek = "3", rychlost = "5" } = router.query;
  const count = parseInt(pocetMicek);
  const speed = parseInt(rychlost);

  const [balls, setBalls] = useState([]);
  const [targetIds, setTargetIds] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [showTargets, setShowTargets] = useState(false);
  const [running, setRunning] = useState(true);
  const [resultShown, setResultShown] = useState(false);

  useEffect(() => {
    if (isNaN(count) || isNaN(speed) || count <= 0 || speed <= 0) return;

    // generuj míčky s náhodnými pozicemi a rychlostí
    const newBalls = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      dx: (Math.random() - 0.5) * speed * 2,
      dy: (Math.random() - 0.5) * speed * 2,
    }));

    // náhodně zvol míčky jako cíle (všechno)
    const targets = [...Array(count).keys()];
    setBalls(newBalls);
    setTargetIds(targets);

    // pohyb míčků po obrazovce
    const interval = setInterval(() => {
      setBalls(prev =>
        prev.map(ball => {
          let newX = ball.x + ball.dx;
          let newY = ball.y + ball.dy;

          // odraz od okrajů
          if (newX < 5 || newX > 95) ball.dx = -ball.dx;
          if (newY < 5 || newY > 90) ball.dy = -ball.dy;

          return {
            ...ball,
            x: Math.max(5, Math.min(95, newX)),
            y: Math.max(5, Math.min(90, newY)),
            dx: ball.dx,
            dy: ball.dy,
          };
        })
      );
    }, 50); // kratší interval = plynulejší pohyb

    // po X sekundách ukonči hru a zobraz výsledky
    const timer = setTimeout(() => {
      clearInterval(interval);
      setRunning(false);
    }, 1000 * (15 - speed)); // rychlost určuje délku hry (větší rychlost = kratší čas)

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [count, speed]);

  // Klikání na míček (jen pokud hra skončila a ještě neukazujeme výsledky)
  const handleClick = (id) => {
    if (!running && !showTargets && clicks.length < count) {
      if (!clicks.includes(id)) {
        setClicks(prev => [...prev, id]);
      }
    }
  };

  // Ukázat správnost
  const checkResult = () => {
    setShowTargets(true);
    setResultShown(true);
  };

  // Restart hry - prosté reloadnutí stránky s query parametry
  const restart = () => {
    router.replace(router.asPath);
  };

  // Návrat do nastavení
  const back = () => {
    router.push("/sleduj/nastaveni");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/goalie.jpg"
          alt="Goalie"
          layout="fill"
          objectFit="contain"
          quality={100}
          priority
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>

      {balls.map(ball => {
        const isClicked = clicks.includes(ball.id);
        const isTarget = targetIds.includes(ball.id);
        const correct = showTargets && isTarget && isClicked;
        const missed = showTargets && isTarget && !isClicked;
        const wrong = showTargets && !isTarget && isClicked;

        let bg = "#CEDC00"; // tenisákově žlutozelená barva
        let border = "2px solid #8DB600"; // tenisákové čáry (zelené)

        if (correct) {
          bg = "green";
          border = "2px solid darkgreen";
        } else if (missed) {
          bg = "red";
          border = "2px solid darkred";
        } else if (wrong) {
          bg = "gray";
          border = "2px solid #666";
        } else if (isClicked) {
          bg = "#999";
        }

        return (
          <div
            key={ball.id}
            onClick={() => handleClick(ball.id)}
            className="absolute rounded-full cursor-pointer"
            style={{
              width: BALL_SIZE,
              height: BALL_SIZE,
              backgroundColor: bg,
              border,
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
              userSelect: "none",
              transition: "background-color 0.3s, border-color 0.3s",
            }}
            title={`Míček ${ball.id + 1}`}
          >
            🎾
          </div>
        );
      })}

      {/* Tlačítko pro ukázání výsledků */}
      {!running && !showTargets && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={checkResult}
            className="px-6 py-3 bg-yellow-600 text-white rounded shadow text-lg"
          >
            Ukázat správnost
          </button>
        </div>
      )}

      {/* Po zobrazení výsledků Restart a Nastavení */}
      {resultShown && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 space-x-4">
          <button
            onClick={restart}
            className="px-6 py-3 bg-blue-700 text-white rounded shadow text-lg"
          >
            Restart
          </button>
          <button
            onClick={back}
            className="px-6 py-3 bg-gray-800 text-white rounded shadow text-lg"
          >
            Nastavení
          </button>
        </div>
      )}
    </div>
  );
}
