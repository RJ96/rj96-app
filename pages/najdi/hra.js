import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SHAPES = ["⬤", "■", "◆"];
const TOTAL_CELLS = 100; // 10x10 mřížka
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

  const generateGrid = () => {
    const triangleIndex = Math.floor(Math.random() * TOTAL_CELLS);
    const newSymbols = [];

    for (let i = 0; i < TOTAL_CELLS; i++) {
      const shape = i === triangleIndex ? "▲" : SHAPES[Math.floor(Math.random() * SHAPES.length)];
      newSymbols.push({ shape, id: i });
    }

    setSymbols(newSymbols);
    setFound(false);
    setTimeLeft(MAX_TIME);
  };

  useEffect(() => {
    if (round < totalRounds) {
      setTimeout(generateGrid, 50);
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
      <div style={styles.grid}>
        {symbols.map((s) => (
          <div key={s.id} style={styles.cell} onClick={() => handleClick(s)}>
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
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    textAlign: "center",
    padding: "10px",
    flexShrink: 0,
  },
  text: {
    color: "#85CFFF",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 1fr)",
    gridTemplateRows: "repeat(10, 1fr)",
    gap: "6px",
    padding: "10px",
    margin: "0 auto",
    width: "400px",
    height: "400px",
    backgroundColor: "#1E1E1E",
  },
  cell: {
    fontSize: "24px",
    color: "#85CFFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: "6px",
    cursor: "pointer",
    aspectRatio: "1",
    userSelect: "none",
  },
  centered: {
    backgroundColor: "#1E1E1E",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    color: "#85CFFF",
  },
};
