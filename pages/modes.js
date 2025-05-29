import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Modes() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      router.replace('/');
    } else {
      setAuthChecked(true);
    }
  }, []);

  if (!authChecked) return null;

  const goToMode = (mode) => {
    router.push(`/${mode}`);
  };

  return (
    <div style={styles.container}>
      <h1>Výběr módu</h1>
      <div style={styles.buttonContainer}>
        <button onClick={() => goToMode('cti')} style={styles.button}>Čti nahlas čísla</button>
        <button onClick={() => goToMode('cisla')} style={styles.button}>Čísla</button>
        <button onClick={() => goToMode('barvy')} style={styles.button}>Barvy</button>
        <button onClick={() => goToMode('sipky')} style={styles.button}>Šipky</button>
        <button onClick={() => goToMode('priklady')} style={styles.button}>Příklady</button>
        <button onClick={() => goToMode('tecka')} style={styles.button}>Tečka</button>
        <button onClick={() => goToMode('dvetecky')} style={styles.button}>Dvě Tečky</button>
        <button onClick={() => goToMode('sleduj')} style={styles.button}>Sleduj</button>
        <button onClick={() => goToMode('najdi')} style={styles.button}>Najdi</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    color: 'black',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    padding: '2rem',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    cursor: 'pointer',
    borderRadius: '8px',
    border: '2px solid black',
    backgroundColor: '#f0f0f0',
  },
};
