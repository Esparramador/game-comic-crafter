import { useState } from "react";
import { C, SectionTitle, labelStyle, inputStyle } from "./shared";

// ══════════════════════════════════════════════════════════════
//  MOTOR DE SUPER MEGA PROMPTS MAESTROS
//  Genera prompts profesionales de nivel AAA para:
//  juegos, personajes, assets, marketing, IA, 3D, voz, código
// ══════════════════════════════════════════════════════════════

const CATEGORIES = [
  { id:"game",      icon:"🎮", label:"Juego Completo",    color:"#7c3aed" },
  { id:"character", icon:"👤", label:"Personaje / NPC",   color:"#e91e8c" },
  { id:"asset3d",   icon:"🏺", label:"Asset 3D (Tripo)",  color:"#00f5ff" },
  { id:"sprite",    icon:"🎨", label:"Sprite / Arte 2D",  color:"#f59e0b" },
  { id:"voice",     icon:"🎙️", label:"Voz / ElevenLabs",  color:"#22c55e" },
  { id:"marketing", icon:"📣", label:"Marketing / SEO",   color:"#f472b6" },
  { id:"code",      icon:"💻", label:"Código / Engine",   color:"#38bdf8" },
  { id:"story",     icon:"📖", label:"Historia / Lore",   color:"#a78bfa" },
  { id:"ui",        icon:"🖥️", label:"UI / HUD / UX",     color:"#ffd700" },
  { id:"music",     icon:"🎵", label:"Música / SFX",      color:"#fb923c" },
];

const STYLES = ["Dark Fantasy","Cyberpunk","Anime","Pixel Art","Realista AAA","Cartoon","Sci-Fi","Medieval","Post-Apocalíptico","Horror","Steampunk","Neon Noir"];
const ENGINES_LIST = ["Phaser.js","Babylon.js","Three.js","Unity","Unreal Engine","Godot","PlayCanvas"];
const TONES = ["Épico","Oscuro","Humorístico","Misterioso","Heroico","Dramático","Intenso","Poético"];
const LANGS = ["Español","English","Français","Deutsch","日本語","中文"];

