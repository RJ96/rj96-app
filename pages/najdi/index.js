import { useState } from "react";
import { useRouter } from "next/router";

export default function NajdiNastaveni() {
  const [pocetKol, setPocetKol] = useState(20);
  const router = useRouter();

  const startHra = () => {
    router.push(`/najdi/hra?pocetKol=${pocetKol}`);
  };

  return (
    <div style={styles.wrapper}>
      <h1>Nastavení hry</h1>
      <label>Počet kol (1–50):</label>
      <input
        type="number"
        min="1"
        max="50"
        value={pocetKol}
        onChange={(e) => setPocetKol(parseInt(e.target.value))}
        style={styles.input}
      />
      <br />
      <button onClick={startHra} style={styles.button}>Start</button>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#D2C7B0",
    minHeight: "100vh",
    padding: "30px",
    textAlign: "center",
  },
  input: {
    fontSize: "20px",
    padding: "5px",
    width: "80px",
    textAlign: "center",
    margin: "10px",
  },
  button: {
    fontSize: "20px",
    padding: "10px 20px",
    cursor: "pointer",
  },
};
