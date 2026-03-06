import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, Btn, Pill } from "./shared";

export default function CharsScreen({ showToast }) {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.GameCharacter.list("-created_date", 20)
      .then(setChars)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
        <div>
          <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.2rem" }}>MÓDULO</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.cyan }}>👥 Personajes</div>
        </div>
        <Btn variant="primary" onClick={() => showToast("Crear personaje próximamente")}>+ Nuevo</Btn>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: C.muted, padding: "2rem", fontSize: "0.8rem" }}>Cargando...</div>
      ) : chars.length === 0 ? (
        <div style={{
          background: "rgba(124,58,237,0.06)", border: "1px dashed rgba(124,58,237,0.3)",
          borderRadius: 14, padding: "2rem", textAlign: "center"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
          <div style={{ color: C.muted, fontSize: "0.8rem" }}>No hay personajes aún</div>
          <Btn variant="outline" style={{ marginTop: "1rem" }} onClick={() => showToast("Crea tu primer personaje")}>Crear personaje</Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {chars.map(c => (
            <div key={c.id} style={{
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 12, padding: "0.9rem", display: "flex", alignItems: "center", gap: "0.8rem"
            }}>
              {c.concept_image_url
                ? <img src={c.concept_image_url} alt={c.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                : <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(0,245,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>🧑</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: C.text }}>{c.name || "Sin nombre"}</div>
                <div style={{ fontSize: "0.7rem", color: C.muted, marginTop: "0.2rem" }}>{c.archetype || c.gender || "—"}</div>
              </div>
              <Pill color={c.identity_locked ? "green" : "purple"}>{c.identity_locked ? "Locked" : "Draft"}</Pill>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}