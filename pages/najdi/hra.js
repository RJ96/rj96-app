import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Nahrazeno větším kolečkem ⬤
const SHAPES = ["⬤", "■", "◆", "▲"];
const MAX_TIME = 20;
const SYMBOL_SIZE_PX = 36; // menší symbol
const MARGIN_PX = 8; // menší okraj

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
    const total = 150; // více symbolů na menším prostoru
    const triangleIndex = Math.floor(Math.random() * total);

    const board = document.getElementById("board");
    const boardWidth = board ? board.clientWidth : window.innerWidth;
    const boardHeight = board ? board.clientHeight : window.innerHeight;

    const newSymbols = [];

    for (let i = 0; i < total; i++) {
      const shape = i === triangleIndex ? "▲" : SHAPES[Math.floor(Math.random() * 3)];

      const leftPx =
        MARGIN_PX + Math.random() * (boardWidth - 2 * MARGIN_PX - SYMBOL_SIZE_PX);
      const topPx =
        MARGIN_PX + Math.random() * (boardHeight - 2 * MARGIN_PX - SYMBOL_SIZE_PX);

      const left = (leftPx / boardWidth) * 100;
      const top = (topPx / boardHeight) * 100;

      newSymbols.push({ shape, id: i, left, top });
    }

    setSymbols(newSymbols);
    setFound(false);
    setTimeLeft(MAX_TIME);
  };

  useEffect(() => {
    if (round < totalRounds) {
      setTimeout(generateSymbols, 50);
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
      <div id="board" style={styles.board}>
        {symbols.map((s) => (
          <div
            key={s.id}
            style={{
              ...styles.symbol,
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: SYMBOL_SIZE_PX,
              height: SYMBOL_SIZE_PX,
              lineHeight: `${SYMBOL_SIZE_PX}px`,
              textAlign: "center",
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
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    textAlign: "center",
    padding: "8px 0",
    flexShrink: 0,
  },
  text: {
    color: "#85CFFF",
    margin: 0,
  },
  board: {
    position: "relative",
    flexGrow: 1,
    width: "95vw", // menší hrací pole
    height: "80vh", // menší výška
    margin: "0 auto",
    backgroundColor: "#1E1E1E",
  },
  symbol: {
    position: "absolute",
    fontSize: `${SYMBOL_SIZE_PX}px`,
    color: "#85CFFF",
    cursor: "pointer",
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
