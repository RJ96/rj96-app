import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 300;
const DOT_RADIUS = 20;
const MIN_DISTANCE = 75;

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
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: '#e0e0e0',
    position: 'relative',
    border: '2px solid black',
    marginBottom: '1rem',
  },
  dot: {
    width: DOT_RADIUS * 2,
    height: DOT_RADIUS * 2,
    borderRadius: '50%',
    backgroundColor: 'red',
    position: 'absolute',
  },
};

export default function DveTecky() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dots, setDots] = useState([]);
  
  const gameTimerRef = useRef(null);
  const intervalRef = useRef(null);
  const durationRef = useRef(null);
  const intervalInputRef = useRef(null);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const generateDots = () => {
    let leftDot, rightDot, distance;

    do {
      leftDot = {
        x: Math.random() * ((BOARD_WIDTH / 2) - DOT_RADIUS * 2) + DOT_RADIUS,
        y: Math.random() * (BOARD_HEIGHT - DOT_RADIUS * 2) + DOT_RADIUS,
      };
      rightDot = {
        x: Math.random() * ((BOARD_WIDTH / 2) - DOT_RADIUS * 2) + BOARD_WIDTH / 2 + DOT_RADIUS,
        y: Math.random() * (BOARD_HEIGHT - DOT_RADIUS * 2) + DOT_RADIUS,
      };
      distance = Math.hypot(leftDot.x - rightDot.x, leftDot.y - rightDot.y);
    } while (distance < MIN_DISTANCE);

    setDots([leftDot, rightDot]);
  };

  const startGame = () => {
    const duration = parseInt(durationRef.current.value);
    const interval = parseInt(intervalInputRef.current.value);

    if (
      isNaN(duration) || duration < 5 || duration > 60 ||
      isNaN(interval) || interval < 1 || interval > 10
    ) {
      alert('Zadej platná čísla: délka 5–60s, interval 1–10s.');
      return;
    }

    setTimeLeft(duration);
    setGameRunning(true);
    setGameOver(false);
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
    clearInterval(gameTimerRef.current);
    clearInterval(intervalRef.current);
    setGameOver(false);
    setGameRunning(false);
    setDots([]);
    setTimeLeft(0);
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
            <input
              ref={durationRef}
              type="number"
              min="5"
              max="60"
              defaultValue="10"
            />
          </label>
          <br />
          <label>
            Interval (1–10s):{' '}
            <input
              ref={intervalInputRef}
              type="number"
              min="1"
              max="10"
              defaultValue="2"
            />
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
                  left: `${dot.x - DOT_RADIUS}px`,
                  top: `${dot.y - DOT_RADIUS}px`,
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
