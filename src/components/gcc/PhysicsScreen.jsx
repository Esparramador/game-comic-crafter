import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, Spinner, EmptyState, inputStyle, labelStyle } from "./shared";

const PRESETS = [
  { name:"Plataformero", gravity:9.8,  friction:0.35, elasticity:0.3,  speed:60,  icon:"🍄", atmosphere:"normal",           combat_system:"action" },
  { name:"Diablo/Hordas",gravity:12,   friction:0.5,  elasticity:0.1,  speed:80,  icon:"💀", atmosphere:"dark",             combat_system:"hack-n-slash" },
  { name:"Open World",   gravity:9.8,  friction:0.4,  elasticity:0.4,  speed:120, icon:"🌍", atmosphere:"fantasy",          combat_system:"real-time" },
  { name:"Arcade",       gravity:15,   friction:0.2,  elasticity:0.8,  speed:200, icon:"⚡", atmosphere:"cyberpunk",        combat_system:"action" },
  { name:"RPG Turnos",   gravity:9.8,  friction:0.6,  elasticity:0.2,  speed:40,  icon:"⚔️", atmosphere:"fantasy",          combat_system:"turn-based" },
  { name:"Space 0G",     gravity:0.1,  friction:0.05, elasticity:0.95, speed:300, icon:"🚀", atmosphere:"space",            combat_system:"real-time" },
];

const ATMOSPHERES = ["normal","dark","cyberpunk","fantasy","sci-fi","post-apocalyptic","underwater","space","dark_fantasy_cyberpunk"];
const COMBATS = ["action","turn-based","real-time","stealth","puzzle","hack-n-slash","tactical","moba","rts"];

const DEFAULT_PHYSICS = { gravity:9.8, friction:0.4, elasticity:0.5, speed:100 };

function parseWorldPhysics(raw) {
  if (!raw) return DEFAULT_PHYSICS;
  if (typeof raw === "object") return { ...DEFAULT_PHYSICS, ...raw };
  try { return { ...DEFAULT_PHYSICS, ...JSON.parse(raw) }; } catch(_) { return DEFAULT_PHYSICS; }
}

