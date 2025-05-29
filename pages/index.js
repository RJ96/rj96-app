import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
      router.push('/modes');
    }
  }, []);

  const handleLogin = () => {
    if (password === 'Rj96rj96') {
      sessionStorage.setItem('authenticated', 'true');
      router.push('/modes');
    } else {
      alert('Špatné heslo');
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <h1 style={styles.title}>RJ96</h1>
      <img src="/logo.JPG" alt="Logo" style={styles.logo} />
      <div style={styles.login}>
        <input
          type="password"
          placeholder="Zadej heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Vstoupit</button>
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
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: '4rem',
    marginBottom: '1rem',
    fontFamily: '"Orbitron", sans-serif',
  },
  logo: {
    width: '450px', 
    height: 'auto',
    marginBottom: '2rem',
  },
  login: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    width: '200px',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
