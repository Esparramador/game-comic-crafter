import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TripoService, ElevenService } from "@/api/services";
import { C, SectionTitle, EmptyState, Spinner, Pill, inputStyle, labelStyle } from "./shared";

const ARCHETYPES = ["Guerrero","Mago","Arquero","Asesino","Soporte","Tank","Trickster","Sabio","Héroe","Villano"];
const GENDERS    = ["Masculino","Femenino","No binario","Desconocido"];
const BEHAVIORS  = ["player","npc","boss","ally","enemy","neutral"];

const PRESET_VOICES = [
  { id:"pNInz6obpgDQGcFmaJgB", name:"Adam", desc:"Grave · Épico", emoji:"🔥" },
  { id:"EXAVITQu4vr4xnSDxMaL", name:"Bella", desc:"Suave · Dramática", emoji:"🌙" },
  { id:"SOYHLrjzK2X1ezoPC6cr", name:"Harry", desc:"Oscuro · Intenso", emoji:"⚔️" },
  { id:"JBFqnCBsd6RMkjVDRZzb", name:"George", desc:"Profundo · Misterioso", emoji:"🌑" },
  { id:"CwhRBWXzGAHq8TQ4Fs17", name:"Dorothy", desc:"Aguda · Enérgica", emoji:"⚡" },
  { id:"ThT5KcBeYPX3keUQqHPh", name:"Freya", desc:"Cálida · Heroica", emoji:"🌟" },
  { id:"XB0fDUnXU5powFXDhCwa", name:"Charlotte", desc:"Susurrante · Oscura", emoji:"🖤" },
  { id:"iP95p4xoKVk53GoZ742B", name:"Chris", desc:"Natural · Versátil", emoji:"🎭" },
];

// ── Construye prompt Tripo3D desde los datos del personaje ──
function buildTripoPrompt(char) {
  const gender = char.gender === "Masculino" ? "male" : char.gender === "Femenino" ? "female" : "androgynous";
  const arch = char.archetype || "warrior";
  const bio  = char.bio ? `. ${char.bio.slice(0,120)}` : "";
  return `${char.name}, ${gender} ${arch} character, dark fantasy cyberpunk style, full body 3D model, game-ready mesh, PBR textures, detailed armor/costume, dramatic pose, clean topology, UV unwrapped, next-gen AAA quality${bio}`;
}

