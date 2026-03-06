import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, Btn, InputField, Pill } from "./shared";

export default function EditorScreen({ onNav, showToast }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", genre: "Platformer", format: "2D" });

  useEffect(() => {
    base44.entities.GameProject.list("-created_date", 10)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.title) { showToast("Escribe un título"); return; }
    setCreating(true);
    try {
      await base44.entities.GameProject.create({ ...form, status: "draft" });
      const list = await base44.entities.GameProject.list("-created_date", 10);
      setProjects(list);
      setForm({ title: "", description: "", genre: "Platformer", format: "2D" });
      showToast("Proyecto creado ✓");
    } finally {
      setCreating(false);
    }
  };

  const GENRES = ["Platformer","RPG","Open World","Fighting","Stealth","Arcade","Puzzle","Adventure"];

  return (
    <div style={{ padding: "1.2rem" }}>
      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.2rem" }}>MÓDULO</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.cyan }}>✏️ Editor de Proyectos</div>
      </div>

      {/* CREATE FORM */}
      <div style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.12)", borderRadius: 14, padding: "1rem", marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.7rem", color: C.muted, marginBottom: "0.8rem", textTransform: "uppercase", letterSpacing: 1 }}>Nuevo proyecto</div>
        <InputField label="Título" placeholder="Mi juego épico..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        <InputField label="Descripción" as="textarea" placeholder="Una aventura..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        <div style={{ marginBottom: "0.6rem" }}>
          <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.3rem" }}>Género</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {GENRES.map(g => (
              <button key={g} onClick={() => setForm(f => ({ ...f, genre: g }))} style={{
                background: form.genre === g ? "rgba(0,245,255,0.15)" : "rgba(255,255,255,0.04)",
                border: form.genre === g ? "1px solid rgba(0,245,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                color: form.genre === g ? C.cyan : C.muted,
                borderRadius: 20, padding: "3px 10px", fontSize: "0.65rem", cursor: "pointer", fontFamily: "inherit"
              }}>{g}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
          {["2D","3D"].map(fmt => (
            <button key={fmt} onClick={() => setForm(f => ({ ...f, format: fmt }))} style={{
              flex: 1, background: form.format === fmt ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)",
              border: form.format === fmt ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
              color: form.format === fmt ? "#a78bfa" : C.muted,
              borderRadius: 8, padding: "0.45rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit"
            }}>{fmt}</button>
          ))}
        </div>
        <Btn variant="primary" full onClick={handleCreate}>{creating ? "Creando..." : "🚀 Crear proyecto"}</Btn>
      </div>

      {/* PROJECTS LIST */}
      <div style={{ fontSize: "0.7rem", color: C.muted, marginBottom: "0.7rem", textTransform: "uppercase", letterSpacing: 1 }}>Mis proyectos</div>
      {loading ? (
        <div style={{ textAlign: "center", color: C.muted, padding: "1rem", fontSize: "0.8rem" }}>Cargando...</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: "center", color: C.muted, fontSize: "0.8rem", padding: "1rem" }}>Aún no hay proyectos</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {projects.map(p => (
            <div key={p.id} style={{
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 12, padding: "0.9rem", display: "flex", alignItems: "center", gap: "0.8rem"
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: C.text, marginBottom: "0.2rem" }}>{p.title}</div>
                <div style={{ fontSize: "0.68rem", color: C.muted }}>{p.genre} · {p.format}</div>
              </div>
              <Pill color={p.status === "playable" ? "green" : p.status === "generating" ? "gold" : "purple"}>{p.status}</Pill>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}