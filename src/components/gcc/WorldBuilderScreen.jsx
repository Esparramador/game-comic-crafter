import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { C, SectionTitle, Spinner, inputStyle, labelStyle } from "./shared";

const GENRES = ["RPG","Action","Horror","Stealth","Open World","Adventure","Platformer","Shooter"];

function MapPreview({ location }) {
  if (!location?.static_map_url) return null;
  return (
    <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}`, marginBottom:"0.8rem" }}>
      <img src={location.static_map_url} alt="Mapa" style={{ width:"100%", display:"block", maxHeight:200, objectFit:"cover" }} />
      {location.street_view_url && (
        <div style={{ display:"flex", gap:0 }}>
          <img src={location.street_view_url} alt="Street View" style={{ width:"100%", maxHeight:120, objectFit:"cover", display:"block" }} />
        </div>
      )}
    </div>
  );
}

function StepLog({ steps }) {
  return (
    <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:10, padding:"0.7rem", marginBottom:"0.8rem", maxHeight:120, overflowY:"auto", fontFamily:"monospace" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ fontSize:"0.62rem", color: s.type==="done" ? "#22c55e" : s.type==="error" ? "#ef4444" : "#c084fc", marginBottom:2 }}>
          {s.type==="done" ? "✅" : s.type==="error" ? "❌" : "⚡"} {s.msg}
        </div>
      ))}
    </div>
  );
}

export default function WorldBuilderScreen({ onNav, showToast }) {
  const [view, setView]           = useState("search"); // search | analyze | result
  const [query, setQuery]         = useState("");
  const [searching, setSearching] = useState(false);
  const [places, setPlaces]       = useState([]);
  const [selected, setSelected]   = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [steps, setSteps]         = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [analysis, setAnalysis]   = useState(null);
  const [conceptArt, setConceptArt] = useState(null);
  const [genre, setGenre]         = useState("RPG");
  const [gameTitle, setGameTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [gddResult, setGddResult] = useState(null);

  const addStep = (type, msg) => setSteps(s => [...s, { type, msg }]);

  const searchPlaces = async () => {
    if (!query.trim()) { showToast("⚠️ Escribe una ciudad o zona", "warning"); return; }
    setSearching(true);
    setPlaces([]);
    try {
      const res = await base44.functions.invoke("worldBuilderMaps", { mode: "search", payload: { query } });
      setPlaces(res.data?.places || []);
    } catch(e) { showToast(`❌ ${e.message}`, "error"); }
    setSearching(false);
  };

  const analyzePlace = async (place) => {
    setSelected(place);
    setAnalyzing(true);
    setSteps([]);
    setLocationData(null);
    setAnalysis(null);
    setConceptArt(null);
    setView("analyze");
    addStep("info", `📍 Analizando ${place.name}...`);
    addStep("info", "🗺️ Obteniendo datos de Google Maps...");
    addStep("info", "🧠 Gemini convirtiendo zona real en escenario...");
    addStep("info", "🎨 Replicate generando concept art...");
    try {
      const res = await base44.functions.invoke("worldBuilderMaps", {
        mode: "analyze",
        payload: { place_id: place.place_id, lat: place.lat, lng: place.lng, name: place.name, address: place.address }
      });
      const d = res.data;
      setLocationData(d.location);
      setAnalysis(d.analysis);
      setConceptArt(d.concept_art_url);
      setGameTitle(d.analysis?.level_name || place.name);
      setGenre(d.analysis?.genre_suggestion || "RPG");
      addStep("done", "✅ Análisis completo");
    } catch(e) {
      addStep("error", e.message);
      showToast(`❌ ${e.message}`, "error");
    }
    setAnalyzing(false);
  };

  const generateGame = async () => {
    if (!analysis) return;
    setGenerating(true);
    setGddResult(null);
    setSteps([]);
    addStep("info", "🎮 Generando GDD completo...");
    addStep("info", "🎨 Generando cover art del juego...");
    try {
      const res = await base44.functions.invoke("worldBuilderMaps", {
        mode: "generate_game",
        payload: { location: locationData, analysis, genre, game_title: gameTitle }
      });
      const d = res.data;
      setGddResult(d);
      // Guardar en BD
      try {
        let gddParsed = {};
        try { gddParsed = JSON.parse(d.gdd.replace(/```json|```/g,"").trim()); } catch {}
        await base44.entities.GameProject.create({
          title: d.title || gameTitle,
          genre: d.genre || genre,
          format: "2D", engine: "Phaser.js",
          status: "draft",
          description: gddParsed.synopsis || `Juego basado en ${locationData?.name}`,
          game_design_document: d.gdd,
          cover_image_url: d.cover_image_url,
          atmosphere: analysis.atmosphere || "Realista",
          global_context: { location: locationData, analysis, world_builder: true }
        });
        addStep("done", "💾 Proyecto guardado en Mis Juegos");
      } catch {}
      addStep("done", "✅ ¡Juego generado!");
      showToast("🗺️ ¡Juego del mundo real creado!", "success");
      setView("result");
    } catch(e) {
      addStep("error", e.message);
      showToast(`❌ ${e.message}`, "error");
    }
    setGenerating(false);
  };

  // ── VIEW: RESULT ──
  if (view === "result" && gddResult) {
    let gddParsed = {};
    try { gddParsed = JSON.parse(gddResult.gdd.replace(/```json|```/g,"").trim()); } catch {}
    return (
      <div style={{ padding:"1rem" }}>
        <button onClick={() => setView("search")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0 }}>← Nueva Búsqueda</button>
        <SectionTitle>🗺️ Juego Generado</SectionTitle>

        {gddResult.cover_image_url && (
          <img src={gddResult.cover_image_url} alt="cover" style={{ width:"100%", borderRadius:14, border:`1px solid ${C.border}`, maxHeight:240, objectFit:"cover", marginBottom:"0.8rem" }} />
        )}

        <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}`, marginBottom:"0.7rem" }}>
          <div style={{ fontSize:"0.9rem", fontWeight:900, color:C.cyan, marginBottom:4 }}>{gddResult.title}</div>
          <div style={{ fontSize:"0.62rem", color:"#22c55e", marginBottom:"0.5rem" }}>📍 Basado en: {locationData?.name}</div>
          <div style={{ fontSize:"0.72rem", color:C.text, lineHeight:1.6 }}>{gddParsed.synopsis || ""}</div>
        </div>

        {gddParsed.mechanics?.length > 0 && (
          <div style={{ background:"rgba(0,245,255,0.04)", borderRadius:12, padding:"0.8rem", border:`1px solid rgba(0,245,255,0.15)`, marginBottom:"0.7rem" }}>
            <div style={{ fontSize:"0.6rem", color:C.cyan, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>⚙️ Mecánicas Core</div>
            {gddParsed.mechanics.slice(0,5).map((m,i) => (
              <div key={i} style={{ fontSize:"0.68rem", color:C.text, marginBottom:4, display:"flex", gap:6 }}>
                <span style={{ color:C.cyan, flexShrink:0 }}>{i+1}.</span>{m}
              </div>
            ))}
          </div>
        )}

        {gddParsed.enemies?.length > 0 && (
          <div style={{ background:"rgba(239,68,68,0.04)", borderRadius:12, padding:"0.8rem", border:"1px solid rgba(239,68,68,0.15)", marginBottom:"0.7rem" }}>
            <div style={{ fontSize:"0.6rem", color:"#ef4444", letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>⚔️ Enemigos</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem" }}>
              {gddParsed.enemies.slice(0,4).map((e,i) => (
                <div key={i} style={{ background:"rgba(239,68,68,0.08)", borderRadius:8, padding:"0.4rem" }}>
                  <div style={{ fontSize:"0.68rem", fontWeight:700, color:C.text }}>{e.name}</div>
                  <div style={{ fontSize:"0.55rem", color:C.muted }}>HP:{e.hp} DMG:{e.dmg}</div>
                  <div style={{ fontSize:"0.55rem", color:"#ef4444" }}>{e.special}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.5rem" }}>
          <button onClick={() => { onNav("create"); }} style={{ flex:1, background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none", borderRadius:10, padding:"0.7rem", color:"#fff", fontWeight:800, fontSize:"0.78rem", cursor:"pointer", fontFamily:"inherit" }}>
            🎮 Ver en Mis Juegos
          </button>
          <button onClick={() => { setView("search"); setGddResult(null); setPlaces([]); setQuery(""); }} style={{ flex:1, background:"rgba(0,245,255,0.08)", border:`1px solid rgba(0,245,255,0.3)`, borderRadius:10, padding:"0.7rem", color:C.cyan, fontWeight:800, fontSize:"0.78rem", cursor:"pointer", fontFamily:"inherit" }}>
            🗺️ Nueva Zona
          </button>
        </div>
      </div>
    );
  }

  // ── VIEW: ANALYZE ──
  if (view === "analyze") {
    return (
      <div style={{ padding:"1rem" }}>
        <button onClick={() => setView("search")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0 }}>← Buscar otra zona</button>
        <SectionTitle>🗺️ Analizando: {selected?.name}</SectionTitle>

        {steps.length > 0 && <StepLog steps={steps} />}

        {analyzing && (
          <div style={{ textAlign:"center", padding:"2rem 0", color:C.muted, fontSize:"0.75rem" }}>
            <div style={{ width:36, height:36, border:`2px solid rgba(124,58,237,0.2)`, borderTopColor:"#7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 0.8rem" }} />
            🧠 Hyper Brain analizando la zona real...
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {!analyzing && analysis && (
          <>
            <MapPreview location={locationData} />

            {conceptArt && (
              <img src={conceptArt} alt="concept" style={{ width:"100%", borderRadius:12, border:`1px solid ${C.border}`, maxHeight:200, objectFit:"cover", marginBottom:"0.8rem" }} />
            )}

            <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid ${C.border}`, marginBottom:"0.8rem" }}>
              <div style={{ fontSize:"0.85rem", fontWeight:900, color:C.cyan, marginBottom:4 }}>{analysis.level_name}</div>
              <div style={{ fontSize:"0.6rem", color:"#c084fc", marginBottom:"0.5rem" }}>{analysis.atmosphere} · {analysis.genre_suggestion}</div>
              <div style={{ fontSize:"0.7rem", color:C.text, lineHeight:1.6, marginBottom:"0.6rem" }}>{analysis.narrative}</div>

              {analysis.real_world_hook && (
                <div style={{ background:"rgba(34,197,94,0.06)", borderRadius:8, padding:"0.6rem", border:"1px solid rgba(34,197,94,0.2)", fontSize:"0.65rem", color:"#22c55e" }}>
                  🌍 {analysis.real_world_hook}
                </div>
              )}
            </div>

            {analysis.key_landmarks?.length > 0 && (
              <div style={{ background:"rgba(124,58,237,0.06)", borderRadius:12, padding:"0.8rem", border:`1px solid rgba(124,58,237,0.2)`, marginBottom:"0.8rem" }}>
                <div style={{ fontSize:"0.6rem", color:"#c084fc", letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>📍 Puntos Clave del Nivel</div>
                {analysis.key_landmarks.map((lm,i) => (
                  <div key={i} style={{ fontSize:"0.68rem", color:C.text, marginBottom:3, display:"flex", gap:6 }}>
                    <span style={{ color:"#c084fc" }}>◆</span>{lm}
                  </div>
                ))}
              </div>
            )}

            {analysis.game_mechanics?.length > 0 && (
              <div style={{ background:"rgba(0,245,255,0.04)", borderRadius:12, padding:"0.8rem", border:`1px solid rgba(0,245,255,0.15)`, marginBottom:"0.8rem" }}>
                <div style={{ fontSize:"0.6rem", color:C.cyan, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>⚙️ Mecánicas Sugeridas</div>
                {analysis.game_mechanics.map((m,i) => <div key={i} style={{ fontSize:"0.68rem", color:C.text, marginBottom:3 }}>• {m}</div>)}
              </div>
            )}

            {/* Configurar juego */}
            <div style={{ background:C.card, borderRadius:12, padding:"0.9rem", border:`1px solid rgba(124,58,237,0.3)`, marginBottom:"0.8rem" }}>
              <div style={{ fontSize:"0.62rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.7rem" }}>🎮 Configurar Juego</div>
              <div style={{ marginBottom:"0.6rem" }}>
                <label style={labelStyle}>Título del Juego</label>
                <input style={inputStyle} value={gameTitle} onChange={e => setGameTitle(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Género</label>
                <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                  {GENRES.map(g => (
                    <button key={g} onClick={() => setGenre(g)} style={{ background: genre===g ? "rgba(0,245,255,0.15)" : "transparent", border:`1px solid ${genre===g ? C.cyan : C.border}`, borderRadius:20, padding:"2px 8px", color: genre===g ? C.cyan : C.muted, fontSize:"0.62rem", cursor:"pointer", fontFamily:"inherit" }}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            {steps.length > 0 && <StepLog steps={steps} />}

            <button onClick={generateGame} disabled={generating} style={{
              width:"100%", padding:"1rem",
              background: generating ? "rgba(124,58,237,0.2)" : "linear-gradient(135deg,#22c55e,#00f5ff)",
              border:"none", borderRadius:14, color:"#000", fontWeight:900, fontSize:"0.95rem",
              cursor: generating ? "not-allowed" : "pointer", fontFamily:"inherit", letterSpacing:1
            }}>
              {generating ? "🧠 Generando Juego..." : "🎮 GENERAR JUEGO COMPLETO CON HYPER BRAIN"}
            </button>
          </>
        )}
      </div>
    );
  }

  // ── VIEW: SEARCH ──
  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{ background:"transparent", border:"none", color:C.muted, fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0 }}>← Volver</button>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,rgba(34,197,94,0.1),rgba(0,245,255,0.08))", borderRadius:16, padding:"1rem", border:"1px solid rgba(34,197,94,0.3)", marginBottom:"1rem", textAlign:"center" }}>
        <div style={{ fontSize:"2rem", marginBottom:4 }}>🌍</div>
        <div style={{ fontSize:"1rem", fontWeight:900, color:"#fff", letterSpacing:1 }}>WORLD BUILDER</div>
        <div style={{ fontSize:"0.65rem", color:C.muted }}>Google Maps + Hyper Brain → Escenarios de Juego Reales</div>
        <div style={{ display:"flex", gap:"0.4rem", justifyContent:"center", marginTop:"0.6rem", flexWrap:"wrap" }}>
          {["🗺️ Google Maps","🧠 Gemini","🎨 Replicate"].map(s => (
            <span key={s} style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:20, padding:"2px 8px", fontSize:"0.58rem", color:"#22c55e", fontWeight:700 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom:"0.8rem" }}>
        <label style={labelStyle}>🔍 Busca una ciudad, barrio o zona del mundo</label>
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <input
            style={{ ...inputStyle, flex:1 }}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchPlaces()}
            placeholder="Tokio, Barrio Gótico Barcelona, Times Square..."
          />
          <button onClick={searchPlaces} disabled={searching} style={{
            background:"linear-gradient(135deg,#22c55e,#00f5ff)", border:"none",
            borderRadius:10, padding:"0 1rem", color:"#000", fontWeight:800,
            fontSize:"0.78rem", cursor: searching ? "not-allowed" : "pointer", fontFamily:"inherit", flexShrink:0
          }}>{searching ? "..." : "Buscar"}</button>
        </div>
      </div>

      {/* Quick Examples */}
      <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"1rem" }}>
        {["Shinjuku Tokyo","Barrio Gótico Barcelona","Colosseum Rome","Shibuya Crossing","Times Square NYC","Favela Rio de Janeiro"].map(ex => (
          <button key={ex} onClick={() => { setQuery(ex); }} style={{
            background:"rgba(124,58,237,0.08)", border:`1px solid ${C.border}`,
            borderRadius:20, padding:"2px 8px", color:C.muted, fontSize:"0.6rem",
            cursor:"pointer", fontFamily:"inherit"
          }}>{ex}</button>
        ))}
      </div>

      {searching && (
        <div style={{ textAlign:"center", padding:"1.5rem 0", color:C.muted, fontSize:"0.75rem" }}>
          <div style={{ width:28, height:28, border:`2px solid rgba(34,197,94,0.2)`, borderTopColor:"#22c55e", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 0.6rem" }} />
          Buscando en Google Maps...
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* Results */}
      {places.length > 0 && (
        <div>
          <div style={{ fontSize:"0.6rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>{places.length} Lugares encontrados — Selecciona para analizar</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
            {places.map((p, i) => (
              <div key={i} onClick={() => analyzePlace(p)} style={{
                background:C.card, borderRadius:12, padding:"0.8rem",
                border:`1px solid ${C.border}`, cursor:"pointer", transition:"all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(34,197,94,0.5)"}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"0.82rem", fontWeight:700, color:C.text, marginBottom:2 }}>📍 {p.name}</div>
                    <div style={{ fontSize:"0.62rem", color:C.muted, lineHeight:1.4 }}>{p.address}</div>
                    {p.types?.length > 0 && (
                      <div style={{ display:"flex", gap:"0.3rem", marginTop:5, flexWrap:"wrap" }}>
                        {p.types.slice(0,3).map(t => (
                          <span key={t} style={{ background:"rgba(124,58,237,0.1)", color:"#c084fc", fontSize:"0.5rem", padding:"1px 5px", borderRadius:6 }}>{t.replace(/_/g," ")}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ background:"linear-gradient(135deg,#22c55e,#00f5ff)", borderRadius:20, padding:"3px 10px", fontSize:"0.6rem", color:"#000", fontWeight:900, flexShrink:0, marginLeft:8 }}>
                    Analizar →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searching && places.length === 0 && query && (
        <div style={{ textAlign:"center", padding:"2rem", color:C.muted }}>
          <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>🗺️</div>
          <div style={{ fontSize:"0.75rem" }}>No se encontraron lugares. Intenta otra búsqueda.</div>
        </div>
      )}

      {!query && places.length === 0 && (
        <div style={{ textAlign:"center", padding:"2rem", color:C.muted }}>
          <div style={{ fontSize:"3rem", marginBottom:"0.6rem" }}>🌍</div>
          <div style={{ fontSize:"0.8rem", fontWeight:700, color:C.text, marginBottom:"0.3rem" }}>Cualquier lugar del mundo</div>
          <div style={{ fontSize:"0.68rem" }}>→ convertido en escenario de juego épico</div>
        </div>
      )}
    </div>
  );
}