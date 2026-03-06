export default function PhysicsScreen({ showToast }) {
  return (
    <div style={{ padding: "1.5rem 1rem", color: "#e0e8ff" }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, color: "#c084fc", marginBottom: "1.5rem", letterSpacing: 2 }}>⚙️ Physics Mixer</div>
      <div style={{ display: "grid", gap: "1rem" }}>
        {[
          { label: "Gravedad", value: "9.8 m/s²", icon: "⬇️" },
          { label: "Fricción", value: "0.45", icon: "🌊" },
          { label: "Elasticidad", value: "0.7", icon: "🔁" },
          { label: "Velocidad Máx.", value: "120 km/h", icon: "💨" },
        ].map(item => (
          <div key={item.label} style={{
            background: "#160d2e", borderRadius: 12, padding: "1rem",
            border: "1px solid rgba(124,58,237,0.2)",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e0e8ff" }}>{item.label}</div>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#00f5ff" }}>{item.value}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => showToast("⚙️ Physics actualizados")}
        style={{
          marginTop: "1.5rem", width: "100%", padding: "0.8rem",
          background: "linear-gradient(135deg,#7c3aed,#e91e8c)", border: "none",
          borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: "0.85rem",
          cursor: "pointer", fontFamily: "inherit"
        }}
      >
        Aplicar Physics
      </button>
    </div>
  );
}