import { useState } from "react";
import { C, inputStyle } from "./shared";

// ═══════════════════════════════════════════════════════════════
//  📚 GUÍA EXPERTA — Game Comic Crafter
//  Cómo crear juegos, prompts y publicar sin errores
// ═══════════════════════════════════════════════════════════════

const SECTIONS = [
  {
    id: "start",
    icon: "🚀",
    color: "#00f5ff",
    title: "Inicio Rápido — Tu primer juego en 5 minutos",
    steps: [
      { n:"1", title:"Configura tus APIs", body:"Ve a ⚙️ Config API → introduce tus 5 keys (ElevenLabs, Replicate, Manus, Gemini, Shopify). Pulsa 'Test' en cada una. Sin keys, el Hyper Brain no puede generar." },
      { n:"2", title:"Crea el juego base", body:"Ve a 🎮 Mis Juegos → + Nuevo Juego. Pon un título épico, elige género y motor. Pulsa Crear. Se guarda en tu base de datos al instante." },
      { n:"3", title:"Genera con Hyper Brain", body:"Ve a 🧠 Hyper Brain → modo 'Genesis Juego'. Escribe el título y pulsa ACTIVAR. En ~60s tienes GDD completo + cover art + descripción de venta." },
      { n:"4", title:"Crea tus personajes", body:"Ve a 👥 Personajes → modo 'Forge Personaje'. Nombre + arquetipo → ~90s → lore + concept art + modelo 3D + voz." },
      { n:"5", title:"Publica en Shopify", body:"Ve a 📣 Marketing → genera el kit → botón 'Publicar en Shopify'. Tu juego queda en venta con cover, descripción SEO y precio." },
    ]
  },
  {
    id: "prompts",
    icon: "⚡",
    color: "#c084fc",
    title: "Guía de Prompts — Cómo escribir prompts que vuelen",
    steps: [
      { n:"💡", title:"La estructura base de un prompt ganador", body:`FORMATO: [ROL] + [CONTEXTO] + [TAREA] + [FORMATO SALIDA] + [NIVEL]

EJEMPLO BÁSICO (malo):
"crea un guerrero"

EJEMPLO MAESTRO (bueno):
"Actúa como diseñador de personajes de Blizzard. Crea el lore completo para ADRIÁN VOSS, guerrero oscuro del juego 'El Resurgir del Pingüino de Cristal' (dark fantasy cyberpunk, RPG 2D). Incluye: backstory 200 palabras, motivación, 3 miedos, 3 deseos, 5 tags de personalidad. Responde en JSON puro."` },
      { n:"🎮", title:"Prompts para crear juegos", body:`TEXTO BÁSICO que puedes mejorar:
"Quiero hacer un juego de terror en 2D"

CÓMO LO MEJORA EL HYPER BRAIN:
→ Añade genre/engine/atmosphere automáticamente
→ Genera GDD estructurado con mecánicas
→ Crea prompt de arte coherente con el tono
→ Escribe descripción de venta optimizada SEO

TIP: En ⚡ Prompts tienes la herramienta 'Mejorar Prompt' — escribe tu idea base y te da el prompt maestro.` },
      { n:"🎨", title:"Prompts para imágenes (Replicate/FLUX)", body:`MALO: "guerrero oscuro"
BUENO: "dark fantasy warrior character, full body, ornate black armor with glowing cyan circuits, dramatic rim lighting from below, epic pose, detailed, 8k, concept art AAA, no background"

REGLAS:
✅ Siempre añade el estilo al final (8k, concept art, detailed)
✅ Describe la iluminación (rim light, dramatic, golden hour)
✅ Di qué NO quieres con "no background, no text, no watermark"
✅ Especifica la pose o encuadre (full body, portrait, ¾ view)` },
      { n:"🎙️", title:"Prompts para voz (ElevenLabs)", body:`MALO: "di hola mundo"
BUENO: "En el umbral de la oscuridad, solo quedan los valientes. Este mundo no merece mi compasión... pero lo protegeré de todas formas."

REGLAS:
✅ Frases cortas, máx 2 líneas por generación
✅ Usa pausas con "..." para dramatismo
✅ Empieza in medias res (sin "yo digo que")
✅ Ajusta stability 0.6-0.7 para voz épica consistente
✅ Style 0.3-0.4 para expresividad sin exagerar` },
      { n:"🏺", title:"Prompts para modelos 3D (Tripo3D)", body:`MALO: "personaje de juego"
BUENO: "male warrior character full body, dark cyberpunk armor, glowing blue accents, standing pose, game asset, clean topology, neutral expression, white background"

REGLAS:
✅ Siempre "full body" para personajes completos
✅ "game asset" le dice a Tripo3D que optimice para juegos
✅ "white background" mejora la extracción
✅ Especifica la pose (standing, T-pose, A-pose)
✅ Tarda 2-5 minutos — pon la tarea en cola y sigue trabajando` },
    ]
  },
  {
    id: "workflow",
    icon: "🔄",
    color: "#22c55e",
    title: "Flujo de Trabajo Profesional",
    steps: [
      { n:"📋", title:"Fase 1: Concept (10 min)", body:"1. Escribe el concepto básico del juego en ⚡ Prompts\n2. Usa 'Mejorar Prompt' para expandirlo\n3. Lanza Genesis Juego en Hyper Brain\n4. El GDD y cover se guardan automáticamente" },
      { n:"👥", title:"Fase 2: Personajes (15 min/personaje)", body:"1. Decide nombre y arquetipo\n2. Forge Personaje → todo en paralelo (~90s)\n3. Revisa el lore generado y ajusta si quieres\n4. Regenera el concept art con el prompt mejorado si no convence" },
      { n:"🎵", title:"Fase 3: Audio (5 min)", body:"1. Ve a 🎙️ Voces → elige voz de ElevenLabs\n2. Escribe 5-10 líneas de diálogo épico\n3. Voice Batch → genera todo a la vez\n4. Los audios se guardan en tu Asset Repository" },
      { n:"🎨", title:"Fase 4: Assets (10 min)", body:"1. Asset Batch → lista de prompts de concept art\n2. Descarga los mejores\n3. En 📦 Assets → súbelos y etiquétalos\n4. Márcalos como 'bloqueados' para que no se sobreescriban" },
      { n:"📣", title:"Fase 5: Marketing & Publicación", body:"1. Marketing Blitz → poster + trailer + copy 3 idiomas\n2. Revisa el copy de Instagram → copia y programa\n3. Botón 'Publicar en Shopify'\n4. Comparte la launch URL en redes" },
    ]
  },
  {
    id: "errors",
    icon: "🛡️",
    color: "#f59e0b",
    title: "Resolución de Errores — Sin 400, 401, 403, 500",
    steps: [
      { n:"401", title:"Error 401 — No autorizado", body:"CAUSA: API key incorrecta o caducada\nSOLUCIÓN:\n1. Ve a ⚙️ Config API\n2. Pulsa 'Test' en el servicio que falla\n3. Si falla, copia la key directamente desde el dashboard del proveedor\n4. Pégala de nuevo y guarda\n\nPARA ELEVENLABS: asegúrate de que tu plan tiene créditos. Ve a elevenlabs.io → Billing" },
      { n:"400", title:"Error 400 — Petición incorrecta", body:"CAUSA: El prompt contiene caracteres especiales, es demasiado largo, o el formato es incorrecto\nSOLUCIÓN:\n1. Acorta el prompt a menos de 500 palabras\n2. Elimina emojis si los hay\n3. Para Replicate: el prompt debe ser en INGLÉS\n4. Para ElevenLabs: máx 2500 caracteres por petición" },
      { n:"403", title:"Error 403 — Prohibido", body:"CAUSA: Plan sin acceso a ese modelo/función\nSOLUCIÓN:\n1. Replicate: verifica que tienes créditos en replicate.com\n2. Tripo3D: la key es de por vida, si falla escribe al soporte\n3. ElevenLabs: verifica que el voice_id existe en tu cuenta\n4. Gemini: verifica que la API está activada en Google Cloud Console" },
      { n:"500", title:"Error 500 — Servidor caído", body:"CAUSA: El servicio externo está teniendo problemas\nSOLUCIÓN:\n1. Espera 2-3 minutos y vuelve a intentar\n2. El Hyper Brain usa fallbacks automáticos (Manus→Gemini)\n3. Replicate a veces tarda más — el polling espera hasta 2 minutos\n4. Si persiste, cambia de modelo en el mismo servicio" },
      { n:"⚠️", title:"No se genera nada — Sin error visible", body:"CAUSA: La key está guardada pero no se inyectó en memoria\nSOLUCIÓN:\n1. Ve a ⚙️ Config API → pulsa 'Guardar' aunque no cambies nada\n2. Recarga la app (F5)\n3. Las keys se cargan automáticamente al arrancar\n4. Verifica en la consola del navegador (F12) si hay errores de CORS" },
    ]
  },
  {
    id: "tips",
    icon: "💎",
    color: "#e91e8c",
    title: "Tips Pro — Maximiza la calidad",
    steps: [
      { n:"🎯", title:"Para juegos 2D perfectos (Phaser.js)", body:"1. Usa el Physics Editor para ajustar gravedad antes de generar código\n2. El combo plataformero: gravedad 9.8, friction 0.35, elasticity 0.3\n3. Para juegos de acción: sube speed a 120-160\n4. El GDD generado incluye código Phaser.js base — cópialo a CodeSandbox para probarlo inmediatamente" },
      { n:"🎨", title:"Para concept art cinematográfico", body:"Añade siempre al final del prompt:\n'dramatic rim lighting, 8k, photorealistic, unreal engine 5, artstation trending, hyperdetailed'\n\nPara personajes: añade 'front view, symmetrical, neutral expression, white background' si quieres usar el resultado en Tripo3D" },
      { n:"💰", title:"Para maximizar ventas en Shopify", body:"1. El título debe incluir género: 'Crystal Penguin RPG' no solo 'Crystal Penguin'\n2. Precio óptimo indie: €9.99 - €19.99\n3. Usa las 3 synopsis (ES/EN/FR) — más idiomas = más alcance\n4. Los SEO tags del Marketing Blitz ya están optimizados — úsalos todos" },
      { n:"⚡", title:"Máxima velocidad de producción", body:"STACK PARALELO: lanza Hyper Brain para el juego → mientras se genera, configura las voces → cuando termina el juego, arranca Forge Personaje → cuando terminan los personajes, lanza Voice Batch.\nEn 20 minutos tienes juego + 2 personajes + 10 audios." },
    ]
  }
];

