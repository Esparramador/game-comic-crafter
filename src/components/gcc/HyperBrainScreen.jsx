import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { HyperBrain, ALL_SERVICES_STATUS, initHyperBrain, initGCC } from "./hyperBrainApi";
import { C, SectionTitle, Spinner, labelStyle, inputStyle } from "./shared";

const MODES = [
  { id:"character", icon:"👤", label:"Forge Personaje",  desc:"Lore + imagen + 3D + voz en un click",     color:"#c084fc", time:"~90s" },
  { id:"game",      icon:"🎮", label:"Genesis Juego",    desc:"GDD + cover art + marketing kit completo", color:C.cyan,    time:"~60s" },
  { id:"world",     icon:"🌍", label:"World Builder",    desc:"Zona real → escenario de juego con Maps",  color:"#22c55e", time:"~75s" },
  { id:"marketing", icon:"📣", label:"Marketing Blitz",  desc:"Poster + trailer + copy 3 idiomas",        color:"#f59e0b", time:"~45s" },
  { id:"assets",    icon:"🖼️", label:"Asset Batch",      desc:"Múltiples imágenes en paralelo",           color:"#22c55e", time:"~30s" },
  { id:"voice",     icon:"🎙️", label:"Voice Batch",      desc:"Varias líneas de voz de golpe",            color:"#ec4899", time:"~20s" },
];

const VOICE_OPTIONS = [
  { id:"SOYHLrjzK2X1ezoPC6cr", name:"Harry — Oscuro", emoji:"⚔️" },
  { id:"JBFqnCBsd6RMkjVDRZzb", name:"George — Épico", emoji:"📖" },
  { id:"pNInz6obpgDQGcFmaJgB", name:"Adam — Grave",   emoji:"🔥" },
  { id:"EXAVITQu4vr4xnSDxMaL", name:"Bella — Suave",  emoji:"🌸" },
  { id:"TxGEqnHWrfWFTfGW9XjX", name:"Josh — Deep",    emoji:"🌑" },
];

const GENRE_OPTIONS = ["RPG","Action","Adventure","Puzzle","Horror","Platformer","Strategy","Shooter","Simulation"];
const ATMO_OPTIONS  = ["Dark Fantasy","Cyberpunk","Post-Apocalíptico","Medieval","Sci-Fi","Terror","Steampunk","Neon Noir"];
const ARCHETYPE_OPTIONS = ["Guerrero","Mago","Asesino","Tank","Soporte","Villano","Héroe","Sabio","Trickster"];

