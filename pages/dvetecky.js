import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function DveTecky() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalTime, setIntervalTime] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [dots, setDots] = useState([]);
  const gameTimerRef = useRef(null);
  const intervalRef = useRef(null);

  const durationRef = useRef();
  const intervalInputRef = useRef();

  const BOARD_WIDTH = 600;
  const BOARD_HEIGHT = 300;
  const DOT_RADIUS = 20;
  const MIN_DISTANCE = 75;

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/');
    } else {
      setAuthChecked(true);
    }
  }, []);

  const generateDots = () => {
    let leftDot, rightDot, distance;

    do {
      leftDot = {
        x: Math.random() * (BOARD_WIDTH / 2 - DOT_RADIUS * 2),
        y: Math.random() * (BOARD_HEIGHT - DOT_RADIUS * 2),
      };
      rightDot = {
        x: Math.random() * (BOARD_WIDTH / 2 - DOT_RADIUS * 2) + BOARD_WIDTH / 2,
        y: Math.random() * (BOARD_HEIGHT - DOT_RADIUS * 2),
      };
      distance = Math.hypot(leftDot.x - rightDot.x, leftDot.y - rightDot.y);
    } while (distance < MIN_DISTANCE);

    setDots([leftDot, rightDot]);
  };

  const startGame = () => {
    const duration = parseInt(document.getElementById('duration').value);
    const interval = parseInt(document.getElementById('interval').value);
    if (isNaN(duration) || isNaN(interval)) {
      alert('Zadej platná čísla.');
      return;
    }

    setTimeLeft(duration);
    setIntervalTime(interval);
    setGameRunning(true);
    setGameOver(false);
    setDots([]);
    generateDots();

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
          clearInterval(intervalRef.current);
          setGameRunning(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    intervalRef.current = setInterval(() => {
      generateDots();
    }, interval * 1000);
  };

  const restartGame = () => {
    setGameOver(false);
    setGameRunning(false);
    setDots([]);
  };

  useEffect(() => {
    return () => {
      clearInterval(gameTimerRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  if (!authChecked) return null;

  return (
    <div style={styles.container}>
      {!gameRunning && !gameOver && (
        <div style={styles.center}>
          <h1>Mód: Dvě tečky</h1>
          <label>
            Délka hry (5–60s):{' '}
            <input ref={durationRef} type="number" min="5" max="60" defaultValue="10" />
          </label>
          <br />
          <label>
            Interval (1–10s):{' '}
            <input ref={intervalInputRef} type="number" min="1" max="10" defaultValue="2" />
          </label>
          <br />
          <button onClick={startGame}>Start</button>
        </div>
      )}

      {gameRunning && (
        <div style={styles.gameArea}>
          <div style={styles.board}>
            {dots.map((dot, index) => (
              <div
                key={index}
                style={{
                  ...styles.dot,
                  left: `${dot.x}px`,
                  top: `${dot.y}px`,
                }}
              />
            ))}
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
  gameArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  board: {
    width: 600,
    height: 300,
    backgroundColor: '#e0e0e0',
    position: 'relative',
    border: '2px solid black',
    marginBottom: '1rem',
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: 'red',
    position: 'absolute',
  },
};
