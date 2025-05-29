import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Priklady() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalTime, setIntervalTime] = useState(2);
  const [currentExample, setCurrentExample] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef(null);

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
        setCurrentExample(generateExample());
      }, intervalTime * 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [gameRunning, intervalTime]);

  const generateExample = () => {
    const a = Math.floor(Math.random() * 41) + 5; // 5–45
    const b = Math.floor(Math.random() * 11) + 1; // 1–10
    const isAddition = Math.random() > 0.5;
    if (isAddition) {
      return `${a} + ${b}`;
    } else {
      const max = a + b <= 50 ? a + b : 50;
      const left = Math.floor(Math.random() * (max - b + 1)) + b;
      return `${left} - ${b}`;
    }
  };

  const startGame = () => {
    setGameOver(false);
    setTimeLeft(parseInt(document.getElementById('duration').value));
    setIntervalTime(parseInt(document.getElementById('interval').value));
    setCurrentExample(generateExample());
    setGameRunning(true);
  };

  const stopGame = () => {
    setGameRunning(false);
    setGameOver(true);
    clearInterval(intervalRef.current);
  };

  const restartGame = () => {
    setGameOver(false);
    setCurrentExample('');
  };

  if (!authChecked) return null;

  return (
    <div style={styles.container}>
      {!gameRunning && !gameOver && (
        <div style={styles.center}>
          <h1>Mód: Příklady</h1>
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
          <h1 style={styles.example}>{currentExample}</h1>
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
  example: {
    fontSize: '5rem',
  },
};
