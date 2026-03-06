import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const GENRES = ["Platformer","RPG","Open World","Fighting","Stealth","Arcade","Puzzle","Adventure","MOBA","RTS","MMO"];
const FORMATS = ["2D","3D"];
const ENGINES = ["Phaser.js","Babylon.js","Three.js"];

const C = {
  card:"#160d2e", border:"rgba(124,58,237,0.2)", purple:"#7c3aed",
  cyan:"#00f5ff", pink:"#e91e8c", muted:"#5a7090", text:"#e0e8ff"
};

const inputStyle = {
  width:"100%", background:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(124,58,237,0.25)", borderRadius:8,
  color:C.text, padding:"0.55rem 0.75rem", fontSize:"0.82rem",
  outline:"none", fontFamily:"inherit", boxSizing:"border-box"
};
const labelStyle = {
  fontSize:"0.62rem", color:C.muted, letterSpacing:1,
  textTransform:"uppercase", marginBottom:"0.3rem", display:"block"
};

export default function EditorScreen({ onNav, showToast }) {
  const [view, setView] = useState("list"); // "list" | "create"
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title:"", description:"", genre:"Platformer", format:"2D", engine:"Phaser.js" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.GameProject.list("-updated_date", 20)
      .then(d => setProjects(d || []))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.title.trim()) { showToast("⚠️ Escribe un título", "warning"); return; }
    setSaving(true);
    try {
      const p = await base44.entities.GameProject.create({ ...form, status:"draft" });
      setProjects(prev => [p, ...prev]);
      showToast("✅ Proyecto creado", "success");
      setForm({ title:"", description:"", genre:"Platformer", format:"2D", engine:"Phaser.js" });
      setView("list");
    } catch(e) {
      showToast("❌ Error al crear", "error");
    }
    setSaving(false);
  };

  const STATUS_COLOR = {
    playable: { bg:"rgba(34,197,94,0.12)", color:"#22c55e" },
    draft:    { bg:"rgba(124,58,237,0.12)", color:"#c084fc" },
    generating: { bg:"rgba(255,215,0,0.1)", color:"#ffd700" },
  };

  if (loading) return (
    <div style={{ padding:"3rem", textAlign:"center", color:C.muted }}>
      <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>🎮</div>
      <div style={{ fontSize:"0.75rem", letterSpacing:2 }}>Cargando proyectos...</div>
    </div>
  );

  return (
    <div style={{ padding:"1rem" }}>
      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
        <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:"1rem", fontWeight:900, color:"#c084fc", letterSpacing:2 }}>
          {view === "list" ? "🎮 Mis Juegos" : "✏️ Nuevo Proyecto"}
        </div>
        <button
          onClick={() => setView(view === "list" ? "create" : "list")}
          style={{
            background: view === "list" ? "linear-gradient(135deg,#7c3aed,#e91e8c)" : "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.4)", borderRadius:8,
            padding:"0.4rem 0.9rem", color:"#fff", fontSize:"0.72rem",
            fontWeight:700, cursor:"pointer", fontFamily:"inherit"
          }}
        >
          {view === "list" ? "+ Nuevo" : "← Volver"}
        </button>
      </div>

      {/* LIST */}
      {view === "list" && (
        <>
          {projects.length === 0 ? (
            <div style={{ textAlign:"center", padding:"3rem 1rem", color:C.muted }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🎮</div>
              <div style={{ fontSize:"0.85rem", color:C.text, marginBottom:"0.5rem" }}>Sin proyectos aún</div>
              <button onClick={() => setView("create")} style={{
                background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
                borderRadius:10, padding:"0.7rem 1.5rem", color:"#fff",
                fontWeight:700, fontSize:"0.85rem", cursor:"pointer", fontFamily:"inherit", marginTop:"1rem"
              }}>✏️ Crear Primer Juego</button>
            </div>
          ) : (
            <div style={{ display:"grid", gap:"0.7rem" }}>
              {projects.map(p => {
                const sc = STATUS_COLOR[p.status] || STATUS_COLOR.draft;
                return (
                  <div key={p.id} style={{
                    background:C.card, borderRadius:12, overflow:"hidden",
                    border:`1px solid ${C.border}`, cursor:"pointer",
                    transition:"all 0.2s"
                  }}>
                    {p.cover_image_url && (
                      <img src={p.cover_image_url} alt={p.title} style={{ width:"100%", height:100, objectFit:"cover" }} />
                    )}
                    <div style={{ padding:"0.9rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <div style={{ fontSize:"0.88rem", fontWeight:700, color:C.text }}>{p.title}</div>
                          <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>{p.genre} · {p.format} · {p.engine}</div>
                        </div>
                        <span style={{ ...sc, borderRadius:20, padding:"2px 8px", fontSize:"0.58rem", fontWeight:700 }}>
                          {p.status || "draft"}
                        </span>
                      </div>
                      {p.description && (
                        <div style={{ fontSize:"0.7rem", color:C.muted, marginTop:"0.5rem", overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                          {p.description}
                        </div>
                      )}
                      {p.playable_url && (
                        <a href={p.playable_url} target="_blank" rel="noreferrer" style={{
                          display:"inline-block", marginTop:"0.7rem",
                          background:"rgba(34,197,94,0.12)", color:"#22c55e",
                          border:"1px solid rgba(34,197,94,0.3)", borderRadius:8,
                          padding:"0.35rem 0.8rem", fontSize:"0.68rem", fontWeight:700,
                          textDecoration:"none"
                        }}>▶️ Jugar</a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* CREATE FORM */}
      {view === "create" && (
        <div>
          <div style={{ marginBottom:"0.8rem" }}>
            <label style={labelStyle}>Título del Juego *</label>
            <input style={inputStyle} placeholder="Ej: Ninja Chronicles" value={form.title} onChange={e => set("title", e.target.value)} />
          </div>
          <div style={{ marginBottom:"0.8rem" }}>
            <label style={labelStyle}>Descripción</label>
            <textarea style={{ ...inputStyle, resize:"vertical", height:80 }} placeholder="Describe tu juego..." value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"0.8rem" }}>
            <div>
              <label style={labelStyle}>Género</label>
              <select style={inputStyle} value={form.genre} onChange={e => set("genre", e.target.value)}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Formato</label>
              <select style={inputStyle} value={form.format} onChange={e => set("format", e.target.value)}>
                {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:"1.2rem" }}>
            <label style={labelStyle}>Motor</label>
            <select style={inputStyle} value={form.engine} onChange={e => set("engine", e.target.value)}>
              {ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              width:"100%", padding:"0.85rem",
              background: saving ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#e91e8c)",
              border:"none", borderRadius:10, color:"#fff",
              fontWeight:700, fontSize:"0.9rem", cursor: saving ? "not-allowed" : "pointer",
              fontFamily:"inherit"
            }}
          >
            {saving ? "Creando..." : "🎮 Crear Proyecto"}
          </button>
        </div>
      )}
    </div>
  );
}
