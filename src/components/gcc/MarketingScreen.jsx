import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function MarketingScreen({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.GameProject.list("-updated_date", 10),
      base44.entities.MarketingKit.list("-created_date", 10).catch(() => [])
    ]).then(([projs, k]) => {
      setProjects(projs || []);
      setKits(k || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#5a7090" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📣</div>
        <div style={{ fontSize: "0.75rem", letterSpacing: 2 }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, color: "#c084fc", marginBottom: "1.2rem", letterSpacing: 2 }}>📣 Marketing Kit</div>

      {projects.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#5a7090" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📣</div>
          <div style={{ fontSize: "0.85rem", color: "#e0e8ff", marginBottom: "0.5rem" }}>Sin proyectos disponibles</div>
          <div style={{ fontSize: "0.75rem" }}>Crea un proyecto para generar su kit de marketing</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {projects.map(p => {
            const kit = kits.find(k => k.project_id === p.id);
            return (
              <div key={p.id} style={{
                background: "#160d2e", borderRadius: 12, padding: "1rem",
                border: "1px solid rgba(124,58,237,0.2)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e0e8ff" }}>{p.title}</div>
                    <div style={{ fontSize: "0.65rem", color: "#5a7090", marginTop: 2 }}>{p.genre} · {p.format}</div>
                  </div>
                  <div style={{
                    background: kit ? "rgba(34,197,94,0.12)" : "rgba(124,58,237,0.12)",
                    color: kit ? "#22c55e" : "#c084fc",
                    borderRadius: 20, padding: "2px 8px", fontSize: "0.58rem", fontWeight: 700
                  }}>
                    {kit ? "Kit listo" : "Sin kit"}
                  </div>
                </div>

                {kit && (
                  <div style={{ marginTop: "0.8rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                    {kit.poster_url && (
                      <div style={{ gridColumn: "1/-1" }}>
                        <img src={kit.poster_url} alt="poster" style={{ width: "100%", borderRadius: 8, maxHeight: 120, objectFit: "cover" }} />
                      </div>
                    )}
                    {kit.synopsis_es && (
                      <div style={{ gridColumn: "1/-1", fontSize: "0.7rem", color: "#5a7090", fontStyle: "italic" }}>
                        "{kit.synopsis_es.substring(0, 100)}..."
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => showToast(`📣 Generando kit para ${p.title}...`)}
                  style={{
                    marginTop: "0.8rem", width: "100%", padding: "0.5rem",
                    background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)",
                    borderRadius: 8, color: "#c084fc", fontSize: "0.72rem",
                    fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
                  }}
                >
                  {kit ? "Regenerar Kit" : "Generar Kit de Marketing"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}