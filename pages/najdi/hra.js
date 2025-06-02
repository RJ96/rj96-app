import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SHAPES = ["●", "■", "◆", "▲"];
const MAX_TIME = 20;

export default function NajdiHra() {
  const router = useRouter();
  const { pocetKol } = router.query;
  const totalRounds = parseInt(pocetKol) || 20;

  const [symbols, setSymbols] = useState([]);
  const [round, setRound] = useState(0);
  const [found, setFound] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [gameOver, setGameOver] = useState(false);

  const generateSymbols = () => {
    const total = 150;
    const triangleIndex = Math.floor(Math.random() * total);
    const newSymbols = [];
    const minDistance = 4; // minimální vzdálenost mezi symboly

    const isTooClose = (x, y) => {
      return newSymbols.some(s => {
        const dx = s.left - x;
        const dy = s.top - y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
    };

    let attempts = 0;
    while (newSymbols.length < total && attempts < total * 20) {
      const left = Math.random() * 96; // rozsah % (širší rozložení)
      const top = Math.random() * 89;

      if (!isTooClose(left, top)) {
        const i = newSymbols.length;
        const shape = i === triangleIndex ? "▲" : SHAPES[Math.floor(Math.random() * 3)];
        newSymbols.push({ shape, id: i, left, top });
      }

      attempts++;
    }

    setSymbols(newSymbols);
    setFound(false);
    setTimeLeft(MAX_TIME);
  };

  useEffect(() => {
    if (round < totalRounds) {
      generateSymbols();
    } else {
      setGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    if (found || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRound((r) => r + 1);
          return MAX_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [found, gameOver]);

  const handleClick = (symbol) => {
    if (symbol.shape === "▲") {
      setFound(true);
      setTimeout(() => setRound((r) => r + 1), 500);
    }
  };

  if (gameOver) {
    return (
      <div style={styles.centered}>
        <h1 style={styles.text}>Konec hry</h1>
        <button onClick={() => router.push("/najdi")}>Nová hra</button>
        <button onClick={() => router.push("/")}>Zpět do výběru módů</button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.text}>Kolo {round + 1} z {totalRounds}</h2>
        <p style={styles.text}>Zbývá čas: {timeLeft}s</p>
      </div>
      <div style={styles.board}>
        {symbols.map((s) => (
          <div
            key={s.id}
            style={{
              ...styles.symbol,
              left: `${s.left}%`,
              top: `${s.top}%`,
              fontSize: s.shape === "●" ? "52px" : s.shape === "▲" ? "36px" : "44px",
          }}
            onClick={() => handleClick(s)}
          >
            {s.shape}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#1E1E1E",
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
  },
  header: {
    textAlign: "center",
    paddingTop: "20px",
  },
  text: {
    color: "#85CFFF",
  },
  board: {
    position: "relative",
    width: "100%",
    height: "80vh",
  },
  symbol: {
    position: "absolute",
    fontSize: "44px",
    color: "#85CFFF",
    cursor: "pointer",
    userSelect: "none",
    lineHeight: "1",
  },
  centered: {
    backgroundColor: "#1E1E1E",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: "20px",
    color: "#85CFFF",
  },
};
