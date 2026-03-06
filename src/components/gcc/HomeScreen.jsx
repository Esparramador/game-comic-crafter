import { C, Pill, SectionLabel } from "./shared";

const QUICK_ACTIONS = [
  { icon: "✨", label: "Nuevo Proyecto", screen: "create" },
  { icon: "▶️", label: "Testear", screen: "test" },
  { icon: "🎙️", label: "Voz a Creación", screen: null },
  { icon: "⚙️", label: "Physics Mixer", screen: "physics" },
  { icon: "👥", label: "Personajes", screen: "chars" },
  { icon: "📣", label: "Marketing", screen: "marketing" },
];

const ACTIVITY = [
  { icon: "🎙️", title: "Voice asset generado", sub: "GCC_Trinity_Engine · score 98 · hace 2h", pill: { color: "green", label: "✓" } },
  { icon: "⚙️", title: "Physics Mixer configurado", sub: "Base: Crash + hitboxes Riot + cámara GoW", pill: { color: "purple", label: "Mix" } },
  { icon: "👤", title: "Modelo 3D — Lía GLB", sub: "Tripo3D v2.5 · física Mage custom", pill: { color: "cyan", label: "GLB" } },
  { icon: "🛍️", title: "Publicado en Shopify", sub: "Product ID 16158363320665", pill: { color: "gold", label: "€15" } },
];

export default function HomeScreen({ onNav, showToast }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg,rgba(0,245,255,0.06),transparent)", padding: "1.2rem 1rem 1rem", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: "0.78rem", color: C.muted, marginBottom: "0.2rem" }}>Bienvenido 👋</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900 }}>
          Súper <span style={{ color: C.cyan }}>Cerebro</span> activo
        </div>
        <div style={{ marginTop: "0.8rem", background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.15)", borderRadius: 10, padding: "0.8rem", display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: "blink 2s infinite", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 600 }}>GCC Engine v1.0 — 6-AI Cluster</div>
            <div style={{ fontSize: "0.65rem", color: C.muted }}>Nintendo · Blizzard · Sony · Riot · Atari · Más</div>
          </div>
          <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 4px ${C.cyan}` }} />)}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.65rem", padding: "1rem" }}>
        {QUICK_ACTIONS.map((a, i) => (
          <div key={i} onClick={() => a.screen && onNav(a.screen)} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "0.9rem 0.4rem", display: "flex", flexDirection: "column",
            alignItems: "center", gap: "0.45rem", cursor: "pointer"
          }}>
            <span style={{ fontSize: "1.5rem" }}>{a.icon}</span>
            <span style={{ fontSize: "0.6rem", color: C.muted, textAlign: "center", letterSpacing: 0.5 }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Project Card */}
      <SectionLabel>Proyecto activo</SectionLabel>
      <div onClick={() => onNav("create")} style={{ margin: "0 1rem 1rem", borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer" }}>
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/273dd5c9e_generated_image.png" alt="cover" style={{ width: "100%", aspectRatio: "16/6", objectFit: "cover", display: "block" }} />
        <div style={{ padding: "1rem", background: C.card }}>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.88rem", fontWeight: 700, marginBottom: "0.5rem" }}>El Resurgir del Pingüino de Cristal</div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.7rem" }}>
            <Pill color="cyan">RPG 2D</Pill>
            <Pill color="green">Playable</Pill>
            <Pill color="gold">€15.00</Pill>
            <Pill color="purple">Phaser.js</Pill>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: "0.35rem" }}>
            <div style={{ height: "100%", width: "100%", background: `linear-gradient(90deg,${C.cyan},${C.purple})`, borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.65rem", color: C.muted }}>Sprint 1 completado</span>
            <span style={{ fontSize: "0.65rem", color: C.cyan }}>100%</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.65rem", padding: "0 1rem 1rem" }}>
        {[{ val: "25", label: "Assets" }, { val: "18", label: "Voces" }, { val: "2", label: "Chars" }].map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "0.9rem 0.5rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.4rem", fontWeight: 900, color: C.cyan }}>{s.val}</div>
            <div style={{ fontSize: "0.58rem", color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity */}
      <SectionLabel>Actividad reciente</SectionLabel>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, margin: "0 1rem 1rem", overflow: "hidden" }}>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.75rem 1rem", borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,245,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{a.title}</div>
              <div style={{ fontSize: "0.65rem", color: C.muted }}>{a.sub}</div>
            </div>
            <Pill color={a.pill.color}>{a.pill.label}</Pill>
          </div>
        ))}
      </div>
    </div>
  );
}