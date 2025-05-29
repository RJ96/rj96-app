import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Sipky() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalTime, setIntervalTime] = useState(2);
  const [currentArrow, setCurrentArrow] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef(null);

  const arrows = ['↑', '↓', '←', '→'];

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
        setCurrentArrow((prev) => {
          let next;
          do {
            next = arrows[Math.floor(Math.random() * arrows.length)];
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
    setCurrentArrow(arrows[Math.floor(Math.random() * arrows.length)]);
    setGameRunning(true);
  };

  const stopGame = () => {
    setGameRunning(false);
    setGameOver(true);
    clearInterval(intervalRef.current);
  };

  const restartGame = () => {
    setGameOver(false);
    setCurrentArrow(null);
  };

  if (!authChecked) return null;

  return (
    <div style={styles.container}>
      {!gameRunning && !gameOver && (
        <div style={styles.center}>
          <h1>Mód: Šipky</h1>
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
        <div style={styles.center}>
          <h1 style={styles.arrow}>{currentArrow}</h1>
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
  arrow: {
    fontSize: '8rem',
  },
};
