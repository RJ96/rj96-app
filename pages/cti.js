import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Cti() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalTime, setIntervalTime] = useState(2);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef(null);

  // Ověření hesla
  useEffect(() => {
    const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/');
    } else {
      setAuthChecked(true);
    }
  }, []);

  // Správa časovačů
  useEffect(() => {
    if (gameRunning) {
      const countdownTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            clearInterval(intervalRef.current);
            setGameRunning(false);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      intervalRef.current = setInterval(() => {
        const newNumber = Math.floor(Math.random() * 11);
        setCurrentNumber(newNumber);
      }, intervalTime * 1000);

      return () => {
        clearInterval(countdownTimer);
        clearInterval(intervalRef.current);
      };
    }
  }, [gameRunning, intervalTime]);

  const startGame = () => {
    setGameRunning(true);
    setGameOver(false);
    setTimeLeft(parseInt(document.getElementById('duration').value));
    setIntervalTime(parseInt(document.getElementById('interval').value));
    setCurrentNumber(Math.floor(Math.random() * 11));
  };

  const restartGame = () => {
    setGameOver(false);
    setCurrentNumber(null);
    setGameRunning(false);
  };

  if (!authChecked) return null;

  return (
    <div style={styles.container}>
      {!gameRunning && !gameOver && (
        <div style={styles.center}>
          <h1>Mód: Čti nahlas čísla</h1>
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
          <h1 style={styles.number}>{currentNumber}</h1>
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
  },
  number: {
    fontSize: '5rem',
  },
};
