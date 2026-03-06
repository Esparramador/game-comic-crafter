import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, Btn, Pill } from "./shared";

export default function TestScreen({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.GameProject.filter({ status: "playable" }, "-updated_date", 10)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "1.2rem" }}>
      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.2rem" }}>MÓDULO</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.cyan }}>▶️ Test & Play</div>
      </div>

      {selected ? (
        <div>
          <Btn variant="ghost" onClick={() => setSelected(null)} style={{ marginBottom: "1rem" }}>← Volver</Btn>
          <div style={{
            background: "#000", borderRadius: 14, overflow: "hidden",
            border: "1px solid rgba(0,245,255,0.2)", aspectRatio: "16/9",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {selected.playable_url ? (
              <iframe src={selected.playable_url} style={{ width: "100%", height: "100%", border: "none" }} title="Game Preview" />
            ) : (
              <div style={{ color: C.muted, fontSize: "0.8rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎮</div>
                Sin URL de juego aún
              </div>
            )}
          </div>
          <div style={{ marginTop: "0.8rem", fontWeight: 700, color: C.text }}>{selected.title}</div>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", color: C.muted, padding: "2rem", fontSize: "0.8rem" }}>Cargando...</div>
      ) : projects.length === 0 ? (
        <div style={{
          background: "rgba(124,58,237,0.06)", border: "1px dashed rgba(124,58,237,0.3)",
          borderRadius: 14, padding: "2rem", textAlign: "center"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>▶️</div>
          <div style={{ color: C.muted, fontSize: "0.8rem" }}>No hay juegos jugables aún.<br />Genera un juego en el Editor.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {projects.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 12, padding: "0.9rem", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.8rem"
            }}>
              <div style={{ fontSize: "1.5rem" }}>🎮</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: C.text }}>{p.title}</div>
                <div style={{ fontSize: "0.68rem", color: C.muted }}>{p.genre} · {p.format}</div>
              </div>
              <Pill color="green">Jugar</Pill>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}