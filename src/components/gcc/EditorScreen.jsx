import { useState } from "react";
import { base44 } from "@/api/base44Client";

const GENRES = ["Platformer", "RPG", "Open World", "Fighting", "Stealth", "Arcade", "Puzzle", "Adventure"];
const FORMATS = ["2D", "3D"];
const ENGINES = ["Phaser.js", "Babylon.js", "Three.js"];

export default function EditorScreen({ onNav, showToast }) {
  const [form, setForm] = useState({
    title: "", description: "", genre: "Platformer", format: "2D", engine: "Phaser.js"
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.title.trim()) { showToast("⚠️ Escribe un título"); return; }
    setSaving(true);
    await base44.entities.GameProject.create({ ...form, status: "draft" });
    showToast("✅ Proyecto creado");
    setSaving(false);
    onNav("home");
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8,
    color: "#e0e8ff", padding: "0.55rem 0.75rem", fontSize: "0.82rem",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box"
  };
  const labelStyle = { fontSize: "0.62rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.3rem", display: "block" };

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, color: "#c084fc", marginBottom: "1.2rem", letterSpacing: 2 }}>✏️ Nuevo Proyecto</div>

      <div style={{ marginBottom: "0.8rem" }}>
        <label style={labelStyle}>Título del Juego</label>
        <input style={inputStyle} placeholder="Ej: Ninja Chronicles" value={form.title} onChange={e => set("title", e.target.value)} />
      </div>

      <div style={{ marginBottom: "0.8rem" }}>
        <label style={labelStyle}>Descripción</label>
        <textarea style={{ ...inputStyle, resize: "vertical", height: 80 }} placeholder="Describe tu juego..." value={form.description} onChange={e => set("description", e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.8rem" }}>
        <div>
          <label style={labelStyle}>Género</label>
          <select style={{ ...inputStyle }} value={form.genre} onChange={e => set("genre", e.target.value)}>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Formato</label>
          <select style={{ ...inputStyle }} value={form.format} onChange={e => set("format", e.target.value)}>
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "1.2rem" }}>
        <label style={labelStyle}>Motor</label>
        <select style={{ ...inputStyle }} value={form.engine} onChange={e => set("engine", e.target.value)}>
          {ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <button
        onClick={handleCreate}
        disabled={saving}
        style={{
          width: "100%", padding: "0.85rem",
          background: saving ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#e91e8c)",
          border: "none", borderRadius: 10, color: "#fff",
          fontWeight: 700, fontSize: "0.9rem", cursor: saving ? "not-allowed" : "pointer",
          fontFamily: "inherit"
        }}
      >
        {saving ? "Creando..." : "🎮 Crear Proyecto"}
      </button>
    </div>
  );
}