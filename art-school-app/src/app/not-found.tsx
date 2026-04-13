import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#8abbb4", gap: "1.5rem" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "3rem 4rem", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
        <h1 style={{ fontSize: "2rem", color: "#111", margin: "1rem 0 2rem" }}>Oops! This page doesn't exist.</h1>
        <Link href="/" style={{ backgroundColor: "#008488", color: "white", textDecoration: "none", padding: "0.75rem 2rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 500 }}>
          ← Back to Map
        </Link>
      </div>
    </div>
  );
}