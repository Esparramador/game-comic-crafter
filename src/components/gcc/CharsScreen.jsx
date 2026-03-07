import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, EmptyState, Spinner, Pill, inputStyle, labelStyle } from "./shared";

const TRIPO_BEARER = "tsk_zlOCluH25qxtmvgEWSw7lUWL2fSpeXexmUW73IFvLDK";
const ARCHETYPES = ["Guerrero","Mago","Arquero","Asesino","Soporte","Tank","Trickster","Sabio","Héroe","Villano"];
const GENDERS = ["Masculino","Femenino","No binario","Desconocido"];
const BEHAVIORS = ["player","npc","boss","ally","enemy","neutral"];

async function fetchTripoUrl(taskId) {
  try {
    const res = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
      headers: { Authorization: `Bearer ${TRIPO_BEARER}` }
    });
    const data = await res.json();
    if (data.code !== 0 || data.data?.status !== "success") return null;
    return {
      glb: data.data.output?.pbr_model || null,
      glb_clean: (data.data.output?.pbr_model || "").split("?Policy=")[0],
      thumbnail: data.data.output?.rendered_image || null,
      thumbnail_clean: (data.data.output?.rendered_image || "").split("?Policy=")[0],
    };
  } catch (e) {
    return null;
  }
}

export default function CharsScreen({ onNav, showToast }) {
  const [chars, setChars]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState("list");
  const [selected, setSelected] = useState(null);
  const [tripoData, setTripoData] = useState(null); // URLs frescas del personaje seleccionado
  const [tripoLoading, setTripoLoading] = useState(false);
  const [form, setForm]         = useState({ name:"", gender:"Masculino", archetype:"Guerrero", bio:"", behavior_logic:"npc", role_in_story:"" });
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.GameCharacter.list("-created_date", 50)
      .then(d => setChars(d || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Al abrir un personaje, refresca automáticamente la URL de Tripo3D
  const openChar = async (char) => {
    setSelected(char);
    setTripoData(null);
    setView("detail");

    const taskId = char.mesh_topology?.tripo3d_task_id;
    if (!taskId) return;

    setTripoLoading(true);
    const result = await fetchTripoUrl(taskId);
    setTripoData(result);

    // Si la URL obtenida es diferente a la guardada, actualizar en BD
    if (result?.glb && result.glb_clean !== char.model_3d_glb_url?.split("?Policy=")[0]) {
      try {
        await base44.entities.GameCharacter.update(char.id, {
          model_3d_glb_url: result.glb,
          mesh_topology: {
            ...char.mesh_topology,
            last_refreshed: new Date().toISOString(),
          }
        });
        setChars(prev => prev.map(c => c.id === char.id
          ? { ...c, model_3d_glb_url: result.glb }
          : c
        ));
      } catch(_) {}
    }
    setTripoLoading(false);
  };

  const handleRefreshTripo = async () => {
    if (!selected) return;
    const taskId = selected.mesh_topology?.tripo3d_task_id;
    if (!taskId) { showToast("⚠️ Sin task_id de Tripo3D", "warning"); return; }
    setTripoLoading(true);
    const result = await fetchTripoUrl(taskId);
    if (!result) { showToast("❌ No se pudo obtener URL de Tripo3D", "error"); setTripoLoading(false); return; }
    setTripoData(result);
    try {
      await base44.entities.GameCharacter.update(selected.id, {
        model_3d_glb_url: result.glb,
        mesh_topology: { ...selected.mesh_topology, last_refreshed: new Date().toISOString() }
      });
      setSelected(prev => ({ ...prev, model_3d_glb_url: result.glb }));
      showToast("✅ URL 3D refrescada", "success");
    } catch(_) { showToast("❌ Error al guardar", "error"); }
    setTripoLoading(false);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) { showToast("⚠️ Nombre obligatorio", "warning"); return; }
    setSaving(true);
    try {
      const c = await base44.entities.GameCharacter.create(form);
      setChars(prev => [c, ...prev]);
      showToast("✅ Personaje creado", "success");
      setForm({ name:"", gender:"Masculino", archetype:"Guerrero", bio:"", behavior_logic:"npc", role_in_story:"" });
      setView("list");
    } catch(_) { showToast("❌ Error al crear", "error"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este personaje?")) return;
    setDeleting(true);
    try {
      await base44.entities.GameCharacter.delete(id);
      setChars(prev => prev.filter(c => c.id !== id));
      showToast("🗑️ Personaje eliminado", "info");
      setView("list"); setSelected(null);
    } catch(_) { showToast("❌ Error al eliminar", "error"); }
    setDeleting(false);
  };

  if (loading) return <Spinner />;

  // ─── DETAIL ───
  if (view === "detail" && selected) {
    const taskId = selected.mesh_topology?.tripo3d_task_id;
    const glbUrl = tripoData?.glb || selected.model_3d_glb_url;
    const thumbnailUrl = tripoData?.thumbnail || selected.concept_image_url;

    return (
      <div style={{ padding:"1rem" }}>
        <button onClick={() => { setView("list"); setSelected(null); setTripoData(null); }} style={{
          background:"transparent", border:"none", color:C.muted,
          fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
          display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
        }}>← Volver a Personajes</button>

        <div style={{ background:C.card, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>

          {/* HEADER con thumbnail Tripo3D */}
          <div style={{
            height:180, position:"relative", overflow:"hidden",
            background: thumbnailUrl
              ? `url(${thumbnailUrl}) center/cover`
              : "linear-gradient(135deg,#7c3aed,#e91e8c)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            {!thumbnailUrl && <span style={{ fontSize:"5rem" }}>👤</span>}
            {selected.identity_locked && (
              <div style={{ position:"absolute", top:10, left:10, background:"rgba(255,215,0,0.2)", color:"#ffd700", border:"1px solid rgba(255,215,0,0.4)", borderRadius:20, padding:"3px 10px", fontSize:"0.6rem", fontWeight:800 }}>
                🔒 IDENTITY LOCK
              </div>
            )}
            {tripoLoading && (
              <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#c084fc", fontSize:"0.8rem", fontWeight:700 }}>🔄 Cargando 3D...</span>
              </div>
            )}
          </div>

          <div style={{ padding:"1rem" }}>
            {/* Nombre + role */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
              <div>
                <div style={{ fontSize:"1.1rem", fontWeight:800, color:C.text }}>{selected.name}</div>
                <div style={{ fontSize:"0.68rem", color:C.muted, marginTop:2 }}>{selected.gender} · {selected.archetype}</div>
              </div>
              <Pill color={selected.behavior_logic === "player" ? "pink" : selected.behavior_logic === "boss" ? "red" : "cyan"}>
                {selected.behavior_logic || "npc"}
              </Pill>
            </div>

            {/* Task ID + estado */}
            {taskId && (
              <div style={{ background:"rgba(124,58,237,0.06)", border:`1px solid ${C.border}`, borderRadius:10, padding:"0.6rem 0.8rem", marginBottom:"0.8rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:1, textTransform:"uppercase" }}>Tripo3D Task ID</div>
                    <div style={{ fontSize:"0.65rem", color:"#c084fc", fontFamily:"monospace", marginTop:2 }}>{taskId}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    {tripoData && <span style={{ fontSize:"0.6rem", color:"#22c55e", fontWeight:700 }}>✅ URL activa</span>}
                    {!tripoData && !tripoLoading && <span style={{ fontSize:"0.6rem", color:C.muted }}>Sin URL fresca</span>}
                    <button onClick={handleRefreshTripo} disabled={tripoLoading} style={{
                      background:"rgba(124,58,237,0.15)", border:`1px solid rgba(124,58,237,0.4)`,
                      borderRadius:8, padding:"0.3rem 0.7rem", color:"#c084fc",
                      fontSize:"0.62rem", fontWeight:700, cursor:tripoLoading?"not-allowed":"pointer",
                      fontFamily:"inherit"
                    }}>{tripoLoading ? "..." : "🔄 Refrescar"}</button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEWER 3D */}
            {glbUrl && (
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>
                  Vista 3D — {tripoData ? "URL fresca ✅" : "URL guardada"}
                </div>
                <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}`, background:"#0a0010", position:"relative" }}>
                  <iframe
                    src={`https://app.vectary.com/p/3dPKJFZHJF7fVTRDsB3SKP`}
                    style={{ display:"none" }}
                    title="placeholder"
                  />
                  {/* model-viewer via CDN */}
                  <div style={{ position:"relative", width:"100%", paddingBottom:"56%" }}>
                    <div id={`viewer-${selected.id}`} style={{
                      position:"absolute", inset:0,
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      gap:"0.8rem"
                    }}>
                      <div style={{ fontSize:"3.5rem" }}>🏺</div>
                      <div style={{ fontSize:"0.75rem", color:"#c084fc", fontWeight:700 }}>Modelo 3D GLB listo</div>
                      <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", justifyContent:"center" }}>
                        <a href={glbUrl} target="_blank" rel="noreferrer" style={{
                          background:"rgba(0,245,255,0.1)", border:"1px solid rgba(0,245,255,0.35)",
                          borderRadius:8, padding:"0.5rem 1rem", color:C.cyan,
                          fontSize:"0.75rem", fontWeight:700, textDecoration:"none"
                        }}>📥 Descargar GLB</a>
                        <a href={`https://3dviewer.net/#model=${encodeURIComponent(glbUrl)}`} target="_blank" rel="noreferrer" style={{
                          background:"rgba(124,58,237,0.12)", border:`1px solid rgba(124,58,237,0.4)`,
                          borderRadius:8, padding:"0.5rem 1rem", color:"#c084fc",
                          fontSize:"0.75rem", fontWeight:700, textDecoration:"none"
                        }}>🌐 Ver en 3DViewer</a>
                        <a href={`https://sandbox.babylonjs.com/?GLB=${encodeURIComponent(glbUrl)}`} target="_blank" rel="noreferrer" style={{
                          background:"rgba(233,30,140,0.08)", border:"1px solid rgba(233,30,140,0.3)",
                          borderRadius:8, padding:"0.5rem 1rem", color:C.pink,
                          fontSize:"0.75rem", fontWeight:700, textDecoration:"none"
                        }}>🎮 Ver en Babylon</a>
                      </div>
                      <div style={{ fontSize:"0.58rem", color:C.muted, maxWidth:280, textAlign:"center", wordBreak:"break-all" }}>
                        {glbUrl.split("?Policy=")[0]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!glbUrl && !tripoLoading && (
              <div style={{ background:"rgba(124,58,237,0.05)", border:`1px solid ${C.border}`, borderRadius:10, padding:"1rem", textAlign:"center", marginBottom:"1rem" }}>
                <div style={{ fontSize:"2rem", marginBottom:"0.4rem" }}>🏺</div>
                <div style={{ fontSize:"0.72rem", color:C.muted }}>Sin modelo 3D disponible</div>
                {taskId && <div style={{ fontSize:"0.65rem", color:"#c084fc", marginTop:"0.3rem" }}>Task ID encontrado — pulsa 🔄 Refrescar para obtener la URL</div>}
              </div>
            )}

            {/* Rol / Bio */}
            {selected.role_in_story && (
              <div style={{ marginBottom:"0.8rem" }}>
                <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Rol</div>
                <div style={{ fontSize:"0.78rem", color:C.text }}>{selected.role_in_story}</div>
              </div>
            )}
            {selected.bio && (
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Biografía</div>
                <div style={{ fontSize:"0.73rem", color:C.text, lineHeight:1.6 }}>{selected.bio}</div>
              </div>
            )}

            {/* Tags */}
            {selected.tags && selected.tags.length > 0 && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem", marginBottom:"1rem" }}>
                {selected.tags.map((t,i) => (
                  <span key={i} style={{ background:"rgba(124,58,237,0.1)", color:"#c084fc", border:`1px solid ${C.border}`, borderRadius:20, padding:"2px 8px", fontSize:"0.6rem" }}>{t}</span>
                ))}
              </div>
            )}

            {/* Voz */}
            {(selected.voice_audio_url || selected.master_phonetic_audio_url) && (
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:1, textTransform:"uppercase", marginBottom:"0.5rem" }}>🎙️ Audio de Voz</div>
                <audio controls src={selected.voice_audio_url || selected.master_phonetic_audio_url} style={{ width:"100%", filter:"invert(1) hue-rotate(180deg)" }} />
              </div>
            )}

            {/* Acciones */}
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              {glbUrl && (
                <a href={glbUrl} target="_blank" rel="noreferrer" style={{
                  flex:1, minWidth:80, textAlign:"center",
                  background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.3)",
                  borderRadius:8, padding:"0.55rem", color:C.cyan,
                  fontSize:"0.72rem", fontWeight:700, textDecoration:"none"
                }}>📥 GLB</a>
              )}
              {(selected.voice_audio_url || selected.master_phonetic_audio_url) && (
                <a href={selected.voice_audio_url || selected.master_phonetic_audio_url} target="_blank" rel="noreferrer" style={{
                  flex:1, minWidth:80, textAlign:"center",
                  background:"rgba(233,30,140,0.08)", border:"1px solid rgba(233,30,140,0.3)",
                  borderRadius:8, padding:"0.55rem", color:C.pink,
                  fontSize:"0.72rem", fontWeight:700, textDecoration:"none"
                }}>🎙️ Voz</a>
              )}
              <button onClick={() => handleDelete(selected.id)} disabled={deleting} style={{
                flex:1, minWidth:80, background:"rgba(239,68,68,0.08)",
                border:"1px solid rgba(239,68,68,0.3)", borderRadius:8,
                padding:"0.55rem", color:"#ef4444", fontSize:"0.72rem",
                fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>{deleting ? "..." : "🗑️ Borrar"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CREATE ───
  if (view === "create") return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => setView("list")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver a Personajes</button>
      <SectionTitle>👤 Nuevo Personaje</SectionTitle>

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
        border:"none", borderRadius:12, color:"#fff",
        fontWeight:800, fontSize:"0.9rem",
        cursor: saving ? "not-allowed" : "pointer", fontFamily:"inherit"
      }}>{saving ? "Guardando..." : "✨ Crear Personaje"}</button>
    </div>
  );

  // ─── LIST ───
  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <SectionTitle>👥 Personajes</SectionTitle>
        <button onClick={() => setView("create")} style={{
          background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
          borderRadius:10, padding:"0.5rem 1rem", color:"#fff",
          fontSize:"0.75rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit"
        }}>+ Nuevo</button>
      </div>

      {chars.length === 0 ? (
        <EmptyState icon="👤" title="Sin personajes" sub="Crea tu primer personaje" action="+ Nuevo Personaje" onAction={() => setView("create")} />
      ) : (
        <div style={{ display:"grid", gap:"0.6rem" }}>
          {chars.map(c => (
            <div key={c.id} onClick={() => openChar(c)} style={{
              background:C.card, borderRadius:12, padding:"0.85rem",
              border:`1px solid ${c.identity_locked ? "rgba(255,215,0,0.25)" : C.border}`,
              display:"flex", alignItems:"center", gap:"0.9rem",
              cursor:"pointer", transition:"all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.5)"}
            onMouseLeave={e => e.currentTarget.style.borderColor=c.identity_locked?"rgba(255,215,0,0.25)":C.border}
            >
              {/* Avatar */}
              <div style={{
                width:52, height:52, borderRadius:12, flexShrink:0, overflow:"hidden",
                background: c.concept_image_url
                  ? `url(${c.concept_image_url}) center/cover`
                  : "linear-gradient(135deg,#7c3aed,#e91e8c)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem"
              }}>
                {!c.concept_image_url && "👤"}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:3 }}>
                  <span style={{ fontSize:"0.85rem", fontWeight:800, color:C.text }}>{c.name}</span>
                  {c.identity_locked && <span style={{ fontSize:"0.6rem" }}>🔒</span>}
                </div>
                <div style={{ fontSize:"0.63rem", color:C.muted }}>{c.gender} · {c.archetype}</div>
                <div style={{ display:"flex", gap:"0.3rem", marginTop:4, flexWrap:"wrap" }}>
                  {c.model_3d_glb_url && <span style={{ fontSize:"0.55rem", color:"#22c55e" }}>🏺 3D</span>}
                  {c.mesh_topology?.tripo3d_task_id && <span style={{ fontSize:"0.55rem", color:"#c084fc" }}>⚡ Tripo</span>}
                  {c.voice_audio_url && <span style={{ fontSize:"0.55rem", color:C.cyan }}>🎙️ Voz</span>}
                  {c.sprite_sheet_url && <span style={{ fontSize:"0.55rem", color:C.pink }}>🎨 Sprite</span>}
                </div>
              </div>

              <div style={{ flexShrink:0 }}>
                <Pill color={c.behavior_logic==="player"?"pink":c.behavior_logic==="boss"?"red":"cyan"}>
                  {c.behavior_logic||"npc"}
                </Pill>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