// ─── MOTOR DE GENERACIÓN ───
function generatePrompt(cat, opts) {
  const { title, desc, style, engine, tone, lang, extras } = opts;
  const t = title || "el proyecto";
  const s = style || "Dark Fantasy";
  const en = engine || "Phaser.js";
  const tn = tone || "Épico";
  const l = lang || "Español";
  const ex = extras || "";

  const MASTER_PREFIX = `Actúa como un Director Creativo AAA con 20 años de experiencia en Blizzard, Riot Games, Nintendo y Sony Interactive Entertainment. Eres experto en diseño de juegos, narrativa interactiva, arte conceptual y desarrollo técnico. Genera contenido de máxima calidad profesional.\n\n`;

  switch(cat) {
    case "game": return `${MASTER_PREFIX}TAREA: Diseña un videojuego completo llamado "${t}" con las siguientes especificaciones:\n\n**CONCEPTO CORE:**\n${desc || "Un juego épico con mecánicas innovadoras"}\n\n**ESPECIFICACIONES TÉCNICAS:**\n- Estilo visual: ${s}\n- Motor: ${en}\n- Tono narrativo: ${tn}\n- Idioma principal: ${l}\n\n**ENTREGABLES REQUERIDOS:**\n1. Game Design Document (GDD) completo con:\n   - Sinopsis de 3 actos\n   - 5 mecánicas core con descripción técnica\n   - Sistema de progresión y economía del juego\n   - Mapa de niveles (mínimo 10 áreas)\n   - Bestiary con 15 enemigos únicos\n   - Árbol de habilidades del protagonista\n\n2. Código ${en} listo para ejecutar:\n   - Loop de juego principal\n   - Sistema de físicas\n   - Colisiones y hitboxes\n   - HUD completo\n   - Sistema de guardado\n\n3. Prompt de arte para portada: estilo ${s}, ultra detallado, 8K, concept art profesional\n\n4. Script de trailer de 60 segundos con narración ${tn.toLowerCase()}\n\n5. SEO description en ${l} para Shopify/Steam\n\n${ex ? `REQUISITOS ADICIONALES:\n${ex}` : ""}\n\nFormato de respuesta: JSON estructurado + bloques de código separados. Nivel de calidad: Nintendo Gold Master.`;

    case "character": return `${MASTER_PREFIX}TAREA: Crea un personaje de videojuego DEFINITIVO para "${t}":\n\n**CONTEXTO:** ${desc || "Protagonista de un juego de acción RPG"}\n**ESTILO VISUAL:** ${s}\n**TONO:** ${tn}\n\n**ENTREGABLES:**\n\n1. IDENTIDAD COMPLETA:\n   - Nombre, edad, origen, trasfondo de 3 párrafos\n   - Perfil psicológico MBTI detallado\n   - Motivaciones y conflictos internos\n   - Relaciones con otros personajes\n   - Arco narrativo en 3 actos\n\n2. SISTEMA DE COMBATE:\n   - 4 habilidades con valores numéricos exactos (daño, cooldown, maná)\n   - Pasivas y sinergias\n   - Ultimate definitivo con lore integrado\n   - Estadísticas base: HP, MP, ATK, DEF, SPD\n   - Árbol de talentos (15 nodos)\n\n3. PROMPT TRIPO3D (para generar modelo 3D):\n   - Descripción ultra detallada para text-to-3D\n   - Estilo ${s}, pose dinámica, PBR textures\n   - Topología optimizada para juego (LOD levels)\n\n4. PROMPT ARTE CONCEPTUAL:\n   - Portrait 8K, iluminación cinematográfica\n   - Full body, 3 ángulos (front/side/back)\n   - Detalles de armadura/ropa pixel-perfect\n\n5. PERFIL DE VOZ ELEVENLABS:\n   - Tipo de voz, edad vocal, acento, emoción base\n   - 10 líneas de diálogo icónicas\n   - Grunts de combate (ataque, dolor, muerte, victoria)\n\n6. LORE BIBLE (300 palabras)\n\n${ex ? `EXTRAS: ${ex}` : ""}\n\nNivel: Personaje memorable estilo Geralt de Rivia o Master Chief.`;

    case "asset3d": return `${MASTER_PREFIX}TAREA: Genera el prompt PERFECTO para Tripo3D AI para crear "${t}":\n\n**CONTEXTO:** ${desc || "Asset 3D para videojuego"}\n**ESTILO:** ${s}\n\n**PROMPT MAESTRO TRIPO3D:**\n\n[Usa exactamente este formato optimizado para Tripo3D v2.5]\n\n"${t || "Character/Object"}, ${s.toLowerCase()} style, ${desc || "epic fantasy design"}, highly detailed 3D model, game-ready mesh, PBR textures, clean topology, optimized for real-time rendering, ${tn.toLowerCase()} pose/expression, professional concept art quality, 25k-50k polygon count, UV unwrapped, physically based rendering materials, ambient occlusion baked, normal maps, specular maps, game character/asset standard, next-gen AAA quality"\n\n**VARIACIONES (elige según resultado deseado):**\n\nV1 - MÁXIMO DETALLE:\n"${t}, ultra high definition, ${s} game asset, intricate surface details, weathering effects, micro surface detail, photorealistic textures, 4K resolution, hero asset quality, cinematic lighting baked"\n\nV2 - OPTIMIZADO MÓVIL:\n"${t}, mobile game ready, ${s} style, low poly optimized, stylized textures, 5k polygons, clean silhouette, vibrant colors, cartoon shading compatible"\n\nV3 - ANIMACIÓN READY:\n"${t}, rigged-ready topology, clean edge loops, humanoid/creature proportions, game character standard, T-pose compatible, blend shapes ready, ${s} aesthetic"\n\n**PARÁMETROS API RECOMENDADOS:**\n\`\`\`json\n{\n  "prompt": "[usa V1 arriba]",\n  "model_version": "v2.5-20250123",\n  "texture": true,\n  "pbr": true,\n  "texture_alignment": "geometry",\n  "export_uv": true,\n  "geometry_quality": "standard"\n}\n\`\`\`\n\n${ex ? `NOTAS ESPECIALES: ${ex}` : ""}`;

    case "sprite": return `${MASTER_PREFIX}TAREA: Genera prompts maestros de arte 2D para "${t}":\n\n**ESTILO:** ${s} | **TONO:** ${tn}\n**DESCRIPCIÓN:** ${desc || "Arte para videojuego 2D"}\n\n**PROMPT MIDJOURNEY/DALL-E/STABLE DIFFUSION:**\n\n"${t}, ${s.toLowerCase()} game art style, ${desc || "2D game asset"}, pixel-perfect details, vibrant colors, clean linework, ${tn.toLowerCase()} atmosphere, professional game concept art, 4K resolution, centered composition, white/transparent background, game asset ready, sprite sheet compatible, ${s === "Pixel Art" ? "16-bit pixel art, crisp edges, limited color palette" : "smooth gradients, AAA quality illustration"}, by professional game artist"\n\n**SPRITE SHEET PROMPT:**\n"${t} sprite sheet, multiple animation frames, idle/walk/run/attack/death poses, ${s} style, consistent art direction, transparent background PNG, game animation ready, 8 directions if character"\n\n**VARIACIÓN CONCEPT ART:**\n"${t} concept art, ${s} game design, multiple angle views, color study, material breakdown, ${tn} mood, annotated reference sheet, professional game development document"\n\n**BACKGROUND/ENVIRONMENT:**\n"${t} game level background, ${s} environment, parallax layers separated, atmospheric perspective, ${tn.toLowerCase()} lighting, 16:9 game resolution, no UI elements"\n\n${ex ? `EXTRAS: ${ex}` : ""}`;

    case "voice": return `${MASTER_PREFIX}TAREA: Diseña el perfil de voz COMPLETO para "${t}" (ElevenLabs):\n\n**PERSONAJE:** ${desc || "Personaje de videojuego"}\n**TONO:** ${tn} | **IDIOMA:** ${l}\n\n**CONFIGURACIÓN ELEVENLABS:**\n\n1. PERFIL VOCAL RECOMENDADO:\n   - Stability: ${tn === "Épico" ? "0.65" : tn === "Oscuro" ? "0.55" : "0.70"}\n   - Similarity Boost: 0.80\n   - Style: ${tn === "Humorístico" ? "0.45" : "0.30"}\n   - Speaker Boost: true\n\n2. DESCRIPCIÓN DE VOZ:\n   "${t} tiene una voz ${tn.toLowerCase()}, ${desc || "profunda y resonante"}. ${l === "Español" ? "Acento neutro castellano, dicción clara, proyección teatral" : "Clear diction, professional voice acting quality"}. Rango vocal: barítono/mezzosoprano. Edad vocal aparente: 28-35 años."\n\n3. LÍNEAS DE CALIBRACIÓN (copia y pega en ElevenLabs):\n   - "En el umbral de la oscuridad, solo quedan los valientes."\n   - "Este mundo no merece mi compasión, pero lo protegeré de todas formas."\n   - "¡Por la sangre de mis ancestros, ningún enemigo pasará!"\n   - "Interesante... No esperaba encontrar a alguien como tú aquí."\n   - "La batalla ha terminado. Pero la guerra... apenas comienza."\n\n4. GRUNTS Y SONIDOS DE COMBATE:\n   - Ataque ligero: "¡Hah!" / "¡Toma!"\n   - Ataque fuerte: "¡RAAAH!" / "¡MUERE!"\n   - Daño recibido: "Ugh..." / "¡Maldición!"\n   - Muerte: "No... esto no puede..." [voz debilitándose]\n   - Victoria: "Como esperaba." / "Demasiado fácil."\n   - Habilidad especial: "¡EL PODER QUE ME FUE OTORGADO!"\n\n5. SCRIPT TRAILER (60 seg, ${tn} tone):\n   [MÚSICA INTENSA]\n   "Un mundo al borde del abismo... [pausa] Un guerrero que no debería existir... [pausa dramática] '${t}' [VOZ EN OFF ÉPICA] — La oscuridad tiene nombre. Y ese nombre... eres tú."\n\n${ex ? `PERSONALIZACIÓN: ${ex}` : ""}`;

    case "marketing": return `${MASTER_PREFIX}TAREA: Crea el kit de marketing COMPLETO para "${t}":\n\n**PRODUCTO:** ${desc || "Videojuego indie"}\n**ESTILO:** ${s} | **TONO:** ${tn} | **IDIOMA:** ${l}\n\n**1. DESCRIPCIÓN SHOPIFY (SEO-Optimized):**\n\n"[TÍTULO GANCHO EN MAYÚSCULAS — máx 60 chars]\n\n[Párrafo 1: Hook emocional — qué problema resuelve / qué experiencia ofrece — 2 frases]\n\n[Párrafo 2: Features principales con emojis — 5 bullet points]\n• ✅ Feature 1\n• 🎮 Feature 2\n• ⚔️ Feature 3\n• 🌍 Feature 4\n• 💎 Feature 5\n\n[Párrafo 3: CTA urgente — por qué comprarlo AHORA]\n\nPalabras clave SEO: [lista de 15 keywords relevantes]"\n\n**2. INSTAGRAM CAPTION (viral format):**\n"[Hook — primera frase que para el scroll]\n\n[Cuerpo — historia de 3-5 líneas cortas]\n\n[CTA claro]\n\n[Hashtags: 20-30 relevantes mezcla nano/micro/macro]\n#GameDev #IndieGame #[${s.replace(/ /g,"")}] #Español #Videojuegos"\n\n**3. PROMPT POSTER/THUMBNAIL:**\n"${t} game cover art, ${s.toLowerCase()} style, ${tn.toLowerCase()} composition, dramatic lighting, hero character centered, ${desc || "epic scene"}, professional game box art, 4K ultra detail, cinematic color grade, bold typography space, trending on ArtStation"\n\n**4. META ADS COPY:**\n- Headline 1 (30 chars): [impacto máximo]\n- Headline 2 (30 chars): [beneficio clave]\n- Description (90 chars): [prueba social + CTA]\n\n**5. SCRIPT VIDEO 30 SEGUNDOS (TikTok/Reels):**\n[00:00-00:03] Hook visual\n[00:03-00:15] Demo gameplay\n[00:15-00:25] Features rápidas\n[00:25-00:30] CTA + precio\n\n${ex ? `CANAL ESPECÍFICO: ${ex}` : ""}`;

    case "code": return `${MASTER_PREFIX}TAREA: Genera código ${en} de nivel AAA para "${t}":\n\n**DESCRIPCIÓN:** ${desc || "Mecánica de videojuego"}\n**ESTILO:** ${s} | **MOTOR:** ${en}\n\n**REQUISITOS DE CÓDIGO:**\n1. Arquitectura limpia (patrón Component/Entity/System)\n2. Comentarios profesionales en ${l}\n3. Manejo de errores robusto\n4. Performance optimizado (60 FPS mínimo)\n5. Mobile-ready si aplica\n\n**PROMPT PARA COPILOT/CURSOR/CLAUDE:**\n\n"Eres un Senior Game Developer con 15 años de experiencia en ${en}. Escribe código de producción AAA para implementar: '${t}' — ${desc || "mecánica de juego compleja"}.\n\nRequisitos técnicos:\n- Framework: ${en}\n- Patrón: Component-based architecture\n- Physics: Arcade/P2 según necesidad\n- Optimización: Object pooling, lazy loading\n- Responsive: Desktop + Mobile\n- Sin dependencias externas innecesarias\n\nEntrega:\n1. Código completo funcional (NO pseudocódigo)\n2. Sistema de configuración con constantes\n3. Debug mode toggle\n4. Unit tests básicos\n5. README con instrucciones de instalación\n\nCalidad requerida: código que podría ir a producción en un estudio AAA sin modificaciones."\n\n**REFACTOR PROMPT (si tienes código existente):**\n"Refactoriza este código ${en} para: mejor performance, menor footprint de memoria, mejor legibilidad, patrones modernos ES2024. Mantén funcionalidad exacta, añade tipos TypeScript, comenta cada función."\n\n${ex ? `CONTEXTO ADICIONAL: ${ex}` : ""}`;

    case "story": return `${MASTER_PREFIX}TAREA: Construye el UNIVERSO narrativo completo de "${t}":\n\n**PREMISA:** ${desc || "Historia épica de videojuego"}\n**ESTILO:** ${s} | **TONO:** ${tn} | **IDIOMA:** ${l}\n\n**1. WORLD BIBLE (Biblia del Mundo):**\n\n- COSMOLOGÍA: Cómo se creó este mundo, sus reglas fundamentales, magia/tecnología\n- HISTORIA: 1000 años de cronología con 5 eventos clave que moldean el presente\n- FACCIONES: 4 grupos con motivaciones opuestas, líderes, recursos, debilidades\n- GEOGRAFÍA: 6 regiones distintas con clima, fauna, recursos, peligros únicos\n- ECONOMÍA: Sistema de comercio, moneda, recursos escasos que generan conflicto\n\n**2. ESTRUCTURA NARRATIVA (3 ACTOS):**\n\nACTO I — El Llamado:\n- Mundo ordinario del protagonista\n- Incidente incitador\n- Cruce del umbral\n- Aliados y mentores\n\nACTO II — La Prueba:\n- Pruebas escaladas\n- Crisis del punto medio\n- Bajada a las tinieblas\n- Revelación/traición\n\nACTO III — La Transformación:\n- Resurrección del héroe\n- Climax definitivo\n- Resolución y nuevo equilibrio\n- Gancho para secuela\n\n**3. DIÁLOGOS ICÓNICOS (5 escenas clave):**\n[Escena de presentación del villano, alianza de héroes, momento de crisis, revelación de lore, discurso final]\n\n**4. CODEX ENTRIES (para coleccionables in-game):**\n5 entradas de 150 palabras cada una sobre historia, bestias, armas legendarias, lugares míticos, personajes históricos\n\n${ex ? `UNIVERSE NOTES: ${ex}` : ""}`;

    case "ui": return `${MASTER_PREFIX}TAREA: Diseña el sistema UI/UX completo para "${t}":\n\n**JUEGO:** ${desc || "Videojuego"}\n**ESTILO:** ${s} | **MOTOR:** ${en}\n\n**1. DESIGN SYSTEM:**\n\nCOLORES:\n- Primary: [hex] — acción principal, CTAs\n- Secondary: [hex] — info, stats, secondary actions  \n- Danger: [hex] — daño, enemigos, alertas\n- Success: [hex] — curación, éxito, gains\n- Fondo: rgba con blur para profundidad\n\nTIPOGRAFÍA:\n- Títulos: font bold, letter-spacing: 2px, uppercase\n- Body: font regular, line-height: 1.5\n- Números/Stats: font monospace, tabular-nums\n\n**2. HUD DESIGN (código ${en} listo):**\n- Barra de vida con animación de daño\n- Barra de maná/stamina\n- Minimapa circular con fog of war\n- Inventario rápido (8 slots)\n- Cooldowns de habilidades con timer visual\n- Números de daño flotantes (pool de 20 objetos)\n- Notificaciones de logros\n- Boss health bar cinematográfica\n\n**3. MENÚ PRINCIPAL:**\n- Animación de entrada (300ms ease-out)\n- Parallax background con capas\n- Botones con hover state + sonido\n- Transitions entre pantallas\n- Loading screen con tips del juego\n\n**4. PROMPT DISEÑO VISUAL:**\n"${t} game UI design, ${s} aesthetic, dark themed, neon accents, minimalist HUD, professional game interface, Behance quality, ${tn.toLowerCase()} atmosphere, Figma-ready components"\n\n${ex ? `PLATAFORMA TARGET: ${ex}` : ""}`;

    case "music": return `${MASTER_PREFIX}TAREA: Diseña el sistema de audio COMPLETO para "${t}":\n\n**JUEGO:** ${desc || "Videojuego"}\n**ESTILO:** ${s} | **TONO:** ${tn}\n\n**1. PROMPTS SUNO AI / UDIO (música generativa):**\n\nMENÚ PRINCIPAL:\n"${s.toLowerCase()} orchestral theme, ${tn.toLowerCase()} tone, epic brass, ${s === "Cyberpunk" ? "synthesizers, electronic beats" : "strings and choir"}, game main menu, loopable, 120 BPM, professional game OST quality, Hans Zimmer meets ${s === "Pixel Art" ? "chiptune" : "modern game music"}"\n\nCOMBATE:\n"Intense battle music, ${s} style, driving drums, aggressive ${s === "Cyberpunk" ? "industrial electronic" : "orchestral"} instruments, adrenaline pumping, seamless loop, 140-160 BPM, boss fight energy"\n\nEXPLORACIÓN:\n"Ambient ${s.toLowerCase()} exploration theme, mysterious atmosphere, subtle melody, environmental audio, adventure feeling, seamless 4-minute loop"\n\nVICTORIA/DERROTA:\n"Short victory fanfare, triumphant brass, 8 seconds" / "Defeat sting, somber tone, 5 seconds"\n\n**2. DISEÑO DE SFX:**\n- Ataque básico: impacto seco + distorsión\n- Habilidad especial: buildup + release + reverb cola\n- Curación: cristal + shimmer + arpa\n- Muerte enemigo: glitch + silencio dramático\n- UI hover: click suave + tono breve\n- Logro: fanfarria + sparkle\n\n**3. AUDIO IMPLEMENTATION (${en}):**\n\`\`\`javascript\n// Spatial audio con Howler.js\nconst SFX = {\n  attack: new Howl({ src:['attack.mp3'], volume:0.6, rate:1.0 }),\n  heal:   new Howl({ src:['heal.mp3'],   volume:0.5 }),\n  // Randomizar pitch para variedad\n  play: (name) => { SFX[name].rate(0.9 + Math.random()*0.2); SFX[name].play(); }\n};\n\`\`\`\n\n${ex ? `REFERENCIAS MUSICALES: ${ex}` : ""}`;

    default: return `${MASTER_PREFIX}Genera contenido de máxima calidad para: "${t}"\n\nDescripción: ${desc}\nEstilo: ${s} | Tono: ${tn} | Motor: ${en}\n\n${ex}`;
  }
}

