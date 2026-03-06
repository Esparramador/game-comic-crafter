import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function CharsScreen({ showToast }) {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.GameCharacter.list("-created_date", 20)
      .then(data => setChars(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#5a7090" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
        <div style={{ fontSize: "0.75rem", letterSpacing: 2 }}>Cargando personajes...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, color: "#c084fc", letterSpacing: 2 }}>👥 Personajes</div>
        <button
          onClick={() => showToast("✨ Crear personaje próximamente")}
          style={{
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: 8, padding: "0.4rem 0.8rem", color: "#c084fc",
            fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
          }}
        >+ Nuevo</button>
      </div>

      {chars.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#5a7090" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
          <div style={{ fontSize: "0.85rem", color: "#e0e8ff", marginBottom: "0.5rem" }}>Sin personajes aún</div>
          <div style={{ fontSize: "0.75rem" }}>Crea tu primer personaje</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {chars.map(c => (
            <div key={c.id} style={{
              background: "#160d2e", borderRadius: 12, padding: "0.9rem",
              border: "1px solid rgba(124,58,237,0.2)",
              display: "flex", alignItems: "center", gap: "0.8rem"
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                background: c.concept_image_url
                  ? `url(${c.concept_image_url}) center/cover`
                  : "linear-gradient(135deg,#7c3aed,#e91e8c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.4rem", border: "2px solid rgba(124,58,237,0.4)"
              }}>
                {!c.concept_image_url && "👤"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e0e8ff" }}>{c.name || "Personaje"}</div>
                <div style={{ fontSize: "0.65rem", color: "#5a7090", marginTop: 2 }}>{c.archetype || c.gender || "—"}</div>
                {c.bio && <div style={{ fontSize: "0.62rem", color: "#5a7090", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.bio}</div>}
              </div>
              <div style={{
                background: "rgba(0,245,255,0.08)", color: "#00f5ff",
                borderRadius: 20, padding: "2px 8px", fontSize: "0.58rem",
                fontWeight: 700, textTransform: "uppercase"
              }}>
                {c.behavior_logic || "npc"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}