function ServiceBadge({ name, ok, icon }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 8px",
      background: ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
      border:`1px solid ${ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
      borderRadius:20, fontSize:"0.58rem", color: ok ? "#22c55e" : "#ef4444", fontWeight:700
    }}>
      {icon} {name} {ok ? "✅" : "❌"}
    </div>
  );
}

function StepLog({ steps }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior:"smooth" }); }, [steps]);
  return (
    <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:10, padding:"0.7rem", marginBottom:"0.8rem", maxHeight:130, overflowY:"auto", fontFamily:"monospace" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ fontSize:"0.62rem", color: s.type==="done" ? "#22c55e" : s.type==="error" ? "#ef4444" : "#c084fc", marginBottom:2 }}>
          {s.type==="done" ? "✅" : s.type==="error" ? "❌" : "⚡"} {s.msg}
        </div>
      ))}
      <div ref={ref}/>
    </div>
  );
}

function ResultPanel({ result, mode }) {
  if (!result) return null;

  if (mode === "character") return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
      {result.concept_image_url && (
        <img src={result.concept_image_url} alt="concept" style={{ width:"100%", borderRadius:12, border:`1px solid ${C.border}`, maxHeight:300, objectFit:"cover" }} />
      )}
      <div style={{ background:C.card, borderRadius:12, padding:"0.8rem", border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:"0.8rem", fontWeight:800, color:"#c084fc", marginBottom:4 }}>{result.name}</div>
        <div style={{ fontSize:"0.68rem", color:C.text, lineHeight:1.5 }}>{result.bio}</div>
        {result.tags?.length > 0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:6 }}>
            {result.tags.map(t => <span key={t} style={{ background:"rgba(124,58,237,0.15)", color:"#c084fc", fontSize:"0.55rem", padding:"2px 6px", borderRadius:10 }}>{t}</span>)}
          </div>
        )}
      </div>
      {result.voice_audio_url && (
        <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"0.6rem", border:"1px solid rgba(34,197,94,0.2)" }}>
          <div style={{ fontSize:"0.6rem", color:"#22c55e", marginBottom:4 }}>🎙️ "{result._voiceLine}"</div>
          <audio controls src={result.voice_audio_url} style={{ width:"100%", filter:"invert(1) hue-rotate(180deg)" }} />
        </div>
      )}
      {result.mesh_topology?.tripo3d_task_id && (
        <div style={{ background:"rgba(0,245,255,0.06)", borderRadius:10, padding:"0.6rem", border:"1px solid rgba(0,245,255,0.2)", fontSize:"0.65rem", color:C.cyan }}>
          🏺 Modelo 3D generándose — Task: <code style={{ color:"#c084fc" }}>{result.mesh_topology.tripo3d_task_id}</code>
        </div>
      )}
    </div>
  );

  if (mode === "world") return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
      {result.concept_art_url && (
        <img src={result.concept_art_url} alt="concept" style={{ width:"100%", borderRadius:12, border:`1px solid ${C.border}`, maxHeight:200, objectFit:"cover" }} />
      )}
      {result.cover_image_url && (
        <img src={result.cover_image_url} alt="cover" style={{ width:"100%", borderRadius:12, border:`1px solid ${C.border}`, maxHeight:200, objectFit:"cover" }} />
      )}
      <div style={{ background:C.card, borderRadius:12, padding:"0.8rem", border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:"0.8rem", fontWeight:800, color:"#22c55e", marginBottom:2 }}>{result.title}</div>
        <div style={{ fontSize:"0.6rem", color:C.muted, marginBottom:6 }}>📍 {result.location?.name}</div>
        {result.analysis?.narrative && <div style={{ fontSize:"0.68rem", color:C.text, lineHeight:1.5 }}>{result.analysis.narrative}</div>}
      </div>
    </div>
  );

  if (mode === "game") return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
      {result.cover_image_url && (
        <img src={result.cover_image_url} alt="cover" style={{ width:"100%", borderRadius:12, border:`1px solid ${C.border}`, maxHeight:300, objectFit:"cover" }} />
      )}
      <div style={{ background:C.card, borderRadius:12, padding:"0.8rem", border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:"0.8rem", fontWeight:800, color:C.cyan, marginBottom:4 }}>{result.title}</div>
        <div style={{ fontSize:"0.68rem", color:C.text, lineHeight:1.5 }}>{result.description}</div>
      </div>
      {result.game_design_document && (
        <div style={{ background:"rgba(0,245,255,0.04)", borderRadius:10, padding:"0.7rem", border:`1px solid rgba(0,245,255,0.1)`, maxHeight:200, overflowY:"auto" }}>
          <pre style={{ fontSize:"0.6rem", color:C.muted, whiteSpace:"pre-wrap", fontFamily:"monospace" }}>{result.game_design_document}</pre>
        </div>
      )}
    </div>
  );

  if (mode === "marketing") return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
      {result.poster_url && (
        <img src={result.poster_url} alt="poster" style={{ width:"100%", borderRadius:12, border:`1px solid ${C.border}`, maxHeight:280, objectFit:"cover" }} />
      )}
      {result.synopsis_es && (
        <div style={{ background:C.card, borderRadius:12, padding:"0.8rem", border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Synopsis ES</div>
          <div style={{ fontSize:"0.68rem", color:C.text, lineHeight:1.5 }}>{result.synopsis_es}</div>
        </div>
      )}
      {result.instagram_copy && (
        <div style={{ background:"rgba(233,30,140,0.06)", borderRadius:10, padding:"0.7rem", border:"1px solid rgba(233,30,140,0.2)" }}>
          <div style={{ fontSize:"0.58rem", color:"#e91e8c", fontWeight:700, marginBottom:4 }}>📸 Instagram Copy</div>
          <div style={{ fontSize:"0.65rem", color:C.text, lineHeight:1.5 }}>{result.instagram_copy}</div>
          <button onClick={() => navigator.clipboard.writeText(result.instagram_copy)} style={{
            marginTop:6, background:"rgba(233,30,140,0.1)", border:"1px solid rgba(233,30,140,0.3)",
            borderRadius:6, padding:"2px 8px", color:"#e91e8c", fontSize:"0.58rem", cursor:"pointer", fontFamily:"inherit"
          }}>📋 Copiar</button>
        </div>
      )}
      {result.trailer_script && (
        <div style={{ background:"rgba(245,158,11,0.06)", borderRadius:10, padding:"0.7rem", border:"1px solid rgba(245,158,11,0.2)", maxHeight:180, overflowY:"auto" }}>
          <div style={{ fontSize:"0.58rem", color:"#f59e0b", fontWeight:700, marginBottom:4 }}>🎬 Trailer Script</div>
          <pre style={{ fontSize:"0.6rem", color:C.text, whiteSpace:"pre-wrap", fontFamily:"monospace", lineHeight:1.5 }}>{result.trailer_script}</pre>
        </div>
      )}
    </div>
  );

  if (mode === "assets") return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.5rem" }}>
      {(result.results||result||[]).map((a, i) => a.url ? (
        <div key={i} style={{ borderRadius:10, overflow:"hidden", border:`1px solid ${C.border}` }}>
          <img src={a.url} alt={`asset ${i}`} style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }} />
          <div style={{ padding:"0.4rem", fontSize:"0.55rem", color:C.muted, background:C.card }}>{a.prompt?.substring(0,40)}...</div>
        </div>
      ) : (
        <div key={i} style={{ borderRadius:10, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)", padding:"0.6rem", fontSize:"0.6rem", color:"#ef4444" }}>❌ {a.error}</div>
      ))}
    </div>
  );

  if (mode === "voice") return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
      {(result.results||result||[]).map((a,i) => (
        <div key={i} style={{ background:C.card, borderRadius:10, padding:"0.6rem", border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:"0.65rem", color:C.text, marginBottom:4 }}>"{a.text?.substring(0,60)}"</div>
          {a.url ? <audio controls src={a.url} style={{ width:"100%", filter:"invert(1) hue-rotate(180deg)" }} /> : <div style={{ fontSize:"0.6rem", color:"#ef4444" }}>❌ {a.error}</div>}
        </div>
      ))}
    </div>
  );

  return <pre style={{ fontSize:"0.6rem", color:C.muted, whiteSpace:"pre-wrap" }}>{JSON.stringify(result,null,2)}</pre>;
}

export default function HyperBrainScreen({ onNav, showToast }) {
  const [mode, setMode]           = useState("character");
  const [running, setRunning]     = useState(false);
  const [steps, setSteps]         = useState([]);
  const [result, setResult]       = useState(null);
  const [services, setServices]   = useState({});
  const [projects, setProjects]   = useState([]);
  const [selectedProject, setSP]  = useState(null);

  // Form states
  const [charName, setCharName]   = useState("");
  const [charArch, setCharArch]   = useState("Guerrero");
  const [charDesc, setCharDesc]   = useState("");
  const [charVoice, setCharVoice] = useState("SOYHLrjzK2X1ezoPC6cr");
  const [worldQuery, setWorldQuery] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [gameGenre, setGameGenre] = useState("RPG");
  const [gameAtmo, setGameAtmo]   = useState("Dark Fantasy");
  const [assetPrompts, setAssetPs]= useState("Guerrero oscuro con armadura cyberpunk\nMaga élfica con cristales mágicos\nVillano robot biomecánico\nEscenario ruinas cyberpunk");
  const [voiceLines, setVoiceLines]= useState("En el umbral de la oscuridad, solo quedan los valientes.\n¡Por la sangre de mis ancestros, ningún enemigo pasará!\nLa batalla ha terminado. Pero la guerra... apenas comienza.\nInteresante... No esperaba encontrar a alguien como tú aquí.\nEste mundo no merece mi compasión, pero lo protegeré.");
  const [voiceVoiceId, setVVoice] = useState("SOYHLrjzK2X1ezoPC6cr");

  useEffect(() => {
    // Leer config guardada
    try {
      initHyperBrain();
    } catch {}
    setServices(ALL_SERVICES_STATUS());
    base44.entities.GameProject.list("-updated_date", 20).then(d => {
      setProjects(d||[]);
      if (d?.[0]) setSP(d[0]);
    }).catch(()=>{});
  }, []);

  const addStep = (type, msg) => setSteps(s => [...s, { type, msg, t: new Date().toLocaleTimeString("es") }]);

  const run = async () => {
    setRunning(true);
    setSteps([]);
    setResult(null);
    const onStep = (type, data) => {
      const msgs = { start:"🚀 Iniciando...", lore:"🧠 Manus generando lore...", assets:"🎨 Replicate + Tripo3D en paralelo...", voice:"🎙️ ElevenLabs generando voz...", gdd:"📋 Manus creando GDD...", art:"🖼️ Replicate generando arte...", copy:"✍️ Manus redactando copy...", poster:"🎨 Replicate generando póster...", generating:"⚡ Generando...", done:"✅ ¡Todo listo!" };
      const msg = typeof data === "string" ? data : (msgs[type] || type);
      addStep(type, msg);
    };

    try {
      let res;
      if (mode === "character") {
        if (!charName.trim()) { showToast("⚠️ Escribe el nombre del personaje", "warning"); setRunning(false); return; }
        res = await HyperBrain.forgeCharacter({ name:charName, archetype:charArch, description:charDesc, voiceId:charVoice, onStep });
        // Guardar en BD automáticamente
        try {
          const created = await base44.entities.GameCharacter.create({
            name: res.name, archetype: res.archetype, bio: res.bio, gender: "Desconocido",
            lore_prompt: res.lore_prompt || "", tags: res.tags || [],
            concept_image_url: res.concept_image_url || null,
            voice_audio_url: res.voice_audio_url || null,
            mesh_topology: res.mesh_topology || null,
            decision_matrix: res.decision_matrix ? JSON.stringify(res.decision_matrix) : null
          });
          addStep("saved", `💾 Personaje guardado en BD — ID: ${created.id.substring(0,8)}...`);
        } catch(e) { addStep("error", `⚠️ No se pudo guardar en BD: ${e.message}`); }
      }
      else if (mode === "world") {
        if (!worldQuery.trim()) { showToast("⚠️ Escribe una ciudad o zona", "warning"); setRunning(false); return; }
        addStep("info", `🗺️ Buscando ${worldQuery} en Google Maps...`);
        const searchRes = await base44.functions.invoke("worldBuilderMaps", { mode:"search", payload:{ query: worldQuery }});
        const places = searchRes.data?.places || [];
        if (!places.length) { addStep("error", "No se encontraron lugares"); setRunning(false); return; }
        const place = places[0];
        addStep("info", `📍 Analizando ${place.name}...`);
        addStep("info", "🧠 Gemini convirtiendo zona real en escenario...");
        addStep("info", "🎨 Replicate generando concept art...");
        const analyzeRes = await base44.functions.invoke("worldBuilderMaps", {
          mode:"analyze", payload:{ place_id: place.place_id, lat: place.lat, lng: place.lng, name: place.name, address: place.address }
        });
        const d = analyzeRes.data;
        addStep("info", "🎮 Generando GDD y juego completo...");
        const gameRes = await base44.functions.invoke("worldBuilderMaps", {
          mode:"generate_game", payload:{ location: d.location, analysis: d.analysis, genre: gameGenre }
        });
        const gd = gameRes.data;
        try {
          let gddParsed = {};
          try { gddParsed = JSON.parse(gd.gdd.replace(/```json|```/g,"").trim()); } catch {}
          const created = await base44.entities.GameProject.create({
            title: gd.title || d.analysis?.level_name || place.name,
            genre: gd.genre || gameGenre, format:"2D", engine:"Phaser.js",
            status:"draft", description: gddParsed.synopsis || "",
            game_design_document: gd.gdd, cover_image_url: gd.cover_image_url,
            atmosphere: d.analysis?.atmosphere || "Realista",
            global_context:{ location: d.location, analysis: d.analysis, world_builder: true }
          });
          addStep("saved", `💾 Juego guardado — ID: ${created.id.substring(0,8)}...`);
        } catch {}
        res = { ...gd, concept_art_url: d.concept_art_url, analysis: d.analysis, location: d.location };
      }
      else if (mode === "game") {
        if (!gameTitle.trim()) { showToast("⚠️ Escribe el título del juego", "warning"); setRunning(false); return; }
        res = await HyperBrain.genesisGame({ title:gameTitle, genre:gameGenre, atmosphere:gameAtmo, onStep });
        try {
          const created = await base44.entities.GameProject.create({
            title: res.title, genre: res.genre, format: "2D", engine: "Phaser.js",
            atmosphere: res.atmosphere, status: "draft",
            description: res.description, game_design_document: res.game_design_document,
            combat_system: res.combat_system, npc_density: res.npc_density,
            global_context: res.global_context, cover_image_url: res.cover_image_url,
            sales_description: res.sales_description
          });
          addStep("saved", `💾 Juego guardado en BD — ID: ${created.id.substring(0,8)}...`);
        } catch(e) { addStep("error", `⚠️ No se pudo guardar en BD: ${e.message}`); }
      }
      else if (mode === "marketing") {
        if (!selectedProject) { showToast("⚠️ Selecciona un proyecto", "warning"); setRunning(false); return; }
        res = await HyperBrain.marketingBlitz({ project: selectedProject, onStep });
        try {
          const kit = await base44.entities.MarketingKit.create({
            project_id: selectedProject.id,
            poster_url: res.poster_url, poster_prompt: res._posterPrompt,
            trailer_script: res.trailer_script,
            synopsis_es: res.synopsis_es, synopsis_en: res.synopsis_en, synopsis_fr: res.synopsis_fr,
            shopify_description: res.shopify_description,
            seo_tags: res.seo_tags || [], status: "ready"
          });
          addStep("saved", `💾 Marketing Kit guardado — ID: ${kit.id.substring(0,8)}...`);
        } catch(e) { addStep("error", `⚠️ No se pudo guardar: ${e.message}`); }
      }
      else if (mode === "assets") {
        const prompts = assetPrompts.split("\n").map(s=>s.trim()).filter(Boolean);
        if (!prompts.length) { showToast("⚠️ Escribe al menos un prompt", "warning"); setRunning(false); return; }
        res = await HyperBrain.assetBatch({ prompts, onStep });
        res = { results: res };
      }
      else if (mode === "voice") {
        const lines = voiceLines.split("\n").map(s=>s.trim()).filter(Boolean);
        if (!lines.length) { showToast("⚠️ Escribe al menos una línea", "warning"); setRunning(false); return; }
        res = await HyperBrain.voiceBatch({ lines, voiceId: voiceVoiceId, onStep });
        res = { results: res };
      }
      setResult(res);
      showToast("🧠 Hyper Brain completado", "success");
    } catch(e) {
      addStep("error", e.message);
      showToast(`❌ Error: ${e.message}`, "error");
    }
    setRunning(false);
  };

  const currentMode = MODES.find(m => m.id === mode);

  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver</button>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,245,255,0.08))", borderRadius:16, padding:"1rem", border:`1px solid rgba(124,58,237,0.3)`, marginBottom:"1rem" }}>
        <div style={{ fontSize:"1.2rem", marginBottom:4 }}>🧠</div>
        <div style={{ fontSize:"1rem", fontWeight:900, color:"#fff", letterSpacing:1 }}>HYPER BRAIN</div>
        <div style={{ fontSize:"0.65rem", color:C.muted, marginBottom:"0.8rem" }}>6 IAs en paralelo — ElevenLabs · Replicate · Tripo3D · Manus · <span style={{color:"#4285f4"}}>Gemini ✨</span> · <span style={{color:"#22c55e"}}>🌍 Maps</span></div>
        {/* Status de services */}
        <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
          {Object.values(services).map(s => <ServiceBadge key={s.name} {...s} />)}
        </div>
      </div>

      {/* MODO SELECTOR */}
      <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem", marginBottom:"1rem" }}>
        {MODES.map(m => (
          <div key={m.id} onClick={() => { setMode(m.id); setResult(null); setSteps([]); }} style={{
            background: mode===m.id ? `${m.color}18` : C.card,
            border:`1px solid ${mode===m.id ? m.color+"55" : C.border}`,
            borderRadius:12, padding:"0.7rem 0.9rem", cursor:"pointer",
            display:"flex", alignItems:"center", gap:"0.7rem", transition:"all 0.15s"
          }}>
            <span style={{ fontSize:"1.3rem", flexShrink:0 }}>{m.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"0.78rem", fontWeight:800, color: mode===m.id ? m.color : C.text }}>{m.label}</div>
              <div style={{ fontSize:"0.6rem", color:C.muted }}>{m.desc}</div>
            </div>
            <div style={{ background:`${m.color}18`, border:`1px solid ${m.color}33`, borderRadius:20, padding:"2px 8px", fontSize:"0.55rem", color:m.color, fontWeight:700, flexShrink:0 }}>⚡ {m.time}</div>
          </div>
        ))}
      </div>

      {/* FORMULARIO SEGÚN MODO */}
      <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${currentMode?.color}33`, marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.62rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.8rem" }}>{currentMode?.icon} {currentMode?.label}</div>

        {mode === "character" && (
          <>
            <div style={{ marginBottom:"0.6rem" }}>
              <label style={labelStyle}>Nombre *</label>
              <input style={inputStyle} value={charName} onChange={e=>setCharName(e.target.value)} placeholder="Adrián Voss, Lía..." />
            </div>
            <div style={{ marginBottom:"0.6rem" }}>
              <label style={labelStyle}>Arquetipo</label>
              <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                {ARCHETYPE_OPTIONS.map(a => (
                  <button key={a} onClick={()=>setCharArch(a)} style={{ background: charArch===a ? "rgba(192,132,252,0.2)" : "transparent", border:`1px solid ${charArch===a ? "#c084fc" : C.border}`, borderRadius:20, padding:"2px 8px", color: charArch===a ? "#c084fc" : C.muted, fontSize:"0.62rem", cursor:"pointer", fontFamily:"inherit" }}>{a}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:"0.6rem" }}>
              <label style={labelStyle}>Descripción (opcional)</label>
              <input style={inputStyle} value={charDesc} onChange={e=>setCharDesc(e.target.value)} placeholder="Un guerrero oscuro con poderes cristalinos..." />
            </div>
            <div>
              <label style={labelStyle}>Voz ElevenLabs</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.3rem" }}>
                {VOICE_OPTIONS.map(v => (
                  <div key={v.id} onClick={()=>setCharVoice(v.id)} style={{ background: charVoice===v.id ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.05)", border:`1px solid ${charVoice===v.id ? "rgba(124,58,237,0.5)" : C.border}`, borderRadius:8, padding:"0.4rem", cursor:"pointer", textAlign:"center" }}>
                    <div style={{ fontSize:"0.9rem" }}>{v.emoji}</div>
                    <div style={{ fontSize:"0.55rem", color: charVoice===v.id ? "#c084fc" : C.muted, fontWeight:700 }}>{v.name.split("—")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {mode === "world" && (
          <div>
            <div style={{ marginBottom:"0.6rem" }}>
              <label style={labelStyle}>Ciudad o zona del mundo *</label>
              <input style={inputStyle} value={worldQuery} onChange={e=>setWorldQuery(e.target.value)} placeholder="Shinjuku Tokyo, Barrio Gótico Barcelona, Favela Rio..." />
            </div>
            <div>
              <label style={labelStyle}>Género del juego</label>
              <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                {GENRE_OPTIONS.map(g => (
                  <button key={g} onClick={()=>setGameGenre(g)} style={{ background: gameGenre===g ? "rgba(34,197,94,0.15)" : "transparent", border:`1px solid ${gameGenre===g ? "#22c55e" : C.border}`, borderRadius:20, padding:"2px 8px", color: gameGenre===g ? "#22c55e" : C.muted, fontSize:"0.62rem", cursor:"pointer", fontFamily:"inherit" }}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop:"0.6rem", background:"rgba(34,197,94,0.06)", borderRadius:10, padding:"0.6rem", border:"1px solid rgba(34,197,94,0.2)", fontSize:"0.62rem", color:"#22c55e" }}>
              🌍 Google Maps → 🧠 Gemini analiza zona → 🎨 Replicate genera arte → 🎮 GDD completo guardado
            </div>
          </div>
        )}

        {mode === "game" && (
          <>
            <div style={{ marginBottom:"0.6rem" }}>
              <label style={labelStyle}>Título *</label>
              <input style={inputStyle} value={gameTitle} onChange={e=>setGameTitle(e.target.value)} placeholder="El Resurgir del Pingüino de Cristal..." />
            </div>
            <div style={{ marginBottom:"0.6rem" }}>
              <label style={labelStyle}>Género</label>
              <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                {GENRE_OPTIONS.map(g => (
                  <button key={g} onClick={()=>setGameGenre(g)} style={{ background: gameGenre===g ? "rgba(0,245,255,0.15)" : "transparent", border:`1px solid ${gameGenre===g ? C.cyan : C.border}`, borderRadius:20, padding:"2px 8px", color: gameGenre===g ? C.cyan : C.muted, fontSize:"0.62rem", cursor:"pointer", fontFamily:"inherit" }}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Atmósfera</label>
              <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                {ATMO_OPTIONS.map(a => (
                  <button key={a} onClick={()=>setGameAtmo(a)} style={{ background: gameAtmo===a ? "rgba(192,132,252,0.15)" : "transparent", border:`1px solid ${gameAtmo===a ? "#c084fc" : C.border}`, borderRadius:20, padding:"2px 8px", color: gameAtmo===a ? "#c084fc" : C.muted, fontSize:"0.62rem", cursor:"pointer", fontFamily:"inherit" }}>{a}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {mode === "marketing" && (
          <div>
            <label style={labelStyle}>Proyecto</label>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem" }}>
              {projects.map(p => (
                <div key={p.id} onClick={()=>setSP(p)} style={{ background: selectedProject?.id===p.id ? "rgba(245,158,11,0.1)" : "transparent", border:`1px solid ${selectedProject?.id===p.id ? "#f59e0b55" : C.border}`, borderRadius:10, padding:"0.55rem 0.7rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  <div style={{ width:32, height:32, borderRadius:6, background: p.cover_image_url ? `url(${p.cover_image_url}) center/cover` : "linear-gradient(135deg,#7c3aed,#e91e8c)", flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"0.72rem", color:C.text, fontWeight:700 }}>{p.title}</div>
                    <div style={{ fontSize:"0.58rem", color:C.muted }}>{p.genre} · {p.atmosphere || "Dark Fantasy"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === "assets" && (
          <div>
            <label style={labelStyle}>Prompts (uno por línea)</label>
            <textarea style={{ ...inputStyle, height:120, resize:"vertical" }} value={assetPrompts} onChange={e=>setAssetPs(e.target.value)} placeholder="Guerrero oscuro cyberpunk&#10;Mago élfico con cristales&#10;Escenario post-apocalíptico" />
            <div style={{ fontSize:"0.55rem", color:C.muted }}>{assetPrompts.split("\n").filter(Boolean).length} imágenes · ~{assetPrompts.split("\n").filter(Boolean).length * 8}s</div>
          </div>
        )}

        {mode === "voice" && (
          <>
            <div style={{ marginBottom:"0.6rem" }}>
              <label style={labelStyle}>Líneas de voz (una por línea)</label>
              <textarea style={{ ...inputStyle, height:110, resize:"vertical" }} value={voiceLines} onChange={e=>setVoiceLines(e.target.value)} />
              <div style={{ fontSize:"0.55rem", color:C.muted }}>{voiceLines.split("\n").filter(Boolean).length} audios en paralelo</div>
            </div>
            <div>
              <label style={labelStyle}>Voz</label>
              <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                {VOICE_OPTIONS.map(v => (
                  <button key={v.id} onClick={()=>setVVoice(v.id)} style={{ background: voiceVoiceId===v.id ? "rgba(236,72,153,0.15)" : "transparent", border:`1px solid ${voiceVoiceId===v.id ? "#ec4899" : C.border}`, borderRadius:20, padding:"2px 8px", color: voiceVoiceId===v.id ? "#ec4899" : C.muted, fontSize:"0.62rem", cursor:"pointer", fontFamily:"inherit" }}>{v.emoji} {v.name.split("—")[0]}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* BOTÓN RUN */}
      <button onClick={run} disabled={running} style={{
        width:"100%", padding:"1rem", marginBottom:"1rem",
        background: running ? "rgba(124,58,237,0.2)" : `linear-gradient(135deg,${currentMode?.color || "#7c3aed"},${C.cyan})`,
        border:"none", borderRadius:14, color:"#fff", fontWeight:900, fontSize:"1rem",
        cursor: running ? "not-allowed" : "pointer", fontFamily:"inherit",
        letterSpacing:1, boxShadow: running ? "none" : `0 4px 20px ${currentMode?.color || "#7c3aed"}44`
      }}>
        {running ? `🧠 Hyper Brain trabajando... ${steps.length} pasos` : `🧠 ACTIVAR HYPER BRAIN — ${currentMode?.label}`}
      </button>

      {/* LOG */}
      {steps.length > 0 && <StepLog steps={steps} />}

      {/* RESULTADO */}
      {result && (
        <div>
          <div style={{ fontSize:"0.6rem", color:"#22c55e", letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem", fontWeight:700 }}>✅ RESULTADO</div>
          <ResultPanel result={result} mode={mode} />
        </div>
      )}
    </div>
  );
}