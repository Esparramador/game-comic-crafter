import { useState, useEffect } from "react";

// ── DATOS MOCK ──────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: "🎮", label: "Nuevo Juego" },
  { icon: "🦸", label: "Personaje" },
  { icon: "🌍", label: "Mundo" },
  { icon: "🤖", label: "IA Código" },
  { icon: "🔊", label: "Audio IA" },
  { icon: "🚀", label: "Publicar" },
];

const PROJECTS = [
  { name: "CYBER WARRIOR X", genre: "Acción", engine: "Phaser.js", cover: "https://picsum.photos/seed/cyber/600/200", progress: 65, scenes: 8, chars: 3 },
  { name: "SPACE ODYSSEY", genre: "Sci-Fi", engine: "Three.js", cover: "https://picsum.photos/seed/space/600/200", progress: 30, scenes: 3, chars: 2 },
];

const EXPLORE = [
  { title: "NEON BLADE", author: "GamerX", img: "https://picsum.photos/seed/neon/300/200", plays: "2.4k", genre: "Acción" },
  { title: "DARK REALM", author: "PixelDev", img: "https://picsum.photos/seed/dark/300/200", plays: "1.8k", genre: "RPG" },
  { title: "TURBO RUSH", author: "SpeedCraft", img: "https://picsum.photos/seed/turbo/300/200", plays: "3.1k", genre: "Racing" },
  { title: "GHOST CITY", author: "ShadowArt", img: "https://picsum.photos/seed/ghost2/300/200", plays: "987", genre: "Stealth" },
];

const CHARS = [
  { name: "Kira", role: "Protagonista", img: "https://picsum.photos/seed/kira/80/80", tags: ["Guerrera", "Cyber"] },
  { name: "Dex", role: "Antagonista", img: "https://picsum.photos/seed/dex/80/80", tags: ["Hacker", "IA"] },
  { name: "Nova", role: "NPC", img: "https://picsum.photos/seed/nova/80/80", tags: ["Piloto", "Mech"] },
];

// ── COLORES / TOKENS ─────────────────────────────────────────────
const C = {
  dark: "#080c1a", card: "#111827", card2: "#1a2235",
  cyan: "#00f5ff", purple: "#7c3aed", magenta: "#ff00ff",
  border: "rgba(0,245,255,0.12)", text: "#e0e8ff", muted: "#5a7090",
  gold: "#ffd700", green: "#22c55e",
};