// ─── HISTORIAL LOCAL ───
const HISTORY_KEY = "gcc_prompts_history";
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveToHistory(item) {
  const h = getHistory();
  h.unshift({ ...item, id: Date.now(), date: new Date().toLocaleDateString("es") });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 30)));
}

// ─── COMPONENTE PRINCIPAL ───
export default function PromptsScreen({ onNav, showToast }) {
  const [cat, setCat]       = useState("game");
  const [title, setTitle]   = useState("");
  const [desc, setDesc]     = useState("");
  const [style, setStyle]   = useState("Dark Fantasy");
  const [engine, setEngine] = useState("Phaser.js");
  const [tone, setTone]     = useState("Épico");
  const [lang, setLang]     = useState("Español");
  const [extras, setExtras] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState(() => getHistory());
  const [showHistory, setShowHistory] = useState(false);

  const selectedCat = CATEGORIES.find(c => c.id === cat);

  const handleGenerate = () => {
    if (!title.trim() && !desc.trim()) { showToast("⚠️ Escribe título o descripción", "warning"); return; }
    const prompt = generatePrompt(cat, { title, desc, style, engine, tone, lang, extras });
    setResult(prompt);
    const item = { cat, title, desc, style, tone, prompt };
    saveToHistory(item);
    setHistory(getHistory());
    showToast("⚡ Prompt maestro generado", "success");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      showToast("📋 ¡Prompt copiado al portapapeles!", "success");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const loadHistory = (item) => {
    setCat(item.cat);
    setTitle(item.title || "");
    setDesc(item.desc || "");
    setStyle(item.style || "Dark Fantasy");
    setTone(item.tone || "Épico");
    setResult(item.prompt || "");
    setShowHistory(false);
    showToast("📂 Prompt cargado", "info");
  };

  return (
    <div style={{ padding:"1rem" }}>
      {/* BACK */}
      <button onClick={() => onNav("dashboard")} style={{
        background:"transparent", border:"none", color:C.muted,
        fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit",
        display:"flex", alignItems:"center", gap:4, marginBottom:"0.8rem", padding:0
      }}>← Volver al Dashboard</button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.3rem" }}>
        <SectionTitle>⚡ Super Mega Prompts</SectionTitle>
        <button onClick={() => setShowHistory(!showHistory)} style={{
          background:"rgba(124,58,237,0.1)", border:`1px solid ${C.border}`,
          borderRadius:8, padding:"0.35rem 0.8rem", color:"#c084fc",
          fontSize:"0.65rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit"
        }}>📂 Historial ({history.length})</button>
      </div>
      <div style={{ fontSize:"0.65rem", color:C.muted, marginBottom:"1.2rem" }}>
        Motor de prompts AAA — genera contenido de nivel Blizzard · Riot · Nintendo
      </div>

      {/* HISTORIAL */}
      {showHistory && history.length > 0 && (
        <div style={{ background:C.card, borderRadius:12, padding:"0.8rem", border:`1px solid ${C.border}`, marginBottom:"1rem", maxHeight:200, overflowY:"auto" }}>
          <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.5rem" }}>Últimos generados</div>
          {history.map(h => (
            <div key={h.id} onClick={() => loadHistory(h)} style={{
              display:"flex", alignItems:"center", gap:"0.6rem", padding:"0.4rem 0.3rem",
              cursor:"pointer", borderBottom:`1px solid ${C.border}`, transition:"all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
            >
              <span>{CATEGORIES.find(c=>c.id===h.cat)?.icon || "⚡"}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"0.72rem", color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.title || h.desc || "Sin título"}</div>
                <div style={{ fontSize:"0.58rem", color:C.muted }}>{h.date} · {h.style}</div>
              </div>
              <span style={{ fontSize:"0.58rem", color:"#c084fc" }}>Cargar →</span>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORÍAS */}
      <div style={{ marginBottom:"1rem" }}>
        <div style={{ fontSize:"0.58rem", color:C.muted, letterSpacing:2, textTransform:"uppercase", marginBottom:"0.6rem" }}>Tipo de Prompt</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"0.4rem" }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              background: cat===c.id ? `${c.color}22` : "rgba(124,58,237,0.05)",
              border: `1px solid ${cat===c.id ? c.color+"55" : C.border}`,
              borderRadius:10, padding:"0.6rem 0.2rem", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              transition:"all 0.15s", fontFamily:"inherit"
            }}
            onMouseEnter={e => { e.currentTarget.style.background=`${c.color}18`; }}
            onMouseLeave={e => { e.currentTarget.style.background=cat===c.id?`${c.color}22`:"rgba(124,58,237,0.05)"; }}
            >
              <span style={{ fontSize:"1.2rem" }}>{c.icon}</span>
              <span style={{ fontSize:"0.5rem", color: cat===c.id ? c.color : C.muted, fontWeight:700, textAlign:"center", lineHeight:1.2 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FORMULARIO */}
      <div style={{ background:C.card, borderRadius:14, padding:"1rem", border:`1px solid ${C.border}`, marginBottom:"1rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
          <span style={{ fontSize:"1.4rem" }}>{selectedCat?.icon}</span>
          <div>
            <div style={{ fontSize:"0.82rem", fontWeight:800, color:C.text }}>{selectedCat?.label}</div>
            <div style={{ fontSize:"0.6rem", color:C.muted }}>Rellena los campos y genera tu prompt maestro</div>
          </div>
        </div>

        <div style={{ marginBottom:"0.7rem" }}>
          <label style={labelStyle}>Título / Nombre</label>
          <input style={inputStyle} placeholder={`Ej: ${cat==="game"?"El Resurgir del Pingüino":cat==="character"?"Adrián Voss":cat==="asset3d"?"Espada Celeste Vael":"Mi Proyecto"}`}
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div style={{ marginBottom:"0.7rem" }}>
          <label style={labelStyle}>Descripción / Contexto</label>
          <textarea style={{ ...inputStyle, height:70, resize:"vertical" }}
            placeholder="Describe brevemente lo que quieres generar..."
            value={desc} onChange={e => setDesc(e.target.value)} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem", marginBottom:"0.7rem" }}>
          <div>
            <label style={labelStyle}>Estilo Visual</label>
            <select style={inputStyle} value={style} onChange={e => setStyle(e.target.value)}>
              {STYLES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Tono Narrativo</label>
            <select style={inputStyle} value={tone} onChange={e => setTone(e.target.value)}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Motor / Engine</label>
            <select style={inputStyle} value={engine} onChange={e => setEngine(e.target.value)}>
              {ENGINES_LIST.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Idioma Output</label>
            <select style={inputStyle} value={lang} onChange={e => setLang(e.target.value)}>
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom:"1rem" }}>
          <label style={labelStyle}>Requisitos Extras (opcional)</label>
          <input style={inputStyle} placeholder="Ej: compatible con iOS, sin violencia explícita, monetización F2P..."
            value={extras} onChange={e => setExtras(e.target.value)} />
        </div>

        <button onClick={handleGenerate} style={{
          width:"100%", padding:"0.9rem",
          background:"linear-gradient(135deg,#7c3aed,#00f5ff,#e91e8c)",
          backgroundSize:"200% 200%", border:"none", borderRadius:12,
          color:"#fff", fontWeight:900, fontSize:"0.95rem",
          cursor:"pointer", fontFamily:"inherit", letterSpacing:1,
          textShadow:"0 1px 3px rgba(0,0,0,0.5)"
        }}>⚡ GENERAR SUPER MEGA PROMPT</button>
      </div>

      {/* RESULTADO */}
      {result && (
        <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
          {/* Header resultado */}
          <div style={{ padding:"0.8rem 1rem", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(124,58,237,0.08)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <span style={{ fontSize:"1rem" }}>{selectedCat?.icon}</span>
              <div>
                <div style={{ fontSize:"0.78rem", fontWeight:800, color:C.text }}>Prompt Maestro Listo</div>
                <div style={{ fontSize:"0.58rem", color:C.muted }}>{result.length.toLocaleString()} caracteres · listo para copiar</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"0.4rem" }}>
              <button onClick={handleCopy} style={{
                background: copied ? "rgba(34,197,94,0.2)" : "rgba(0,245,255,0.1)",
                border: copied ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(0,245,255,0.3)",
                borderRadius:8, padding:"0.45rem 1rem",
                color: copied ? "#22c55e" : C.cyan,
                fontSize:"0.75rem", fontWeight:800,
                cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s"
              }}>
                {copied ? "✅ Copiado!" : "📋 Copiar"}
              </button>
              <button onClick={() => setResult("")} style={{
                background:"transparent", border:`1px solid ${C.border}`,
                borderRadius:8, padding:"0.45rem 0.8rem",
                color:C.muted, fontSize:"0.75rem",
                cursor:"pointer", fontFamily:"inherit"
              }}>✕</button>
            </div>
          </div>

          {/* Texto del prompt */}
          <div style={{ padding:"1rem", maxHeight:400, overflowY:"auto" }}>
            <pre style={{
              fontSize:"0.72rem", color:C.text, lineHeight:1.7,
              whiteSpace:"pre-wrap", wordBreak:"break-word", margin:0,
              fontFamily:"'Fira Code', 'Consolas', monospace"
            }}>{result}</pre>
          </div>

          {/* Footer con quick actions */}
          <div style={{ padding:"0.8rem 1rem", borderTop:`1px solid ${C.border}`, display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
            <div style={{ fontSize:"0.6rem", color:C.muted, width:"100%", marginBottom:"0.3rem" }}>Usa este prompt en:</div>
            {[
              { label:"ChatGPT", url:"https://chat.openai.com", color:C.green },
              { label:"Claude", url:"https://claude.ai", color:"#f59e0b" },
              { label:"Gemini", url:"https://gemini.google.com", color:C.cyan },
              { label:"Midjourney", url:"https://midjourney.com", color:"#a78bfa" },
              { label:"Tripo3D", url:"https://platform.tripo3d.ai", color:C.pink },
              { label:"ElevenLabs", url:"https://elevenlabs.io", color:"#ffd700" },
            ].map(a => (
              <a key={a.label} href={a.url} target="_blank" rel="noreferrer" style={{
                background:`${a.color}11`, border:`1px solid ${a.color}44`,
                borderRadius:8, padding:"0.3rem 0.7rem",
                color:a.color, fontSize:"0.62rem", fontWeight:700,
                textDecoration:"none", transition:"all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background=`${a.color}22`}
              onMouseLeave={e => e.currentTarget.style.background=`${a.color}11`}
              >{a.label} ↗</a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
