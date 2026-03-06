import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const T = {
  bg: "#0f0a1e",
  sidebar: "#160d2e",
  card: "#1a1030",
  card2: "#1f1340",
  purple: "#7c3aed",
  cyan: "#00f5ff",
  pink: "#e91e8c",
  muted: "#6b7280",
  text: "#e0e8ff",
  border: "rgba(124,58,237,0.2)",
  borderCyan: "rgba(0,245,255,0.15)",
};

const PILL_COLORS = {
  cyan: { bg: "rgba(0,245,255,0.12)", color: "#00f5ff" },
  purple: { bg: "rgba(124,58,237,0.2)", color: "#a78bfa" },
  green: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  gold: { bg: "rgba(255,215,0,0.12)", color: "#ffd700" },
  pink: { bg: "rgba(233,30,140,0.15)", color: "#e91e8c" },
};

function Pill({ color = "cyan", children }) {
  const s = PILL_COLORS[color] || PILL_COLORS.cyan;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 8px", borderRadius: 20,
      fontSize: "0.6rem", fontWeight: 700,
      letterSpacing: "0.8px", textTransform: "uppercase",
    }}>{children}</span>
  );
}

const SUGGESTED_GAMES = [
  { title: "Neon Rider X", genre: "Racing", img: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=200&q=80", price: "€9.99" },
  { title: "Shadow Realm", genre: "RPG", img: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&q=80", price: "€12.00" },
  { title: "Pixel Warriors", genre: "Fighting", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80", price: "€7.50" },
  { title: "Astro Drift", genre: "Arcade", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80", price: "€5.00" },
];

const ACTIVITY_ICONS = {
  voice: "🎙️", physics: "⚙️", character: "👤", publish: "🛍️", asset: "🎨", default: "✨"
};

const ENGINE_NODES = [
  { label: "Nintendo AI", status: "online" },
  { label: "Blizzard Engine", status: "online" },
  { label: "Sony Physics", status: "online" },
  { label: "Riot Hitbox", status: "online" },
  { label: "Atari Legacy", status: "idle" },
  { label: "Custom Logic", status: "online" },
];

export default function HomeScreen({ onNav, showToast }) {
  const [projects, setProjects] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.GameProject.list("-updated_date", 10),
      base44.entities.GameCharacter.list("-updated_date", 10),
    ]).then(([p, c]) => {
      setProjects(p);
      setCharacters(c);
    }).finally(() => setLoading(false));
  }, []);

  const activeProject = projects[0] || null;

  const stats = [
    { val: "25", label: "Assets" },
    { val: "18", label: "Voces" },
    { val: String(characters.length || 2), label: "Chars" },
    { val: activeProject?.price ? `€${activeProject.price}` : "€15", label: "Precio" },
  ];

  const recentActivity = [
    { icon: "🎙️", title: "Voice asset generado", sub: "GCC_Trinity_Engine · score 98", pill: { color: "green", label: "✓" } },
    { icon: "⚙️", title: "Physics Mixer configurado", sub: "Base: Crash + Riot + GoW", pill: { color: "purple", label: "Mix" } },
    ...(characters[0] ? [{ icon: "👤", title: `Personaje: ${characters[0].name}`, sub: characters[0].archetype || "Protagonista", pill: { color: "cyan", label: "3D" } }] : []),
    ...(activeProject?.price ? [{ icon: "🛍️", title: "Publicado en tienda", sub: activeProject.title || "Proyecto activo", pill: { color: "gold", label: `€${activeProject.price}` } }] : []),
  ];

  return (
    <div style={{ background: T.bg, minHeight: "100%", color: T.text, fontFamily: "'Inter',sans-serif" }}>

      {/* HERO BANNER */}
      <div style={{ position: "relative", margin: "1rem", borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {activeProject?.cover_image_url ? (
          <img src={activeProject.cover_image_url} alt="cover" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{
            height: 160, display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg,#160d2e,#0f0a1e)",
          }}>
            <span style={{ fontSize: "3rem" }}>🎮</span>
          </div>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top,rgba(15,10,30,0.98) 0%,rgba(15,10,30,0.4) 50%,transparent 100%)"
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem" }}>
          {loading ? (
            <div style={{ fontSize: "0.8rem", color: T.muted }}>Cargando proyecto...</div>
          ) : activeProject ? (
            <>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.9rem", fontWeight: 900, marginBottom: "0.4rem", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
                {activeProject.title}
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {activeProject.genre && <Pill color="purple">{activeProject.genre}</Pill>}
                {activeProject.format && <Pill color="cyan">{activeProject.format}</Pill>}
                {activeProject.status && <Pill color="green">{activeProject.status}</Pill>}
                {activeProject.price && <Pill color="gold">€{activeProject.price}</Pill>}
              </div>
            </>
          ) : (
            <div style={{ fontSize: "0.8rem", color: T.muted }}>Sin proyectos aún. ¡Crea el primero!</div>
          )}
        </div>
        <button
          onClick={() => onNav("create")}
          style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(124,58,237,0.7)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(124,58,237,0.4)", borderRadius: 8,
            color: "#fff", fontSize: "0.65rem", fontWeight: 700,
            padding: "4px 10px", cursor: "pointer", letterSpacing: 1
          }}>
          EDITAR
        </button>
      </div>

      {/* STATS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem", padding: "0 1rem 1rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: "0.75rem 0.3rem", textAlign: "center"
          }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: i === 3 ? T.pink : T.cyan }}>{s.val}</div>
            <div style={{ fontSize: "0.55rem", color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0 1rem 1rem" }}>

        {/* LEFT: Suggested Games + Activity */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

          {/* También te puede gustar */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: "0.7rem" }}>
              También te puede gustar
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {SUGGESTED_GAMES.map((g, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.55rem", cursor: "pointer" }}
                  onClick={() => showToast(`🎮 ${g.title}`)}>
                  <img src={g.img} alt={g.title} style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</div>
                    <div style={{ fontSize: "0.58rem", color: T.muted }}>{g.genre}</div>
                  </div>
                  <div style={{ fontSize: "0.6rem", color: T.pink, fontWeight: 700, flexShrink: 0 }}>{g.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: "0.7rem" }}>
              Actividad
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(124,58,237,0.12)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", flexShrink: 0
                  }}>{a.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    <div style={{ fontSize: "0.58rem", color: T.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Library + Engine Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

          {/* Library */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: "0.7rem" }}>
              Mi Biblioteca
            </div>
            {loading ? (
              <div style={{ fontSize: "0.7rem", color: T.muted }}>Cargando...</div>
            ) : projects.length === 0 ? (
              <div style={{ fontSize: "0.7rem", color: T.muted }}>Sin proyectos</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {projects.slice(0, 4).map((p, i) => (
                  <div key={p.id || i} onClick={() => onNav("create")} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer",
                    padding: "0.4rem", borderRadius: 8,
                    background: i === 0 ? "rgba(124,58,237,0.1)" : "transparent",
                    border: i === 0 ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent"
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: "linear-gradient(135deg,#160d2e,#7c3aed22)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.9rem", overflow: "hidden"
                    }}>
                      {p.cover_image_url
                        ? <img src={p.cover_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                        : "🎮"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title || "Sin título"}</div>
                      <div style={{ fontSize: "0.55rem", color: i === 0 ? T.cyan : T.muted }}>{p.status || "draft"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onNav("create")} style={{
              marginTop: "0.7rem", width: "100%", background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)", borderRadius: 8,
              color: "#a78bfa", fontSize: "0.65rem", fontWeight: 700,
              padding: "0.5rem", cursor: "pointer", letterSpacing: 1
            }}>+ NUEVO</button>
          </div>

          {/* Engine Status */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "0.75rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: 2, textTransform: "uppercase", color: T.muted, marginBottom: "0.7rem" }}>
              6-AI Cluster
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {ENGINE_NODES.map((n, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                    background: n.status === "online" ? "#22c55e" : "#f97316",
                    boxShadow: n.status === "online" ? "0 0 6px #22c55e" : "0 0 6px #f97316",
                  }} />
                  <div style={{ fontSize: "0.62rem", color: n.status === "online" ? T.text : T.muted, flex: 1 }}>{n.label}</div>
                  <div style={{ fontSize: "0.52rem", color: n.status === "online" ? "#22c55e" : "#f97316", fontWeight: 700 }}>
                    {n.status === "online" ? "ON" : "IDLE"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}