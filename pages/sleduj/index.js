import Link from "next/link";

export default function SledujIndex() {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Sleduj – Výběr módu</h1>
      <div style={{ marginTop: 20 }}>
        <Link href="/sleduj/hra">
          <a style={{ marginRight: 20, fontSize: 18, textDecoration: "underline", cursor: "pointer" }}>
            Hrát hru
          </a>
        </Link>
        <Link href="/sleduj/nastaveni">
          <a style={{ fontSize: 18, textDecoration: "underline", cursor: "pointer" }}>
            Nastavení
          </a>
        </Link>
      </div>
    </div>
  );
}
