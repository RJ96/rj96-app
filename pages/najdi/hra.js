import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SHAPES = ["⬤", "■", "◆"];
const SYMBOL_COUNT = 30; // celkový počet symbolů (1 trojúhelník + 29 jiných)
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
    const containerWidth = 400;
    const containerHeight = 300;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radiusX = 180;
    const radiusY = 120;

    let newSymbols = [];

    // náhodný index pro trojúhelník
    const triangleIndex = Math.floor(Math.random() * SYMBOL_COUNT);

    for (let i = 0; i < SYMBOL_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const x = centerX + radiusX * Math.cos(angle);
      const y = centerY + radiusY * Math.sin(angle) * 0.5 + 40; // omezí horní/spodní část

      const shape = i === triangleIndex ? "▲" : SHAPES[Math.floor(Math.random() * SHAPES.length)];

      newSymbols.push({
        shape,
        id: i,
        left: x,
        top: y
      });
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
      <div style={styles.playArea}>
        {symbols.map((s) => (
          <div
            key={s.id}
            onClick={() => handleClick(s)}
            style={{
              ...styles.symbol,
              left: s.left,
              top: s.top,
            }}
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
    color: "#85CFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    margin: 0,
  },
  playArea: {
    position: "relative",
    width: 400,
    height: 300,
    backgroundColor: "#121212",
    border: "2px solid #85CFFF",
    borderRadius: "16px",
    overflow: "hidden",
    marginTop: 10,
  },
  symbol: {
    position: "absolute",
    fontSize: "32px",
    width: "32px",
    height: "32px",
    textAlign: "center",
    lineHeight: "32px",
    color: "#85CFFF",
    userSelect: "none",
    cursor: "pointer",
    transform: "translate(-50%, -50%)",
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