export default function CharsScreen({ onNav, showToast }) {
  const [chars, setChars]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState("list");
  const [selected, setSelected]     = useState(null);
  const [tripoData, setTripoData]   = useState(null);
  const [tripoLoading, setTripoLoading] = useState(false);
  const [tripoProgress, setTripoProgress] = useState(0);
  const [tripoStatus, setTripoStatus]     = useState("");
  const [generating3D, setGenerating3D]   = useState(false);
  const [voiceLoading, setVoiceLoading]   = useState(false);
  const [voiceUrl, setVoiceUrl]           = useState(null);
  const [voiceText, setVoiceText]         = useState("");
  const [selectedVoiceId, setSelectedVoiceId] = useState("pNInz6obpgDQGcFmaJgB");
  const [elevenKey, setElevenKey]         = useState(localStorage.getItem("gcc_eleven_key") || "");
  const [showElevenInput, setShowElevenInput] = useState(false);
  const [form, setForm] = useState({
    name:"", gender:"Masculino", archetype:"Guerrero",
    bio:"", behavior_logic:"npc", role_in_story:""
  });
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.GameCharacter.list("-created_date", 50)
      .then(d => setChars(d || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const saveElevenKey = (key) => {
    setElevenKey(key);
    localStorage.setItem("gcc_eleven_key", key);
    if (key) window.__ELEVEN_KEY__ = key;
    setShowElevenInput(false);
    showToast("✅ ElevenLabs API key guardada", "success");
  };

  useEffect(() => {
    if (elevenKey) window.__ELEVEN_KEY__ = elevenKey;
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Abrir personaje y refrescar URL Tripo3D ──
  const openChar = async (char) => {
    setSelected(char);
    setTripoData(null);
    setVoiceUrl(null);
    setVoiceText(`${char.name}... el guerrero que desafió al destino.`);
    setView("detail");
    const taskId = char.mesh_topology?.tripo3d_task_id;
    if (!taskId) return;
    setTripoLoading(true);
    try {
      const data = await TripoService.getTask(taskId);
      setTripoData(data);
    } catch(_) {}
    setTripoLoading(false);
  };

  // ── Refrescar URL manualmente ──
  const handleRefresh = async () => {
    const taskId = selected?.mesh_topology?.tripo3d_task_id;
    if (!taskId) { showToast("⚠️ Sin task_id de Tripo3D", "warning"); return; }
    setTripoLoading(true);
    try {
      const data = await TripoService.getTask(taskId);
      setTripoData(data);
      await base44.entities.GameCharacter.update(selected.id, {
        model_3d_glb_url: TripoService.glb(data),
        mesh_topology: { ...selected.mesh_topology, last_refreshed: new Date().toISOString() }
      });
      showToast("✅ URL 3D refrescada", "success");
    } catch(e) {
      showToast(`❌ ${e.message}`, "error");
    }
    setTripoLoading(false);
  };

  // ── GENERAR NUEVO MODELO 3D ──
  const handleGenerate3D = async () => {
    if (!selected) return;
    setGenerating3D(true);
    setTripoProgress(0);
    setTripoStatus("Iniciando generación 3D...");
    try {
      const prompt = buildTripoPrompt(selected);
      showToast("🏺 Enviando a Tripo3D...", "info");

      const taskData = await TripoService.generate(prompt);
      const taskId = taskData.task_id;

      showToast(`⚡ Task creado: ${taskId.slice(0,12)}...`, "info");
      setTripoStatus("Generando modelo 3D (puede tardar 1-3 min)...");

      // Guardar task_id inmediatamente
      await base44.entities.GameCharacter.update(selected.id, {
        mesh_topology: {
          ...(selected.mesh_topology || {}),
          tripo3d_task_id: taskId,
          prompt_used: prompt,
          started_at: new Date().toISOString()
        }
      });
      setSelected(s => ({ ...s, mesh_topology: { ...(s.mesh_topology||{}), tripo3d_task_id: taskId } }));

      // Polling
      const finalData = await TripoService.poll(taskId, (progress, status) => {
        setTripoProgress(progress);
        setTripoStatus(`${status} — ${progress}%`);
      });

      setTripoData(finalData);
      const glbUrl = TripoService.glb(finalData);
      const thumb  = TripoService.thumb(finalData);

      // Guardar en BD
      await base44.entities.GameCharacter.update(selected.id, {
        model_3d_glb_url: glbUrl,
        concept_image_url: thumb || selected.concept_image_url,
        mesh_topology: {
          ...(selected.mesh_topology || {}),
          tripo3d_task_id: taskId,
          prompt_used: prompt,
          completed_at: new Date().toISOString()
        }
      });

      setSelected(s => ({ ...s, model_3d_glb_url: glbUrl, concept_image_url: thumb || s.concept_image_url }));
      setChars(prev => prev.map(c => c.id === selected.id ? { ...c, model_3d_glb_url: glbUrl } : c));
      showToast("🎉 ¡Modelo 3D generado con éxito!", "success");
      setTripoStatus("✅ Completado");
    } catch(e) {
      showToast(`❌ ${e.message}`, "error");
      setTripoStatus(`Error: ${e.message}`);
    }
    setGenerating3D(false);
  };

  // ── GENERAR VOZ (ElevenLabs) ──
  const handleGenerateVoice = async () => {
    if (!elevenKey) { setShowElevenInput(true); return; }
    if (!voiceText.trim()) { showToast("⚠️ Escribe el texto para la voz", "warning"); return; }
    setVoiceLoading(true);
    try {
      const url = await ElevenService.textToSpeech({
        voiceId: selectedVoiceId,
        text: voiceText,
        stability: 0.65,
        similarityBoost: 0.80,
        style: 0.30
      });
      setVoiceUrl(url);
      showToast("🎙️ ¡Voz generada!", "success");
    } catch(e) {
      showToast(`❌ ElevenLabs: ${e.message}`, "error");
    }
    setVoiceLoading(false);
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
      showToast("🗑️ Eliminado", "info");
      setView("list"); setSelected(null);
    } catch(_) { showToast("❌ Error", "error"); }
    setDeleting(false);
  };

  if (loading) return <Spinner />;

  // ════════════ DETAIL ════════════
  if (view === "detail" && selected) {
    const taskId  = selected.mesh_topology?.tripo3d_task_id;
    const glbUrl  = TripoService.glb(tripoData) || selected.model_3d_glb_url;
    const thumbUrl = TripoService.thumb(tripoData) || selected.concept_image_url;

    return (
      <div style={{ padding:"1rem" }}>
        <button onClick={() => { setView("list"); setSelected(null); setTripoData(null); setVoiceUrl(null); }} style={{
          background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem",
          cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
        }}>← Personajes</button>

        <div style={{ background:C.card, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>

          {/* Header imagen */}
          <div style={{
            height:180, position:"relative", overflow:"hidden",
            background: thumbUrl ? `url(${thumbUrl}) center/cover` : "linear-gradient(135deg,#7c3aed,#e91e8c)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            {!thumbUrl && <span style={{ fontSize:"5rem" }}>👤</span>}
            {selected.identity_locked && (
              <div style={{ position:"absolute", top:10, left:10, background:"rgba(255,215,0,0.2)", color:"#ffd700", border:"1px solid rgba(255,215,0,0.4)", borderRadius:20, padding:"3px 10px", fontSize:"0.6rem", fontWeight:800 }}>🔒 IDENTITY LOCK</div>
            )}
            {(tripoLoading || generating3D) && (
              <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
                <div style={{ width:40, height:40, border:"2px solid rgba(124,58,237,0.3)", borderTopColor:"#7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
                <div style={{ color:"#c084fc", fontSize:"0.72rem", fontWeight:700 }}>{tripoStatus || "Cargando..."}</div>
                {generating3D && tripoProgress > 0 && (
                  <div style={{ width:160, height:4, background:"rgba(255,255,255,0.1)", borderRadius:4 }}>
                    <div style={{ width:`${tripoProgress}%`, height:"100%", background:"linear-gradient(90deg,#7c3aed,#00f5ff)", borderRadius:4, transition:"width 0.3s" }}/>
                  </div>
                )}
              </div>
            )}
            <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
          </div>

          <div style={{ padding:"1rem" }}>
            {/* Nombre */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1rem" }}>
              <div>
                <div style={{ fontSize:"1.1rem", fontWeight:800, color:C.text }}>{selected.name}</div>
                <div style={{ fontSize:"0.68rem", color:C.muted, marginTop:2 }}>{selected.gender} · {selected.archetype}</div>
              </div>
              <Pill color={selected.behavior_logic==="player"?"pink":selected.behavior_logic==="boss"?"red":"cyan"}>
                {selected.behavior_logic||"npc"}
              </Pill>
            </div>

            {/* ── SECCIÓN TRIPO3D ── */}
            <div style={{ background:"rgba(0,245,255,0.04)", border:"1px solid rgba(0,245,255,0.15)", borderRadius:12, padding:"0.85rem", marginBottom:"0.8rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.7rem" }}>
                <div style={{ fontSize:"0.72rem", fontWeight:800, color:C.cyan }}>🏺 Modelo 3D — Tripo3D</div>
                <div style={{ display:"flex", gap:"0.4rem" }}>
                  {taskId && (
                    <button onClick={handleRefresh} disabled={tripoLoading || generating3D} style={{
                      background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.25)", borderRadius:8,
                      padding:"0.3rem 0.7rem", color:C.cyan, fontSize:"0.6rem", fontWeight:700,
                      cursor:"pointer", fontFamily:"inherit"
                    }}>🔄 Refrescar</button>
                  )}
                  <button onClick={handleGenerate3D} disabled={generating3D || tripoLoading} style={{
                    background: generating3D ? "rgba(124,58,237,0.15)" : "linear-gradient(135deg,#7c3aed,#00f5ff)",
                    border:"none", borderRadius:8, padding:"0.3rem 0.9rem",
                    color:"#fff", fontSize:"0.65rem", fontWeight:800,
                    cursor: generating3D ? "not-allowed" : "pointer", fontFamily:"inherit"
                  }}>{generating3D ? `${tripoProgress}%...` : "✨ Generar 3D"}</button>
                </div>
              </div>

              {taskId && (
                <div style={{ fontSize:"0.58rem", color:C.muted, fontFamily:"monospace", marginBottom:"0.5rem" }}>
                  Task: {taskId}
                </div>
              )}

              {glbUrl ? (
                <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                  <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/>
                    <span style={{ fontSize:"0.65rem", color:"#22c55e", fontWeight:700 }}>Modelo 3D disponible</span>
                  </div>
                  <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                    <a href={glbUrl} target="_blank" rel="noreferrer" style={{
                      background:"rgba(0,245,255,0.08)", border:"1px solid rgba(0,245,255,0.3)",
                      borderRadius:8, padding:"0.4rem 0.9rem", color:C.cyan,
                      fontSize:"0.7rem", fontWeight:700, textDecoration:"none"
                    }}>📥 Descargar GLB</a>
                    <a href={`https://3dviewer.net/#model=${encodeURIComponent(glbUrl)}`} target="_blank" rel="noreferrer" style={{
                      background:"rgba(124,58,237,0.08)", border:`1px solid rgba(124,58,237,0.3)`,
                      borderRadius:8, padding:"0.4rem 0.9rem", color:"#c084fc",
                      fontSize:"0.7rem", fontWeight:700, textDecoration:"none"
                    }}>🌐 Ver 3D online</a>
                    <a href={`https://sandbox.babylonjs.com/?GLB=${encodeURIComponent(glbUrl)}`} target="_blank" rel="noreferrer" style={{
                      background:"rgba(233,30,140,0.06)", border:"1px solid rgba(233,30,140,0.25)",
                      borderRadius:8, padding:"0.4rem 0.9rem", color:C.pink,
                      fontSize:"0.7rem", fontWeight:700, textDecoration:"none"
                    }}>🎮 Babylon.js</a>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize:"0.68rem", color:C.muted, textAlign:"center", padding:"0.5rem 0" }}>
                  {generating3D ? tripoStatus : "Sin modelo 3D — pulsa ✨ Generar 3D"}
                </div>
              )}
            </div>

            {/* ── SECCIÓN ELEVENLABS ── */}
            <div style={{ background:"rgba(34,197,94,0.04)", border:"1px solid rgba(34,197,94,0.15)", borderRadius:12, padding:"0.85rem", marginBottom:"0.8rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.7rem" }}>
                <div style={{ fontSize:"0.72rem", fontWeight:800, color:C.green }}>🎙️ Voz — ElevenLabs</div>
                <button onClick={() => setShowElevenInput(!showElevenInput)} style={{
                  background:"transparent", border:`1px solid rgba(34,197,94,0.2)`,
                  borderRadius:8, padding:"0.25rem 0.6rem", color: elevenKey ? "#22c55e" : C.muted,
                  fontSize:"0.58rem", cursor:"pointer", fontFamily:"inherit"
                }}>{elevenKey ? "🔑 Key OK" : "🔑 Añadir Key"}</button>
              </div>

              {showElevenInput && (
                <div style={{ marginBottom:"0.7rem", display:"flex", gap:"0.4rem" }}>
                  <input
                    placeholder="sk_xxxxxxxx..."
                    defaultValue={elevenKey}
                    id="eleven-key-input"
                    style={{ ...inputStyle, flex:1, fontSize:"0.72rem" }}
                  />
                  <button onClick={() => {
                    const k = document.getElementById("eleven-key-input")?.value;
                    if (k) saveElevenKey(k);
                  }} style={{
                    background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.4)",
                    borderRadius:8, padding:"0 0.8rem", color:"#22c55e",
                    fontSize:"0.72rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>Guardar</button>
                </div>
              )}

              {/* Selector de voz */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.3rem", marginBottom:"0.7rem" }}>
                {PRESET_VOICES.map(v => (
                  <button key={v.id} onClick={() => setSelectedVoiceId(v.id)} style={{
                    background: selectedVoiceId===v.id ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.04)",
                    border: `1px solid ${selectedVoiceId===v.id ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.1)"}`,
                    borderRadius:8, padding:"0.4rem 0.2rem", cursor:"pointer",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontFamily:"inherit"
                  }}>
                    <span style={{ fontSize:"0.9rem" }}>{v.emoji}</span>
                    <span style={{ fontSize:"0.55rem", color: selectedVoiceId===v.id ? "#22c55e" : C.muted, fontWeight:700 }}>{v.name}</span>
                  </button>
                ))}
              </div>

              <textarea
                value={voiceText}
                onChange={e => setVoiceText(e.target.value)}
                placeholder="Texto para generar la voz..."
                style={{ ...inputStyle, resize:"vertical", height:60, fontSize:"0.72rem", marginBottom:"0.5rem" }}
              />

              <button onClick={handleGenerateVoice} disabled={voiceLoading} style={{
                width:"100%", padding:"0.55rem",
                background: voiceLoading ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.15)",
                border:"1px solid rgba(34,197,94,0.4)", borderRadius:8,
                color:"#22c55e", fontSize:"0.75rem", fontWeight:800,
                cursor: voiceLoading ? "not-allowed" : "pointer", fontFamily:"inherit"
              }}>
                {voiceLoading ? "🎙️ Generando..." : elevenKey ? "🎙️ Generar Voz" : "🔑 Necesitas API key de ElevenLabs"}
              </button>

              {voiceUrl && (
                <div style={{ marginTop:"0.6rem" }}>
                  <audio controls src={voiceUrl} style={{ width:"100%", marginBottom:"0.3rem" }}/>
                  <div style={{ fontSize:"0.58rem", color:C.muted, textAlign:"center" }}>
                    Preview generado — guarda el audio descargándolo
                  </div>
                </div>
              )}

              {(selected.voice_audio_url || selected.master_phonetic_audio_url) && !voiceUrl && (
                <div style={{ marginTop:"0.5rem" }}>
                  <div style={{ fontSize:"0.58rem", color:C.muted, marginBottom:"0.3rem" }}>Voz guardada:</div>
                  <audio controls src={selected.voice_audio_url || selected.master_phonetic_audio_url} style={{ width:"100%" }}/>
                </div>
              )}
            </div>

            {/* Bio / Rol */}
            {selected.role_in_story && (
              <div style={{ marginBottom:"0.7rem" }}>
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

            {/* Acciones */}
            <div style={{ display:"flex", gap:"0.5rem" }}>
              <button onClick={() => onNav("prompts")} style={{
                flex:1, background:"rgba(124,58,237,0.08)", border:`1px solid rgba(124,58,237,0.3)`,
                borderRadius:8, padding:"0.55rem", color:"#c084fc",
                fontSize:"0.7rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>⚡ Prompt</button>
              <button onClick={() => handleDelete(selected.id)} disabled={deleting} style={{
                background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:8, padding:"0.55rem", color:"#ef4444",
                fontSize:"0.7rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", minWidth:60
              }}>{deleting ? "..." : "🗑️ Borrar"}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════ CREATE ════════════
  if (view === "create") return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => setView("list")} style={{
        background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem",
        cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Personajes</button>
      <SectionTitle>👤 Nuevo Personaje</SectionTitle>

      <div style={{ marginBottom:"0.75rem" }}>
        <label style={labelStyle}>Nombre *</label>
        <input style={inputStyle} placeholder="Ej: Adrián Voss" value={form.name} onChange={e => set("name", e.target.value)} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"0.75rem" }}>
        <div><label style={labelStyle}>Género</label>
          <select style={inputStyle} value={form.gender} onChange={e => set("gender", e.target.value)}>
            {GENDERS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Arquetipo</label>
          <select style={inputStyle} value={form.archetype} onChange={e => set("archetype", e.target.value)}>
            {ARCHETYPES.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:"0.75rem" }}>
        <label style={labelStyle}>Comportamiento</label>
        <select style={inputStyle} value={form.behavior_logic} onChange={e => set("behavior_logic", e.target.value)}>
          {BEHAVIORS.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:"0.75rem" }}>
        <label style={labelStyle}>Rol en la historia</label>
        <input style={inputStyle} placeholder="Protagonista que busca redención..." value={form.role_in_story} onChange={e => set("role_in_story", e.target.value)} />
      </div>
      <div style={{ marginBottom:"1rem" }}>
        <label style={labelStyle}>Biografía</label>
        <textarea style={{ ...inputStyle, resize:"vertical", height:90 }} placeholder="Historia del personaje..." value={form.bio} onChange={e => set("bio", e.target.value)} />
      </div>

      <div style={{ background:"rgba(0,245,255,0.04)", border:"1px solid rgba(0,245,255,0.15)", borderRadius:12, padding:"0.75rem", marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.65rem", color:C.cyan, fontWeight:700, marginBottom:"0.3rem" }}>🏺 Tripo3D</div>
        <div style={{ fontSize:"0.6rem", color:C.muted }}>Al crear el personaje, podrás generar su modelo 3D directamente desde la ficha con un clic.</div>
      </div>

      <button onClick={handleCreate} disabled={saving} style={{
        width:"100%", padding:"0.9rem",
        background: saving ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#e91e8c)",
        border:"none", borderRadius:12, color:"#fff",
        fontWeight:800, fontSize:"0.9rem", cursor: saving ? "not-allowed" : "pointer", fontFamily:"inherit"
      }}>{saving ? "Guardando..." : "✨ Crear Personaje"}</button>
    </div>
  );

  // ════════════ LIST ════════════
  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem",
        cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Dashboard</button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <SectionTitle>👥 Personajes</SectionTitle>
        <button onClick={() => setView("create")} style={{
          background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
          borderRadius:10, padding:"0.5rem 1rem", color:"#fff",
          fontSize:"0.75rem", fontWeight:800, cursor:"pointer", fontFamily:"inherit"
        }}>+ Nuevo</button>
      </div>

      {chars.length === 0
        ? <EmptyState icon="👤" title="Sin personajes" sub="Crea tu primer personaje" action="+ Nuevo Personaje" onAction={() => setView("create")} />
        : (
          <div style={{ display:"grid", gap:"0.6rem" }}>
            {chars.map(c => (
              <div key={c.id} onClick={() => openChar(c)} style={{
                background:C.card, borderRadius:12, padding:"0.85rem",
                border:`1px solid ${c.identity_locked ? "rgba(255,215,0,0.25)" : C.border}`,
                display:"flex", alignItems:"center", gap:"0.9rem", cursor:"pointer", transition:"all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(124,58,237,0.5)"}
              onMouseLeave={e => e.currentTarget.style.borderColor=c.identity_locked?"rgba(255,215,0,0.25)":C.border}
              >
                <div style={{
                  width:52, height:52, borderRadius:12, flexShrink:0, overflow:"hidden",
                  background: c.concept_image_url ? `url(${c.concept_image_url}) center/cover` : "linear-gradient(135deg,#7c3aed,#e91e8c)",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem"
                }}>
                  {!c.concept_image_url && "👤"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
                    <span style={{ fontSize:"0.85rem", fontWeight:800, color:C.text }}>{c.name}</span>
                    {c.identity_locked && <span style={{ fontSize:"0.6rem" }}>🔒</span>}
                  </div>
                  <div style={{ fontSize:"0.63rem", color:C.muted }}>{c.gender} · {c.archetype}</div>
                  <div style={{ display:"flex", gap:"0.3rem", marginTop:4, flexWrap:"wrap" }}>
                    {c.model_3d_glb_url && <span style={{ fontSize:"0.55rem", color:"#22c55e" }}>🏺 3D</span>}
                    {c.mesh_topology?.tripo3d_task_id && <span style={{ fontSize:"0.55rem", color:"#c084fc" }}>⚡ Tripo</span>}
                    {(c.voice_audio_url || c.master_phonetic_audio_url) && <span style={{ fontSize:"0.55rem", color:C.cyan }}>🎙️ Voz</span>}
                  </div>
                </div>
                <Pill color={c.behavior_logic==="player"?"pink":c.behavior_logic==="boss"?"red":"cyan"}>
                  {c.behavior_logic||"npc"}
                </Pill>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