// ── Prompt Enhancer integrado ──
function PromptEnhancer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("imagen");

  const TEMPLATES = {
    imagen: (t) => `${t}, dark fantasy cyberpunk style, dramatic lighting, 8k, concept art AAA, hyperdetailed, artstation trending, no background, no text, no watermark`,
    personaje: (t) => `Game character concept art, ${t}, full body, detailed armor, epic pose, dark fantasy cyberpunk aesthetic, dramatic rim lighting, 8k, artstation quality`,
    juego: (t) => `Actúa como Game Director AAA. Diseña "${t}" — incluye: sinopsis épica, 5 mecánicas core, sistema de combate, árbol de progresión, 10 enemigos con stats. Responde detallado y estructurado.`,
    voz: (t) => `Genera 5 líneas de diálogo épico en español para un personaje de dark fantasy con este concepto: "${t}". Frases cortas, dramáticas, cinematográficas. Sin explicaciones, solo las líneas.`,
    marketing: (t) => `Escribe una descripción de venta para Shopify del juego "${t}" — 200 palabras, épica, con keywords de búsqueda, incluye emojis estratégicos, call to action al final.`,
  };

  const enhance = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setOutput(TEMPLATES[mode](input.trim()));
      setLoading(false);
    }, 400);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div style={{ background:"rgba(124,58,237,0.08)", borderRadius:14, padding:"1rem", border:"1px solid rgba(124,58,237,0.25)", marginBottom:"1.5rem" }}>
      <div style={{ fontSize:"0.72rem", fontWeight:800, color:"#c084fc", marginBottom:"0.6rem" }}>⚡ Mejorador de Prompts Instantáneo</div>
      <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap", marginBottom:"0.6rem" }}>
        {Object.keys(TEMPLATES).map(k => (
          <button key={k} onClick={()=>setMode(k)} style={{
            background: mode===k ? "rgba(124,58,237,0.25)" : "transparent",
            border:`1px solid ${mode===k ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.2)"}`,
            borderRadius:20, padding:"2px 10px", fontSize:"0.6rem",
            color: mode===k ? "#c084fc" : "#5a4080", cursor:"pointer", fontFamily:"inherit"
          }}>{k}</button>
        ))}
      </div>
      <textarea
        style={{ ...inputStyle, height:60, resize:"none", fontSize:"0.75rem", marginBottom:"0.4rem" }}
        placeholder={{ imagen:"Guerrero oscuro con espada...", personaje:"Adrián, guerrero, cicatrices...", juego:"RPG de terror en catacumbas...", voz:"Guerrero frío y calculador...", marketing:"Juego de plataformas indie..." }[mode]}
        value={input} onChange={e=>setInput(e.target.value)}
      />
      <button onClick={enhance} disabled={loading || !input.trim()} style={{
        background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none", borderRadius:8,
        padding:"0.45rem 1.2rem", color:"#fff", fontWeight:700, fontSize:"0.72rem",
        cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontFamily:"inherit", marginBottom:"0.6rem"
      }}>{loading ? "Mejorando..." : "⚡ Mejorar Prompt"}</button>
      {output && (
        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:10, padding:"0.7rem", position:"relative" }}>
          <pre style={{ fontSize:"0.68rem", color:"#e0e8ff", whiteSpace:"pre-wrap", fontFamily:"monospace", lineHeight:1.5, margin:0 }}>{output}</pre>
          <button onClick={copy} style={{
            position:"absolute", top:6, right:6, background:"rgba(124,58,237,0.2)",
            border:"1px solid rgba(124,58,237,0.4)", borderRadius:6, padding:"2px 8px",
            color:"#c084fc", fontSize:"0.55rem", cursor:"pointer", fontFamily:"inherit"
          }}>📋 Copiar</button>
        </div>
      )}
    </div>
  );
}

