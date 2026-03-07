import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { ElevenService } from "@/api/services";
import { C, SectionTitle, Spinner, labelStyle, inputStyle, Pill } from "./shared";

// Voices conocidas de nuestros personajes
const KNOWN_VOICES = [
  { id:"SOYHLrjzK2X1ezoPC6cr", name:"Harry — Fierce Warrior", emoji:"⚔️", char:"Adrián Voss" },
  { id:"JBFqnCBsd6RMkjVDRZzb", name:"George — Narrator",     emoji:"📖", char:"Narrador" },
  { id:"CwhRBWXzGAHq8TQ4Fs17", name:"Roger — Master Phonetic",emoji:"🎓", char:"Adrián Voss" },
  { id:"pNInz6obpgDQGcFmaJgB", name:"Adam — Deep",            emoji:"🌑", char:"Libre" },
  { id:"EXAVITQu4vr4xnSDxMaL", name:"Bella — Soft",          emoji:"🌸", char:"Libre" },
  { id:"MF3mGyEYCl7XYWbV9V6O", name:"Elli — Energetic",      emoji:"⚡", char:"Libre" },
  { id:"TxGEqnHWrfWFTfGW9XjX", name:"Josh — Deep",           emoji:"🔊", char:"Libre" },
  { id:"VR6AewLTigWG4xSOukaG", name:"Arnold — Powerful",     emoji:"💪", char:"Libre" },
  { id:"yoZ06aMxZJJ28mfd3POQ", name:"Sam — Raspy",           emoji:"🔥", char:"Libre" },
];

const PRESETS = [
  { label:"Batalla",       text:"¡Por la sangre de mis ancestros, ningún enemigo pasará! ¡RAAAH!", stability:0.45, style:0.55 },
  { label:"Diálogo épico", text:"En el umbral de la oscuridad, solo quedan los valientes. Este mundo no merece mi compasión, pero lo protegeré de todas formas.", stability:0.65, style:0.30 },
  { label:"Victoria",      text:"Como esperaba. Demasiado fácil. La batalla ha terminado... pero la guerra apenas comienza.", stability:0.70, style:0.20 },
  { label:"Muerte",        text:"No... esto no puede ser el final... Aún tengo... misión que cumplir...", stability:0.80, style:0.10 },
  { label:"Misterio",      text:"Interesante... No esperaba encontrar a alguien como tú aquí. Dime... ¿qué te trae al borde del abismo?", stability:0.72, style:0.25 },
  { label:"Trailer",       text:"Un mundo al borde del colapso. Un guerrero que no debería existir. El resurgir del Pingüino de Cristal. La oscuridad tiene nombre... y ese nombre... eres tú.", stability:0.60, style:0.40 },
];

