import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function TestScreen({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.GameProject.filter({ status: "playable" }, "-updated_date", 10)
      .then(data => setProjects(data || []));
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, color: "#c084fc", marginBottom: "1.2rem", letterSpacing: 2 }}>▶️ Test & Play</div>

      {projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#5a7090" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎮</div>
          <div style={{ fontSize: "0.85rem", color: "#e0e8ff", marginBottom: "0.5rem" }}>Sin juegos listos</div>
          <div style={{ fontSize: "0.75rem" }}>Genera un juego en el Editor primero</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {projects.map(p => (
            <div key={p.id} style={{
              background: "#160d2e", borderRadius: 12, padding: "1rem",
              border: `1px solid ${selected?.id === p.id ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.2)"}`,
              cursor: "pointer"
            }} onClick={() => setSelected(p)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e0e8ff" }}>{p.title}</div>
                  <div style={{ fontSize: "0.65rem", color: "#5a7090", marginTop: 2 }}>{p.genre} · {p.format} · {p.engine}</div>
                </div>
                <span style={{ fontSize: "1.5rem" }}>▶️</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected?.playable_url && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{ fontSize: "0.62rem", color: "#5a7090", letterSpacing: 1, marginBottom: "0.5rem" }}>JUGANDO: {selected.title}</div>
          <iframe
            src={selected.playable_url}
            style={{ width: "100%", height: 300, border: "1px solid rgba(124,58,237,0.3)", borderRadius: 12 }}
            title="game"
          />
        </div>
      )}
    </div>
  );
}