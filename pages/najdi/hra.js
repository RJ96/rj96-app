import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SHAPES = ["◯", "■", "◆", "▲"];
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
    const newSymbols = [];
    const total = 25;
    const triangleIndex = Math.floor(Math.random() * total);
    for (let i = 0; i < total; i++) {
      const shape = i === triangleIndex ? "▲" : SHAPES[Math.floor(Math.random() * 3)];
      newSymbols.push({ shape, id: i });
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
        <h1>Konec hry</h1>
        <button onClick={() => router.push("/najdi")}>Nová hra</button>
        <button onClick={() => router.push("/")}>Zpět do výběru módů</button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <h2>Kolo {round + 1} z {totalRounds}</h2>
      <p>Zbývá čas: {timeLeft}s</p>
      <div style={styles.grid}>
        {symbols.map((s) => (
          <div key={s.id} style={styles.symbol} onClick={() => handleClick(s)}>
            {s.shape}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#D2C7B0",
    minHeight: "100vh",
    color: "#000",
    padding: "20px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 60px)",
    gridGap: "15px",
    justifyContent: "center",
    marginTop: "20px",
  },
  symbol: {
    fontSize: "36px",
    cursor: "pointer",
    userSelect: "none",
  },
  centered: {
    backgroundColor: "#D2C7B0",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    gap: "20px"
  },
};