export default function GuideScreen({ onNav }) {
  const [openSection, setOpenSection] = useState("start");
  const [openStep, setOpenStep] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = SECTIONS.map(s => ({
    ...s,
    steps: s.steps.filter(st =>
      !search || st.title.toLowerCase().includes(search.toLowerCase()) || st.body.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(s => !search || s.steps.length > 0 || s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding:"1rem" }}>
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:"#5a4080",
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      {/* HEADER */}
      <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,245,255,0.05))", borderRadius:16, padding:"1rem 1rem 0.8rem", border:"1px solid rgba(124,58,237,0.25)", marginBottom:"1rem" }}>
        <div style={{ fontSize:"1.2rem", marginBottom:4 }}>📚</div>
        <div style={{ fontSize:"1rem", fontWeight:900, color:"#fff", letterSpacing:1 }}>GUÍA EXPERTA</div>
        <div style={{ fontSize:"0.65rem", color:"#5a4080" }}>Aprende a crear juegos, prompts y publicar sin errores</div>
      </div>

      {/* SEARCH */}
      <input
        style={{ ...inputStyle, marginBottom:"1rem" }}
        placeholder="🔍 Buscar en la guía..."
        value={search} onChange={e=>setSearch(e.target.value)}
      />

      {/* PROMPT ENHANCER */}
      <PromptEnhancer />

      {/* SECCIONES */}
      {filtered.map(section => (
        <div key={section.id} style={{ marginBottom:"0.6rem" }}>
          {/* Section header */}
          <div
            onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
            style={{
              background: openSection===section.id ? `${section.color}12` : "rgba(255,255,255,0.03)",
              border:`1px solid ${openSection===section.id ? section.color+"44" : "rgba(124,58,237,0.15)"}`,
              borderRadius: openSection===section.id ? "12px 12px 0 0" : 12,
              padding:"0.8rem 1rem", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"space-between"
            }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
              <span style={{ fontSize:"1.2rem" }}>{section.icon}</span>
              <span style={{ fontSize:"0.78rem", fontWeight:700, color: openSection===section.id ? section.color : "#e0e8ff" }}>{section.title}</span>
            </div>
            <span style={{ fontSize:"0.65rem", color:"#5a4080" }}>{openSection===section.id ? "▲" : "▼"}</span>
          </div>

          {openSection === section.id && (
            <div style={{ border:`1px solid ${section.color}33`, borderTop:"none", borderRadius:"0 0 12px 12px", overflow:"hidden" }}>
              {section.steps.map((step, si) => (
                <div key={si}>
                  <div
                    onClick={() => setOpenStep(openStep === `${section.id}-${si}` ? null : `${section.id}-${si}`)}
                    style={{
                      padding:"0.7rem 1rem",
                      background: openStep===`${section.id}-${si}` ? "rgba(255,255,255,0.04)" : "transparent",
                      cursor:"pointer", display:"flex", alignItems:"center", gap:"0.7rem",
                      borderTop: si>0 ? "1px solid rgba(124,58,237,0.1)" : "none"
                    }}
                  >
                    <div style={{
                      width:26, height:26, borderRadius:"50%", flexShrink:0,
                      background:`${section.color}22`, border:`1px solid ${section.color}44`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"0.6rem", color:section.color, fontWeight:900
                    }}>{step.n}</div>
                    <div style={{ flex:1, fontSize:"0.75rem", fontWeight:600, color:"#e0e8ff" }}>{step.title}</div>
                    <span style={{ fontSize:"0.6rem", color:"#5a4080" }}>{openStep===`${section.id}-${si}` ? "▲" : "▼"}</span>
                  </div>
                  {openStep === `${section.id}-${si}` && (
                    <div style={{ padding:"0.7rem 1rem 0.8rem 3.4rem", background:"rgba(0,0,0,0.2)", borderTop:"1px solid rgba(124,58,237,0.1)" }}>
                      <pre style={{ fontSize:"0.7rem", color:"#a0a8c0", whiteSpace:"pre-wrap", fontFamily:"inherit", lineHeight:1.7, margin:0 }}>{step.body}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ textAlign:"center", padding:"1.5rem 0", fontSize:"0.6rem", color:"#3a2860" }}>
        Game Comic Crafter · Guía v2.0 · 5 IAs trabajando por ti 🧠
      </div>
    </div>
  );
}
