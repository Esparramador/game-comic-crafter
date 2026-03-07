import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, Spinner, EmptyState, inputStyle, labelStyle } from "./shared";

const PRESETS = [
  { name:"Plataformero Clásico", gravity:9.8, friction:0.35, elasticity:0.3, speed:60, icon:"🍄" },
  { name:"Diablo / Hordas",      gravity:12,  friction:0.5,  elasticity:0.1, speed:80, icon:"💀" },
  { name:"Open World AAA",       gravity:9.8, friction:0.4,  elasticity:0.4, speed:120, icon:"🌍" },
  { name:"Arcade Rápido",        gravity:15,  friction:0.2,  elasticity:0.8, speed:200, icon:"⚡" },
  { name:"RPG Turn-Based",       gravity:9.8, friction:0.6,  elasticity:0.2, speed:40, icon:"⚔️" },
  { name:"Space / Zero-G",       gravity:0.1, friction:0.05, elasticity:0.95,speed:300, icon:"🚀" },
];

export default function PhysicsScreen({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [physics, setPhysics] = useState({ gravity:9.8, friction:0.4, elasticity:0.5, speed:100, atmosphere:"normal", combat_system:"action" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.GameProject.list("-updated_date", 20)
      .then(d => {
        setProjects(d||[]);
        if (d && d[0]) {
          setSelected(d[0]);
          if (d[0].world_physics) {
            try { setPhysics(p => ({ ...p, ...JSON.parse(d[0].world_physics) })); } catch(e){}
          }
          if (d[0].atmosphere) setPhysics(p => ({ ...p, atmosphere: d[0].atmosphere }));
          if (d[0].combat_system) setPhysics(p => ({ ...p, combat_system: d[0].combat_system }));
        }
      }).finally(() => setLoading(false));
  }, []);

  const applyPreset = (preset) => {
    setPhysics(p => ({ ...p, gravity:preset.gravity, friction:preset.friction, elasticity:preset.elasticity, speed:preset.speed }));
    showToast(`⚙️ Preset "${preset.name}" aplicado`, "success");
  };

  const handleSave = async () => {
    if (!selected) { showToast("⚠️ Selecciona un proyecto", "warning"); return; }
    setSaving(true);
    try {
      await base44.entities.GameProject.update(selected.id, {
        world_physics: JSON.stringify({ gravity:physics.gravity, friction:physics.friction, elasticity:physics.elasticity, speed:physics.speed }),
        atmosphere: physics.atmosphere,
        combat_system: physics.combat_system,
      });
      setProjects(prev => prev.map(p => p.id===selected.id ? { ...p, atmosphere:physics.atmosphere, combat_system:physics.combat_system } : p));
      showToast("✅ Physics guardados", "success");
    } catch(e) { showToast("❌ Error al guardar", "error"); }
    setSaving(false);
  };

  const setP = (k, v) => setPhysics(p => ({ ...p, [k]: v }));

  const SliderField = ({ label, field, min, max, step=0.01, unit="" }) => (
    <div style={{ marginBottom:"0.8rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
        <label style={{ ...labelStyle, margin:0 }}>{label}</label>
        <span style={{ fontSize:"0.72rem", color:C.cyan, fontWeight:700 }}>{physics[field]}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={physics[field]}
        onChange={e => setP(field, parseFloat(e.target.value))}
        style={{ width:"100%", accentColor:C.purple, cursor:"pointer" }}
      />
    </div>
  );

  if (loading) return <Spinner />;

  return (
    <div style={{ padding:"1rem" }}>
      <SectionTitle>⚙️ Physics Mixer</SectionTitle>

      {/* Selector de proyecto */}
      {projects.length > 0 && (
        <div style={{ marginBottom:"1rem" }}>
          <label style={labelStyle}>Proyecto</label>
          <select style={inputStyle} value={selected?.id||""} onChange={e => {
            const p = projects.find(pr => pr.id===e.target.value);
            setSelected(p||null);
            if (p?.world_physics) {
              try { setPhysics(prev => ({ ...prev, ...JSON.parse(p.world_physics) })); } catch(er){}
            }
          }}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
      )}

      {projects.length === 0 && (
        <EmptyState icon="⚙️" title="Sin proyectos" sub="Crea un proyecto primero para configurar su física" />
      )}

      {/* PRESETS */}
      <div style={{ marginBottom:"1.2rem" }}>
        <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>Presets</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem" }}>
          {PRESETS.map(pr => (
            <button key={pr.name} onClick={() => applyPreset(pr)} style={{
              background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
              borderRadius:10, padding:"0.5rem 0.3rem", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              color:"#c084fc", fontSize:"0.58rem", fontWeight:700, fontFamily:"inherit",
              transition:"all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(124,58,237,0.08)"}
            >
              <span style={{ fontSize:"1.2rem" }}>{pr.icon}</span>
              {pr.name}
            </button>
          ))}
        </div>
      </div>

      {/* SLIDERS */}
      <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.8rem" }}>Parámetros Físicos</div>
        <SliderField label="Gravedad" field="gravity" min={0} max={20} step={0.1} unit=" m/s²" />
        <SliderField label="Fricción" field="friction" min={0} max={1} step={0.01} />
        <SliderField label="Elasticidad" field="elasticity" min={0} max={1} step={0.01} />
        <SliderField label="Velocidad Máx." field="speed" min={10} max={500} step={5} unit=" km/h" />
      </div>

      {/* ATMÓSFERA / COMBATE */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"1.2rem" }}>
        <div>
          <label style={labelStyle}>Atmósfera</label>
          <select style={inputStyle} value={physics.atmosphere} onChange={e => setP("atmosphere", e.target.value)}>
            {["normal","dark","cyberpunk","fantasy","sci-fi","post-apocalyptic","underwater","space"].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Sistema de Combate</label>
          <select style={inputStyle} value={physics.combat_system} onChange={e => setP("combat_system", e.target.value)}>
            {["action","turn-based","real-time","stealth","puzzle","hack-n-slash","tactical"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* RESUMEN */}
      <div style={{ background:C.card2, borderRadius:12, padding:"0.8rem", border:`1px solid ${C.border}`, marginBottom:"1rem", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.4rem", textAlign:"center" }}>
        {[
          { label:"Gravedad", val:`${physics.gravity}`, unit:"m/s²" },
          { label:"Fricción", val:physics.friction, unit:"" },
          { label:"Elastic.", val:physics.elasticity, unit:"" },
          { label:"Velocidad", val:physics.speed, unit:"km/h" },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize:"0.85rem", fontWeight:800, color:C.cyan }}>{s.val}<span style={{ fontSize:"0.55rem" }}>{s.unit}</span></div>
            <div style={{ fontSize:"0.55rem", color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving||!selected} style={{
        width:"100%", padding:"0.85rem",
        background: (!selected||saving) ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#e91e8c)",
        border:"none", borderRadius:10, color:"#fff",
        fontWeight:700, fontSize:"0.9rem", cursor:(!selected||saving) ? "not-allowed" : "pointer", fontFamily:"inherit"
      }}>{saving ? "Guardando..." : "⚙️ Guardar Physics"}</button>
    </div>
  );
}
