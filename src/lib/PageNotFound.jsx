export default function PageNotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0a1e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem"
    }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🐧</div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#e0e8ff", marginBottom: "0.5rem", fontFamily: "'Orbitron', monospace" }}>404</h1>
        <p style={{ fontSize: "1.1rem", color: "#a78bfa", marginBottom: "2rem" }}>Página no encontrada</p>
        <p style={{ fontSize: "0.9rem", color: "#7060a0", marginBottom: "2rem" }}>El GCC Engine no puede localizar esta ruta. Vuelve al inicio o contacta con soporte.</p>
        <a href="/" style={{
          display: "inline-block",
          padding: "0.8rem 2rem",
          background: "linear-gradient(135deg,#7c3aed,#e91e8c)",
          color: "#fff",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "0.95rem"
        }}>
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}