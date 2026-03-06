import { C, Btn, Pill } from "./shared";

export default function HomeScreenComponent({ onNav, showToast }) {
  const cards = [
    { id: "physics", icon: "⚙️", label: "Physics", desc: "Configura física del mundo" },
    { id: "chars", icon: "👥", label: "Personajes", desc: "Crea y gestiona personajes" },
    { id: "create", icon: "✏️", label: "Editor", desc: "Diseña tu juego" },
    { id: "test", icon: "▶️", label: "Test", desc: "Prueba tu juego" },
    { id: "marketing", icon: "📣", label: "Marketing", desc: "Promociona tu creación" },
  ];

  return (
    <div style={{ padding: "1.2rem" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.3rem" }}>
          BIENVENIDO
        </div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", fontWeight: 900, color: C.cyan, letterSpacing: 2 }}>
          GCC Dashboard
        </div>
        <div style={{ fontSize: "0.8rem", color: C.muted, marginTop: "0.3rem" }}>
          Game Comic Crafter — 6-AI Cluster
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={{
        background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.15)",
        borderRadius: 12, padding: "0.8rem 1rem", marginBottom: "1.5rem",
        display: "flex", alignItems: "center", gap: "0.8rem"
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: "0 0 8px #22c55e" }} />
        <span style={{ fontSize: "0.75rem", color: C.text }}>Cluster IA activo</span>
        <Pill color="green" style={{ marginLeft: "auto" }}>Online</Pill>
      </div>

      {/* NAV CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => onNav(card.id)}
            style={{
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 14, padding: "1rem", cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>{card.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: C.text, marginBottom: "0.2rem" }}>{card.label}</div>
            <div style={{ fontSize: "0.7rem", color: C.muted }}>{card.desc}</div>
          </div>
        ))}

        {/* CREATE GAME BIG CARD */}
        <div
          onClick={() => onNav("create")}
          style={{
            gridColumn: "span 2",
            background: "linear-gradient(135deg,rgba(0,245,255,0.08),rgba(124,58,237,0.12))",
            border: "1px solid rgba(0,245,255,0.25)", borderRadius: 14,
            padding: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem"
          }}
        >
          <div style={{ fontSize: "2rem" }}>🎮</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: C.cyan }}>Crear nuevo juego</div>
            <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: "0.2rem" }}>Usa el editor con IA para generar tu proyecto</div>
          </div>
        </div>
      </div>
    </div>
  );
}