const pill = (color, bg, label) => (
  <span style={{ background: bg, color, padding: "2px 9px", borderRadius: 50, fontSize: "0.6rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
    {label}
  </span>
);

// ── NAV TABS ─────────────────────────────────────────────────────
const TABS = [
  { id: "home", icon: "🏠", label: "Inicio" },
  { id: "create", icon: "✚", label: "Crear" },
  { id: "explore", icon: "🔭", label: "Explorar" },
  { id: "profile", icon: "👤", label: "Perfil" },
];

// ═══════════════════════════════════════════════════════════════
//  SCREENS
// ═══════════════════════════════════════════════════════════════

function HomeScreen({ onNav }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg,rgba(0,245,255,0.06),transparent)", padding: "1.2rem 1rem 1rem", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: "0.68rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Bienvenido de vuelta</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.15rem", fontWeight: 900, color: C.cyan, marginBottom: "0.8rem" }}>
          GameCrafter IA
        </div>
        {/* Engine status */}
        <div style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.15)", borderRadius: 10, padding: "0.8rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>Motor IA Activo</div>
            <div style={{ fontSize: "0.62rem", color: C.muted }}>3 núcleos • Latencia 42ms</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
            {[1,2,3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 4px ${C.cyan}` }} />)}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.65rem", padding: "1rem" }}>
        {QUICK_ACTIONS.map((a, i) => (
          <div key={i} onClick={() => i === 0 && onNav("create")} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0.9rem 0.4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem", cursor: "pointer" }}>
            <span style={{ fontSize: "1.5rem" }}>{a.icon}</span>
            <span style={{ fontSize: "0.6rem", color: C.muted, textAlign: "center", letterSpacing: 0.5 }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.65rem", padding: "0 1rem 1rem" }}>
        {[{val:"2", label:"Juegos"},{val:"11", label:"Escenas"},{val:"5", label:"Chars"}].map((s,i)=>(
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0.9rem 0.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", fontWeight: 900, color: C.cyan }}>{s.val}</div>
            <div style={{ fontSize: "0.6rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div style={{ padding: "0 1rem", fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", color: C.muted, marginBottom: "0.7rem" }}>Mis Videojuegos</div>
      {PROJECTS.map((p, i) => (
        <div key={i} style={{ margin: "0 1rem 1rem", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer" }}>
          <img src={p.cover} alt={p.name} style={{ width: "100%", aspectRatio: "16/6", objectFit: "cover", display: "block" }} />
          <div style={{ padding: "1rem", background: C.card }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.88rem", fontWeight: 700 }}>{p.name}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {pill(C.cyan, "rgba(0,245,255,0.12)", p.genre)}
                {pill(C.purple, "rgba(124,58,237,0.15)", p.engine)}
              </div>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: "0.5rem" }}>
              <div style={{ height: "100%", width: `${p.progress}%`, background: `linear-gradient(90deg,${C.cyan},${C.purple})`, borderRadius: 2 }} />
            </div>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.7rem", color: C.muted }}>
              <span>🎬 {p.scenes} escenas</span>
              <span>🦸 {p.chars} chars</span>
              <span style={{ marginLeft: "auto", color: C.cyan }}>{p.progress}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CreateScreen() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", genre: "", engine: "", concept: "" });

  const genres = ["Acción", "RPG", "Open World", "Fighting", "Stealth", "Arcade"];
  const engines = ["Phaser.js", "Babylon.js", "Three.js"];

  const steps = [
    { label: "Concepto", icon: "💡" },
    { label: "Género", icon: "🎭" },
    { label: "Motor", icon: "⚙️" },
    { label: "Generar", icon: "🤖" },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, color: C.cyan, marginBottom: "1rem" }}>
        Crear Cómic
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => setStep(i)}>
            <div style={{ width: "100%", height: 3, borderRadius: 2, background: i <= step ? `linear-gradient(90deg,${C.cyan},${C.purple})` : "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: "0.55rem", color: i <= step ? C.cyan : C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <div style={{ fontSize: "0.72rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.4rem" }}>Título del Videojuego</div>
          <input placeholder="Ej: Cyber Warrior X" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "0.7rem 1rem", color: C.text, fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", outline: "none", marginBottom: "1rem" }} />
          <div style={{ fontSize: "0.72rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.4rem" }}>Concepto / Mecánicas</div>
          <textarea placeholder="Describe tu juego, mecánicas, mundo y personajes..." value={form.concept} onChange={e => setForm({...form, concept: e.target.value})}
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "0.7rem 1rem", color: C.text, fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", outline: "none", resize: "none", minHeight: 100 }} />
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ fontSize: "0.72rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.8rem" }}>Selecciona el Género</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
            {genres.map(g => (
              <div key={g} onClick={() => setForm({...form, genre: g})} style={{
                background: form.genre === g ? "rgba(0,245,255,0.1)" : C.card,
                border: `1px solid ${form.genre === g ? C.cyan : C.border}`,
                borderRadius: 12, padding: "1rem", textAlign: "center", cursor: "pointer", fontSize: "0.85rem",
                color: form.genre === g ? C.cyan : C.text, fontWeight: form.genre === g ? 700 : 400
              }}>{g}</div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ fontSize: "0.72rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.8rem" }}>Motor de Juego</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
            {engines.map(eng => (
              <div key={eng} onClick={() => setForm({...form, engine: eng})} style={{
                background: form.engine === eng ? "rgba(0,245,255,0.1)" : C.card,
                border: `1px solid ${form.engine === eng ? C.cyan : C.border}`,
                borderRadius: 12, padding: "1rem 1.2rem", cursor: "pointer",
                color: form.engine === eng ? C.cyan : C.text, fontWeight: form.engine === eng ? 700 : 400,
                display: "flex", alignItems: "center", gap: "0.8rem"
              }}>
                <span style={{ fontSize: "1.4rem" }}>{eng === "Phaser.js" ? "⚡" : eng === "Babylon.js" ? "🔷" : "🌐"}</span>
                <div>
                  <div style={{ fontSize: "0.88rem" }}>{eng}</div>
                  <div style={{ fontSize: "0.65rem", color: C.muted, marginTop: 2 }}>
                    {eng === "Phaser.js" ? "2D · Ideal para plataformas y arcade" : eng === "Babylon.js" ? "3D · Motor WebGL avanzado" : "3D · Gráficos personalizados"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: "center", paddingTop: "1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", color: C.cyan, marginBottom: "0.5rem" }}>Listo para Generar</div>
          <div style={{ fontSize: "0.82rem", color: C.muted, marginBottom: "1.5rem", lineHeight: 1.6 }}>
            La IA creará tu cómic con paneles, diálogos y arte generativo basado en tu concepto.
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem", textAlign: "left", marginBottom: "1.5rem" }}>
            {[["Título", form.title || "—"], ["Género", form.genre || "—"], ["Estilo", form.style || "—"]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: `1px solid ${C.border}`, fontSize: "0.82rem" }}>
                <span style={{ color: C.muted }}>{k}</span>
                <span style={{ color: C.cyan, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <button style={{ width: "100%", padding: "0.9rem", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, border: "none", borderRadius: 12, color: C.dark, fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
            ✨ Generar con IA
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem" }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: "0.8rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
            ← Atrás
          </button>
        )}
        {step < 3 && (
          <button onClick={() => setStep(step + 1)} style={{ flex: 2, padding: "0.8rem", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, border: "none", borderRadius: 10, color: C.dark, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
}

function ExploreScreen() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div style={{ padding: "1rem 1rem 0.5rem" }}>
        <input placeholder="🔍 Buscar cómics, géneros..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "0.7rem 1rem", color: C.text, fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", outline: "none" }} />
      </div>

      <div style={{ padding: "0 1rem", fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", color: C.muted, margin: "0.8rem 0 0.7rem" }}>Tendencias</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", padding: "0 1rem 1rem" }}>
        {EXPLORE.filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase())).map((e, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
            <img src={e.img} alt={e.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            <div style={{ padding: "0.7rem" }}>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.72rem", fontWeight: 700, marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontSize: "0.65rem", color: C.muted, marginBottom: 6 }}>por {e.author}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {pill(C.cyan, "rgba(0,245,255,0.12)", e.genre)}
                <span style={{ fontSize: "0.65rem", color: C.muted }}>❤️ {e.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div style={{ padding: "1rem" }}>
      {/* Avatar */}
      <div style={{ textAlign: "center", padding: "1rem 0 1.5rem" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 0.8rem", border: `2px solid ${C.cyan}`, boxShadow: `0 0 20px rgba(0,245,255,0.3)` }}>👤</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1rem", fontWeight: 900, color: C.cyan }}>GAME CREATOR</div>
        <div style={{ fontSize: "0.75rem", color: C.muted, marginTop: 4 }}>Nivel 7 • Comic Master</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: "0.7rem" }}>
          {pill(C.gold, "rgba(255,215,0,0.12)", "PRO")}
          {pill(C.cyan, "rgba(0,245,255,0.12)", "IA ACCESS")}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.65rem", marginBottom: "1.2rem" }}>
        {[{val:"2",l:"Proyectos"},{val:"15",l:"Paneles"},{val:"847",l:"Visitas"}].map((s,i)=>(
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0.9rem 0.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.3rem", fontWeight: 900, color: C.cyan }}>{s.val}</div>
            <div style={{ fontSize: "0.58rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Characters */}
      <div style={{ fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase", color: C.muted, marginBottom: "0.7rem" }}>Mis Personajes</div>
      {CHARS.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0.8rem", marginBottom: "0.65rem" }}>
          <img src={c.img} alt={c.name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `1px solid ${C.border}` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.82rem", fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
            <div style={{ display: "flex", gap: 4 }}>
              {pill(C.muted, "rgba(255,255,255,0.06)", c.role)}
              {c.tags.map(t => pill(C.cyan, "rgba(0,245,255,0.08)", t))}
            </div>
          </div>
          <span style={{ fontSize: "0.8rem", color: C.muted, cursor: "pointer" }}>›</span>
        </div>
      ))}

      {/* Menu items */}
      <div style={{ marginTop: "0.5rem" }}>
        {["⚙️ Configuración", "🛍️ Mi Tienda", "📊 Estadísticas", "🚪 Cerrar Sesión"].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
            <span style={{ fontSize: "0.88rem" }}>{item}</span>
            <span style={{ color: C.muted }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState("home");

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ height: "100vh", background: C.dark, color: C.text, fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", overflow: "hidden", maxWidth: 480, margin: "0 auto", position: "relative" }}>

      {/* SPLASH */}
      {splash && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.dark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", transition: "opacity 0.6s" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(0,245,255,0.05)", border: "2px solid rgba(0,245,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem" }}>🎮</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "2rem", fontWeight: 900, color: C.cyan, textShadow: `0 0 40px rgba(0,245,255,0.8)`, letterSpacing: 3 }}>GCC</div>
          <div style={{ fontSize: "0.75rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>Game Comic Crafter</div>
          <div style={{ width: 220, height: 3, background: "rgba(0,245,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg,${C.cyan},${C.purple})`, animation: "loadBar 1.8s ease forwards", width: "100%" }} />
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <div style={{ flexShrink: 0, height: 56, background: "rgba(8,12,26,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900, color: C.cyan, letterSpacing: 2 }}>GCC</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ position: "relative", cursor: "pointer", fontSize: "1.2rem" }}>
            🔔
            <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: C.magenta, border: `1px solid ${C.dark}` }} />
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: C.dark, cursor: "pointer" }}>G</div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ paddingBottom: 72 }}>
          {tab === "home" && <HomeScreen onNav={setTab} />}
          {tab === "create" && <CreateScreen />}
          {tab === "explore" && <ExploreScreen />}
          {tab === "profile" && <ProfileScreen />}
        </div>
      </div>

      {/* FAB */}
      {tab !== "create" && (
        <button onClick={() => setTab("create")} style={{ position: "fixed", bottom: 74, right: "calc(50% - 240px + 1.2rem)", width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, border: "none", cursor: "pointer", fontSize: "1.4rem", color: C.dark, boxShadow: `0 4px 20px rgba(0,245,255,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99 }}>
          ✚
        </button>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, height: 60, background: "rgba(8,12,26,0.97)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100 }}>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer", padding: "8px 0", color: tab === t.id ? C.cyan : C.muted, fontSize: "0.58rem", letterSpacing: 0.5, textTransform: "uppercase", position: "relative" }}>
            <span style={{ fontSize: "1.25rem", transform: tab === t.id ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }}>{t.icon}</span>
            <span>{t.label}</span>
            {tab === t.id && <div style={{ position: "absolute", bottom: 0, width: 22, height: 2, background: C.cyan, borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes loadBar { 0%{width:0} 100%{width:100%} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #5a7090; }
      `}</style>
    </div>
  );
}