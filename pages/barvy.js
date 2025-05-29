import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Barvy() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalTime, setIntervalTime] = useState(2);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef(null);

  const colors = ['Žlutá', 'Červená', 'Modrá', 'Oranžová'];

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/');
    } else {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    if (gameRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameRunning && timeLeft <= 0) {
      stopGame();
    }
  }, [gameRunning, timeLeft]);

  useEffect(() => {
    if (gameRunning) {
      intervalRef.current = setInterval(() => {
        setHighlightedIndex((prev) => {
          let next;
          do {
            next = Math.floor(Math.random() * colors.length);
          } while (next === prev);
          return next;
        });
      }, intervalTime * 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [gameRunning, intervalTime]);

  const startGame = () => {
    setGameOver(false);
    setTimeLeft(parseInt(document.getElementById('duration').value));
    setIntervalTime(parseInt(document.getElementById('interval').value));
    setGameRunning(true);
    setHighlightedIndex(Math.floor(Math.random() * colors.length));
  };

  const stopGame = () => {
    setGameRunning(false);
    setGameOver(true);
    clearInterval(intervalRef.current);
  };

  const restartGame = () => {
    setGameOver(false);
    setHighlightedIndex(null);
  };

  if (!authChecked) return null;

  return (
    <div style={styles.container}>
      {!gameRunning && !gameOver && (
        <div style={styles.center}>
          <h1>Mód: Barvy</h1>
          <label>
            Délka hry (5–60s): <input id="duration" type="number" min="5" max="60" defaultValue="10" />
          </label>
          <br />
          <label>
            Interval (1–10s): <input id="interval" type="number" min="1" max="10" defaultValue="2" />
          </label>
          <br />
          <button onClick={startGame}>Start</button>
        </div>
      )}

      {gameRunning && (
        <div style={styles.grid}>
          {colors.map((color, index) => (
            <div
              key={color}
              style={{
                ...styles.box,
                backgroundColor: getColorCode(color),
                transform: highlightedIndex === index ? 'scale(1.2)' : 'scale(1)',
                border: highlightedIndex === index ? '4px solid black' : '2px solid gray',
              }}
            >
              {color}
            </div>
          ))}
          <p style={{ gridColumn: 'span 2' }}>Zbývající čas: {timeLeft}s</p>
        </div>
      )}

      {gameOver && (
        <div style={styles.center}>
          <h1>Konec hry</h1>
          <button onClick={restartGame}>Restart</button>
          <button onClick={() => router.push('/modes')}>Zpět na výběr</button>
        </div>
      )}
    </div>
  );
}

const getColorCode = (color) => {
  switch (color) {
    case 'Červená': return 'red';
    case 'Modrá': return 'blue';
    case 'Zelená': return 'green';
    case 'Žlutá': return 'yellow';
    case 'Oranžová': return 'orange';
    default: return 'gray';
  }
};

const styles = {
  container: {
    backgroundColor: 'white',
    color: 'black',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 150px)',
    gridGap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  box: {
    width: '150px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  },
};
