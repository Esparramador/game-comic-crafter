import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, EmptyState, Spinner, Pill, inputStyle, labelStyle } from "./shared";

const ARCHETYPES = ["Guerrero","Mago","Arquero","Asesino","Soporte","Tank","Trickster","Sabio","Héroe","Villano"];
const GENDERS = ["Masculino","Femenino","No binario","Desconocido"];
const BEHAVIORS = ["player","npc","boss","ally","enemy","neutral"];

export default function CharsScreen({ onNav, showToast }) {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | detail | create
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name:"", gender:"Masculino", archetype:"Guerrero", bio:"", behavior_logic:"npc", role_in_story:"" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.GameCharacter.list("-created_date", 50)
      .then(d => setChars(d||[]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = async () => {
    if (!form.name.trim()) { showToast("⚠️ El nombre es obligatorio", "warning"); return; }
    setSaving(true);
    try {
      const c = await base44.entities.GameCharacter.create(form);
      setChars(prev => [c, ...prev]);
      showToast("✅ Personaje creado", "success");
      setForm({ name:"", gender:"Masculino", archetype:"Guerrero", bio:"", behavior_logic:"npc", role_in_story:"" });
      setView("list");
    } catch(e) { showToast("❌ Error al crear", "error"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este personaje?")) return;
    setDeleting(true);
    try {
      await base44.entities.GameCharacter.delete(id);
      setChars(prev => prev.filter(c => c.id !== id));
      showToast("🗑️ Personaje eliminado", "info");
      setView("list");
      setSelected(null);
    } catch(e) { showToast("❌ Error al eliminar", "error"); }
    setDeleting(false);
  };

  if (loading) return <Spinner />;

  // DETAIL VIEW
  if (view === "detail" && selected) return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => { setView("list"); setSelected(null); }} style={{
        background:"rgba(124,58,237,0.1)", border:`1px solid ${C.border}`, borderRadius:8,
        padding:"0.4rem 0.8rem", color:"#c084fc", fontSize:"0.72rem",
        fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginBottom:"1rem"
      }}>← Volver</button>

      <div style={{ background:C.card, borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}` }}>
        {/* Avatar grande */}
        <div style={{
          height:160,
          background: selected.concept_image_url
            ? `url(${selected.concept_image_url}) center/cover`
            : "linear-gradient(135deg,#7c3aed,#e91e8c)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"4rem"
        }}>
          {!selected.concept_image_url && "👤"}
        </div>

        <div style={{ padding:"1rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
            <div>
              <div style={{ fontSize:"1.1rem", fontWeight:800, color:C.text }}>{selected.name}</div>
              <div style={{ fontSize:"0.7rem", color:C.muted, marginTop:2 }}>{selected.gender} · {selected.archetype}</div>
            </div>
            <Pill color={selected.behavior_logic==="player"?"pink":selected.behavior_logic==="boss"?"red":"cyan"}>
              {selected.behavior_logic||"npc"}
            </Pill>
          </div>

          {selected.role_in_story && (
            <div style={{ marginBottom:"0.8rem" }}>
              <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Rol en la historia</div>
              <div style={{ fontSize:"0.78rem", color:C.text }}>{selected.role_in_story}</div>
            </div>
          )}

          {selected.bio && (
            <div style={{ marginBottom:"0.8rem" }}>
              <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Biografía</div>
              <div style={{ fontSize:"0.75rem", color:C.text, lineHeight:1.5 }}>{selected.bio}</div>
            </div>
          )}

          {/* Assets del personaje */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.5rem", marginBottom:"1rem" }}>
            {[
              { label:"Modelo 3D", value: selected.model_3d_glb_url, icon:"🏺", url: selected.model_3d_glb_url },
              { label:"Voz", value: selected.voice_audio_url, icon:"🎙️", url: selected.voice_audio_url },
              { label:"Sprite", value: selected.sprite_sheet_url, icon:"🎨", url: selected.sprite_sheet_url },
            ].map(a => (
              <a key={a.label} href={a.url||undefined} target="_blank" rel="noreferrer"
                style={{
                  display:"block", textDecoration:"none",
                  background: a.value ? "rgba(34,197,94,0.08)" : "rgba(124,58,237,0.06)",
                  border: `1px solid ${a.value ? "rgba(34,197,94,0.3)" : C.border}`,
                  borderRadius:10, padding:"0.6rem", textAlign:"center",
                  cursor: a.value ? "pointer" : "default"
                }}>
                <div style={{ fontSize:"1.2rem", marginBottom:3 }}>{a.icon}</div>
                <div style={{ fontSize:"0.58rem", color: a.value ? C.green : C.muted, fontWeight:700 }}>
                  {a.value ? "Ver" : "—"}
                </div>
                <div style={{ fontSize:"0.55rem", color:C.muted }}>{a.label}</div>
              </a>
            ))}
          </div>

          {/* Acciones */}
          <div style={{ display:"flex", gap:"0.5rem" }}>
            {selected.model_3d_glb_url && (
              <a href={selected.model_3d_glb_url} target="_blank" rel="noreferrer" style={{
                flex:1, textAlign:"center", background:"rgba(0,245,255,0.08)",
                border:"1px solid rgba(0,245,255,0.3)", borderRadius:8,
                padding:"0.55rem", color:C.cyan, fontSize:"0.72rem",
                fontWeight:700, textDecoration:"none"
              }}>🏺 GLB</a>
            )}
            {selected.voice_audio_url && (
              <a href={selected.voice_audio_url} target="_blank" rel="noreferrer" style={{
                flex:1, textAlign:"center", background:"rgba(233,30,140,0.08)",
                border:"1px solid rgba(233,30,140,0.3)", borderRadius:8,
                padding:"0.55rem", color:C.pink, fontSize:"0.72rem",
                fontWeight:700, textDecoration:"none"
              }}>🎙️ Voz</a>
            )}
            <button onClick={() => handleDelete(selected.id)} disabled={deleting} style={{
              flex:1, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)",
              borderRadius:8, padding:"0.55rem", color:C.red, fontSize:"0.72rem",
              fontWeight:700, cursor:"pointer", fontFamily:"inherit"
            }}>{deleting ? "..." : "🗑️ Borrar"}</button>
          </div>
        </div>
      </div>
    </div>
  );

  // CREATE VIEW
  if (view === "create") return (
    <div style={{ padding:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
        <SectionTitle>👤 Nuevo Personaje</SectionTitle>
        <button onClick={() => setView("list")} style={{
          background:"rgba(124,58,237,0.1)", border:`1px solid ${C.border}`, borderRadius:8,
          padding:"0.4rem 0.8rem", color:"#c084fc", fontSize:"0.72rem",
          fontWeight:700, cursor:"pointer", fontFamily:"inherit"
        }}>← Volver</button>
      </div>

      <div style={{ marginBottom:"0.8rem" }}>
        <label style={labelStyle}>Nombre *</label>
        <input style={inputStyle} placeholder="Ej: Adrián Voss" value={form.name} onChange={e => set("name", e.target.value)} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"0.8rem" }}>
        <div>
          <label style={labelStyle}>Género</label>
          <select style={inputStyle} value={form.gender} onChange={e => set("gender", e.target.value)}>
            {GENDERS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Arquetipo</label>
          <select style={inputStyle} value={form.archetype} onChange={e => set("archetype", e.target.value)}>
            {ARCHETYPES.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:"0.8rem" }}>
        <label style={labelStyle}>Comportamiento</label>
        <select style={inputStyle} value={form.behavior_logic} onChange={e => set("behavior_logic", e.target.value)}>
          {BEHAVIORS.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:"0.8rem" }}>
        <label style={labelStyle}>Rol en la historia</label>
        <input style={inputStyle} placeholder="Ej: Protagonista que busca redención..." value={form.role_in_story} onChange={e => set("role_in_story", e.target.value)} />
      </div>
      <div style={{ marginBottom:"1.2rem" }}>
        <label style={labelStyle}>Biografía</label>
        <textarea style={{ ...inputStyle, resize:"vertical", height:90 }} placeholder="Historia del personaje..." value={form.bio} onChange={e => set("bio", e.target.value)} />
      </div>
      <button onClick={handleCreate} disabled={saving} style={{
        width:"100%", padding:"0.85rem",
        background: saving ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#e91e8c)",
        border:"none", borderRadius:10, color:"#fff",
        fontWeight:700, fontSize:"0.9rem", cursor: saving ? "not-allowed" : "pointer", fontFamily:"inherit"
      }}>{saving ? "Creando..." : "👤 Crear Personaje"}</button>
    </div>
  );

  // LIST VIEW
  return (
    <div style={{ padding:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.2rem" }}>
        <SectionTitle>👥 Personajes</SectionTitle>
        <button onClick={() => setView("create")} style={{
          background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none", borderRadius:8,
          padding:"0.4rem 0.9rem", color:"#fff", fontSize:"0.72rem",
          fontWeight:700, cursor:"pointer", fontFamily:"inherit"
        }}>+ Nuevo</button>
      </div>

      {chars.length === 0 ? (
        <EmptyState icon="👤" title="Sin personajes aún" sub="Crea tu primer personaje" action="👤 Crear Personaje" onAction={() => setView("create")} />
      ) : (
        <div style={{ display:"grid", gap:"0.7rem" }}>
          {chars.map(c => (
            <div key={c.id} onClick={() => { setSelected(c); setView("detail"); }} style={{
              background:C.card, borderRadius:12, padding:"0.9rem",
              border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:"0.8rem",
              cursor:"pointer", transition:"all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.5)"}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
            >
              <div style={{
                width:48, height:48, borderRadius:"50%", flexShrink:0,
                background: c.concept_image_url ? `url(${c.concept_image_url}) center/cover` : "linear-gradient(135deg,#7c3aed,#e91e8c)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"1.4rem", border:"2px solid rgba(124,58,237,0.4)"
              }}>{!c.concept_image_url && "👤"}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.85rem", fontWeight:700, color:C.text }}>{c.name||"Personaje"}</div>
                <div style={{ fontSize:"0.65rem", color:C.muted, marginTop:2 }}>{c.archetype||"—"} · {c.gender||"—"}</div>
                {c.bio && <div style={{ fontSize:"0.62rem", color:C.muted, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.bio}</div>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                <Pill color={c.behavior_logic==="player"?"pink":c.behavior_logic==="boss"?"red":"cyan"}>
                  {c.behavior_logic||"npc"}
                </Pill>
                <div style={{ display:"flex", gap:3 }}>
                  {c.model_3d_glb_url && <span title="Modelo 3D">🏺</span>}
                  {c.voice_audio_url && <span title="Voz">🎙️</span>}
                  {c.sprite_sheet_url && <span title="Sprite">🎨</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
