import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, Btn, Pill } from "./shared";

export default function MarketingScreen({ showToast }) {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.MarketingKit.list("-created_date", 10)
      .then(setKits)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "1.2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
        <div>
          <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.2rem" }}>MÓDULO</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.cyan }}>📣 Marketing</div>
        </div>
        <Btn variant="primary" onClick={() => showToast("Generando kit de marketing...")}>+ Generar</Btn>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.2rem" }}>
        {[
          { icon: "🎨", label: "Poster IA", action: "Generando poster..." },
          { icon: "🎬", label: "Tráiler", action: "Generando tráiler..." },
          { icon: "📝", label: "Sinopsis", action: "Generando sinopsis..." },
          { icon: "🏷️", label: "SEO Tags", action: "Generando tags..." },
        ].map(a => (
          <div key={a.label} onClick={() => showToast(a.action)} style={{
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 10, padding: "0.8rem", cursor: "pointer", textAlign: "center"
          }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "0.3rem" }}>{a.icon}</div>
            <div style={{ fontSize: "0.72rem", color: C.text, fontWeight: 600 }}>{a.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "0.7rem", color: C.muted, marginBottom: "0.7rem", textTransform: "uppercase", letterSpacing: 1 }}>Kits generados</div>
      {loading ? (
        <div style={{ textAlign: "center", color: C.muted, padding: "1rem", fontSize: "0.8rem" }}>Cargando...</div>
      ) : kits.length === 0 ? (
        <div style={{
          background: "rgba(124,58,237,0.06)", border: "1px dashed rgba(124,58,237,0.3)",
          borderRadius: 14, padding: "2rem", textAlign: "center"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📣</div>
          <div style={{ color: C.muted, fontSize: "0.8rem" }}>Aún no hay kits de marketing</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {kits.map(k => (
            <div key={k.id} style={{
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 12, padding: "0.9rem", display: "flex", alignItems: "center", gap: "0.8rem"
            }}>
              <div style={{ fontSize: "1.3rem" }}>📦</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", color: C.text }}>Kit #{k.id.slice(-6)}</div>
                <div style={{ fontSize: "0.68rem", color: C.muted }}>{k.status}</div>
              </div>
              <Pill color={k.status === "published" ? "green" : k.status === "ready" ? "cyan" : "purple"}>{k.status}</Pill>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}