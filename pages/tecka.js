import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Tecka() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalTime, setIntervalTime] = useState(2);
  const [dotPosition, setDotPosition] = useState({ top: '50%', left: '50%' });

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/');
    } else {
      setAuthChecked(true);
    }
  }, []);

  const startGame = () => {
    const duration = parseInt(document.getElementById('duration').value);
    const interval = parseInt(document.getElementById('interval').value);

    setTimeLeft(duration);
    setIntervalTime(interval);
    setGameRunning(true);
    setGameOver(false);

    moveDot(); // Zobrazit první pozici ihned

    intervalRef.current = setInterval(moveDot, interval * 1000);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          clearInterval(timerRef.current);
          setGameRunning(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveDot = () => {
    const top = Math.floor(Math.random() * 90); // max 90 % výšky
    const left = Math.floor(Math.random() * 90); // max 90 % šířky
    setDotPosition({ top: `${top}%`, left: `${left}%` });
  };

  const restartGame = () => {
    setGameOver(false);
    setDotPosition({ top: '50%', left: '50%' });
  };

  if (!authChecked) return null;

  return (
    <div style={styles.container}>
      {!gameRunning && !gameOver && (
        <div style={styles.center}>
          <h1>Mód: Tečka</h1>
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
        <div style={styles.game}>
          <div style={styles.board}>
            <div style={{ ...styles.dot, top: dotPosition.top, left: dotPosition.left }} />
          </div>
          <p>Zbývající čas: {timeLeft}s</p>
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
  game: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  board: {
    width: '50vw',
    height: '50vh',
    border: '2px solid black',
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  dot: {
    width: '40px',
    height: '40px',
    backgroundColor: 'red',
    borderRadius: '50%',
    position: 'absolute',
    transition: 'top 0.3s, left 0.3s',
  },
};