export default function VoiceScreen({ onNav, showToast }) {
  const [voiceId, setVoiceId]   = useState("SOYHLrjzK2X1ezoPC6cr");
  const [text, setText]         = useState(PRESETS[1].text);
  const [stability, setStab]    = useState(0.65);
  const [similarity, setSim]    = useState(0.80);
  const [style, setStyle]       = useState(0.30);
  const [generating, setGen]    = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [apiVoices, setApiVoices] = useState([]);
  const [loadingVoices, setLoadingV] = useState(false);
  const [savedAudios, setSaved]   = useState([]);
  const [chars, setChars]         = useState([]);
  const [savingTo, setSavingTo]   = useState("");
  const audioRef = useRef(null);
  const hasKey = ElevenService.ok();

  useEffect(() => {
    base44.entities.GameCharacter.list("-created_date", 20).then(d => setChars(d||[])).catch(()=>{});
    // Cargar voces de la API si hay key
    if (hasKey) loadApiVoices();
  }, []);

  const loadApiVoices = async () => {
    setLoadingV(true);
    try {
      const voices = await ElevenService.voices();
      setApiVoices(voices);
    } catch(e) { /* key no configurada aún */ }
    setLoadingV(false);
  };

  const applyPreset = (p) => { setText(p.text); setStab(p.stability); setStyle(p.style); };

  const generate = async () => {
    if (!text.trim()) { showToast("⚠️ Escribe un texto", "warning"); return; }
    if (!hasKey) { showToast("⚠️ Configura tu ElevenLabs API key en ⚙️ Configuración", "warning"); onNav("config"); return; }
    setGen(true);
    setAudioUrl(null);
    try {
      const url = await ElevenService.tts({ voiceId, text, stability, similarityBoost: similarity, style });
      setAudioUrl(url);
      setSaved(p => [{ url, text: text.substring(0,50)+"...", voiceId, date: new Date().toLocaleTimeString("es") }, ...p.slice(0,9)]);
      showToast("🎙️ Audio generado", "success");
      setTimeout(() => audioRef.current?.play(), 100);
    } catch(e) { showToast(`❌ ${e.message}`, "error"); }
    setGen(false);
  };

  const saveToChar = async (charId) => {
    if (!audioUrl) { showToast("⚠️ Genera un audio primero", "warning"); return; }
    setSavingTo(charId);
    try {
      await base44.entities.GameCharacter.update(charId, { voice_audio_url: audioUrl });
      setChars(prev => prev.map(c => c.id===charId ? {...c, voice_audio_url: audioUrl} : c));
      showToast("✅ Audio guardado en el personaje", "success");
    } catch(e) { showToast("❌ Error al guardar", "error"); }
    setSavingTo("");
  };

  const allVoices = apiVoices.length > 0
    ? apiVoices.map(v => ({ id: v.voice_id, name: v.name, emoji:"🎙️", char:"API" }))
    : KNOWN_VOICES;

  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.3rem" }}>
        <SectionTitle>🎙️ Voice Studio</SectionTitle>
        {!hasKey && (
          <button onClick={() => onNav("config")} style={{
            background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
            borderRadius:8, padding:"0.3rem 0.8rem", color:"#ef4444",
            fontSize:"0.62rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
          }}>⚙️ Config Key</button>
        )}
        {hasKey && <Pill color="green">ElevenLabs ✅</Pill>}
      </div>
      <div style={{ fontSize:"0.65rem", color:C.muted, marginBottom:"1.2rem" }}>
        Genera voces en tiempo real para tus personajes con ElevenLabs
      </div>

      {/* Sin key — aviso */}
      {!hasKey && (
        <div style={{ background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:12, padding:"0.9rem", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"0.7rem" }}>
          <span style={{ fontSize:"1.4rem" }}>🔑</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#ef4444" }}>ElevenLabs key no configurada</div>
            <div style={{ fontSize:"0.65rem", color:C.muted }}>Ve a ⚙️ Configuración → introduce tu API key → Guardar</div>
          </div>
          <button onClick={() => onNav("config")} style={{
            background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)",
            borderRadius:8, padding:"0.4rem 0.8rem", color:"#ef4444",
            fontSize:"0.65rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
          }}>Configurar →</button>
        </div>
      )}

      {/* PRESETS */}
      <div style={{ marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>Presets rápidos</div>
        <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{
              background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
              borderRadius:20, padding:"0.25rem 0.7rem", color:"#c084fc",
              fontSize:"0.62rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              transition:"all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(124,58,237,0.08)"}
            >{p.label}</button>
          ))}
        </div>
      </div>

      {/* VOICE SELECTOR */}
      <div style={{ marginBottom:"0.8rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.3rem" }}>
          <label style={labelStyle}>Voz</label>
          {loadingVoices && <span style={{ fontSize:"0.58rem", color:C.muted }}>Cargando voces API...</span>}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0.4rem" }}>
          {allVoices.map(v => (
            <div key={v.id} onClick={() => setVoiceId(v.id)} style={{
              background: voiceId===v.id ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.05)",
              border:`1px solid ${voiceId===v.id ? "rgba(124,58,237,0.5)" : C.border}`,
              borderRadius:10, padding:"0.55rem 0.4rem", cursor:"pointer",
              textAlign:"center", transition:"all 0.15s"
            }}>
              <div style={{ fontSize:"1rem", marginBottom:2 }}>{v.emoji || "🎙️"}</div>
              <div style={{ fontSize:"0.58rem", color: voiceId===v.id ? "#c084fc" : C.text, fontWeight:700, lineHeight:1.2 }}>{v.name.split("—")[0].trim()}</div>
              {v.char && v.char !== "Libre" && <div style={{ fontSize:"0.5rem", color:C.muted }}>{v.char}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* TEXTO */}
      <div style={{ marginBottom:"0.8rem" }}>
        <label style={labelStyle}>Texto a generar</label>
        <textarea
          style={{ ...inputStyle, height:90, resize:"vertical" }}
          placeholder="Escribe el texto que dirá el personaje..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div style={{ fontSize:"0.55rem", color:C.muted, textAlign:"right", marginTop:2 }}>{text.length} caracteres</div>
      </div>

      {/* PARÁMETROS */}
      <div style={{ background:"rgba(124,58,237,0.05)", borderRadius:12, padding:"0.8rem", border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.7rem" }}>Parámetros de voz</div>
        {[
          { label:"Stability", val:stability, set:setStab, desc:"↑ más consistente | ↓ más expresivo" },
          { label:"Similarity Boost", val:similarity, set:setSim, desc:"↑ más fiel a la voz original" },
          { label:"Style", val:style, set:setStyle, desc:"↑ más dramático y estilizado" },
        ].map(p => (
          <div key={p.label} style={{ marginBottom:"0.6rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:"0.62rem", color:C.muted }}>{p.label}</span>
              <span style={{ fontSize:"0.65rem", color:"#c084fc", fontWeight:700 }}>{p.val.toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={p.val}
              onChange={e => p.set(parseFloat(e.target.value))}
              style={{ width:"100%", accentColor:"#7c3aed" }}
            />
            <div style={{ fontSize:"0.52rem", color:C.muted }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* BOTÓN GENERAR */}
      <button onClick={generate} disabled={generating || !hasKey} style={{
        width:"100%", padding:"0.9rem", marginBottom:"1rem",
        background: generating ? "rgba(124,58,237,0.3)" : hasKey ? "linear-gradient(135deg,#7c3aed,#22c55e)" : "rgba(100,100,100,0.2)",
        border:"none", borderRadius:12, color: hasKey ? "#fff" : C.muted,
        fontWeight:900, fontSize:"0.9rem",
        cursor: generating || !hasKey ? "not-allowed" : "pointer",
        fontFamily:"inherit", letterSpacing:1
      }}>
        {generating ? "🎙️ Generando audio..." : hasKey ? "🎙️ GENERAR VOZ" : "🔑 Configura ElevenLabs key primero"}
      </button>

      {/* PLAYER */}
      {audioUrl && (
        <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:"1px solid rgba(34,197,94,0.3)", marginBottom:"1rem" }}>
          <div style={{ fontSize:"0.7rem", color:"#22c55e", fontWeight:700, marginBottom:"0.6rem" }}>🎙️ Audio generado</div>
          <audio ref={audioRef} controls src={audioUrl} style={{ width:"100%", filter:"invert(1) hue-rotate(180deg)" }} />

          {/* Guardar en personaje */}
          {chars.length > 0 && (
            <div style={{ marginTop:"0.8rem" }}>
              <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>Guardar en personaje</div>
              <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                {chars.map(c => (
                  <button key={c.id} onClick={() => saveToChar(c.id)} disabled={savingTo===c.id} style={{
                    background:"rgba(124,58,237,0.1)", border:`1px solid ${C.border}`,
                    borderRadius:20, padding:"0.25rem 0.8rem", color:"#c084fc",
                    fontSize:"0.65rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                  }}>{savingTo===c.id ? "💾..." : `💾 ${c.name}`}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HISTORIAL */}
      {savedAudios.length > 0 && (
        <div>
          <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>Generados esta sesión</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
            {savedAudios.map((a,i) => (
              <div key={i} style={{ background:C.card, borderRadius:10, padding:"0.6rem 0.8rem", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:"0.6rem" }}>
                <span style={{ fontSize:"1.1rem" }}>🎙️</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"0.68rem", color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.text}</div>
                  <div style={{ fontSize:"0.55rem", color:C.muted }}>{a.date}</div>
                </div>
                <audio controls src={a.url} style={{ height:26, minWidth:120, maxWidth:150, filter:"invert(1) hue-rotate(180deg)" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