export default function PhysicsScreen({ onNav, showToast }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [physics, setPhysics] = useState(DEFAULT_PHYSICS);
  const [atmosphere, setAtmosphere] = useState("normal");
  const [combat, setCombat] = useState("action");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.GameProject.list("-updated_date", 20)
      .then(d => {
        const list = d || [];
        setProjects(list);
        if (list[0]) selectProject(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function selectProject(p) {
    setSelected(p);
    setPhysics(parseWorldPhysics(p.world_physics));
    setAtmosphere(p.atmosphere || "normal");
    setCombat(p.combat_system || "action");
  }

  const applyPreset = (pr) => {
    setPhysics({ gravity:pr.gravity, friction:pr.friction, elasticity:pr.elasticity, speed:pr.speed });
    setAtmosphere(pr.atmosphere);
    setCombat(pr.combat_system);
    showToast(`⚙️ Preset "${pr.name}" aplicado`, "success");
  };

  const handleSave = async () => {
    if (!selected) { showToast("⚠️ Selecciona un proyecto", "warning"); return; }
    setSaving(true);
    try {
      await base44.entities.GameProject.update(selected.id, {
        world_physics: JSON.stringify(physics),
        atmosphere,
        combat_system: combat,
      });
      showToast("✅ Physics guardados correctamente", "success");
    } catch(e) {
      console.error(e);
      showToast("❌ Error al guardar physics", "error");
    }
    setSaving(false);
  };

  const setP = (k, v) => setPhysics(p => ({ ...p, [k]: v }));

  if (loading) return <Spinner />;

  return (
    <div style={{ padding:"1rem" }}>

      {/* BACK */}
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      <SectionTitle>⚙️ Physics Mixer</SectionTitle>

      {projects.length === 0 ? (
        <EmptyState icon="⚙️" title="Sin proyectos" sub="Crea un proyecto primero" action="✏️ Crear Proyecto" onAction={() => onNav("create")} />
      ) : (
        <>
          {/* PROYECTO SELECTOR */}
          <div style={{ marginBottom:"1rem" }}>
            <label style={labelStyle}>Proyecto activo</label>
            <select style={inputStyle} value={selected?.id || ""} onChange={e => {
              const p = projects.find(pr => pr.id === e.target.value);
              if (p) selectProject(p);
            }}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          {/* INFO del proyecto actual */}
          {selected && (
            <div style={{ background:C.card2, borderRadius:10, padding:"0.7rem 0.9rem", marginBottom:"1rem", border:`1px solid ${C.border}`, display:"flex", gap:"0.8rem", alignItems:"center" }}>
              <span style={{ fontSize:"1.4rem" }}>🎮</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.78rem", fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.title}</div>
                <div style={{ fontSize:"0.62rem", color:C.muted }}>{selected.genre} · {selected.format} · {selected.engine}</div>
              </div>
              <span style={{ fontSize:"0.6rem", color:"#22c55e", fontWeight:700, background:"rgba(34,197,94,0.1)", borderRadius:20, padding:"2px 8px", border:"1px solid rgba(34,197,94,0.3)", whiteSpace:"nowrap" }}>
                {selected.status || "draft"}
              </span>
            </div>
          )}

          {/* PRESETS */}
          <div style={{ marginBottom:"1.2rem" }}>
            <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>Presets rápidos</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem" }}>
              {PRESETS.map(pr => (
                <button key={pr.name} onClick={() => applyPreset(pr)} style={{
                  background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
                  borderRadius:10, padding:"0.55rem 0.3rem", cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                  color:"#c084fc", fontSize:"0.58rem", fontWeight:700, fontFamily:"inherit",
                  transition:"all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(124,58,237,0.2)"; e.currentTarget.style.borderColor="rgba(124,58,237,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(124,58,237,0.08)"; e.currentTarget.style.borderColor=C.border; }}
                >
                  <span style={{ fontSize:"1.3rem" }}>{pr.icon}</span>
                  {pr.name}
                </button>
              ))}
            </div>
          </div>

          {/* SLIDERS */}
          <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
            <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.9rem" }}>Parámetros Físicos</div>
            {[
              { label:"Gravedad", field:"gravity", min:0, max:20, step:0.1, unit:" m/s²" },
              { label:"Fricción", field:"friction", min:0, max:1, step:0.01, unit:"" },
              { label:"Elasticidad", field:"elasticity", min:0, max:1, step:0.01, unit:"" },
              { label:"Velocidad Máx.", field:"speed", min:10, max:500, step:5, unit:" km/h" },
            ].map(sl => (
              <div key={sl.field} style={{ marginBottom:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.25rem" }}>
                  <span style={{ fontSize:"0.72rem", color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{sl.label}</span>
                  <span style={{ fontSize:"0.78rem", color:C.cyan, fontWeight:800 }}>{physics[sl.field]}{sl.unit}</span>
                </div>
                <input
                  type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={physics[sl.field]}
                  onChange={e => setP(sl.field, parseFloat(e.target.value))}
                  style={{ width:"100%", accentColor:C.purple, cursor:"pointer", height:4 }}
                />
              </div>
            ))}
          </div>

          {/* ATMÓSFERA + COMBATE */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"1rem" }}>
            <div>
              <label style={labelStyle}>Atmósfera</label>
              <select style={inputStyle} value={atmosphere} onChange={e => setAtmosphere(e.target.value)}>
                {ATMOSPHERES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Combate</label>
              <select style={inputStyle} value={combat} onChange={e => setCombat(e.target.value)}>
                {COMBATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* RESUMEN VISUAL */}
          <div style={{ background:C.card2, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
            <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>Resumen</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.4rem", textAlign:"center" }}>
              {[
                { label:"Gravedad", val:physics.gravity, unit:"m/s²", color:C.cyan },
                { label:"Fricción", val:physics.friction, unit:"", color:"#c084fc" },
                { label:"Elastic.", val:physics.elasticity, unit:"", color:C.pink },
                { label:"Velocidad", val:physics.speed, unit:"km/h", color:C.gold },
              ].map(s => (
                <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"0.5rem 0.2rem" }}>
                  <div style={{ fontSize:"0.9rem", fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:"0.5rem", color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:"0.6rem", display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              <span style={{ fontSize:"0.65rem", color:"#c084fc", background:"rgba(124,58,237,0.1)", borderRadius:20, padding:"2px 10px" }}>🌍 {atmosphere}</span>
              <span style={{ fontSize:"0.65rem", color:C.cyan, background:"rgba(0,245,255,0.08)", borderRadius:20, padding:"2px 10px" }}>⚔️ {combat}</span>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving || !selected} style={{
            width:"100%", padding:"0.9rem",
            background: (saving || !selected) ? "rgba(124,58,237,0.25)" : "linear-gradient(135deg,#7c3aed,#e91e8c)",
            border:"none", borderRadius:12, color:"#fff",
            fontWeight:800, fontSize:"0.9rem",
            cursor: (saving || !selected) ? "not-allowed" : "pointer",
            fontFamily:"inherit", letterSpacing:1
          }}>
            {saving ? "Guardando..." : "⚙️ Guardar Physics"}
          </button>
        </>
      )}
    </div>
  );
}
