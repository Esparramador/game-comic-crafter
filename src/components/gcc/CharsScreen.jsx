import { useState } from "react";
import { C, Pill, Btn } from "./shared.jsx";

const CHARS = [
  {
    id: "adrian", type: "protagonist",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/53073646b_generated_image.png",
    name: "Adrián Voss", role: "Protagonista · Warrior · 28 años · 89kg",
    physics: "⚙️ Crash + Mario Feel + Riot Hitbox",
    badges: [{ color: "cyan", label: "GLB ✓" }, { color: "purple", label: "3 voces" }, { color: "green", label: "ES/EN/FR" }, { color: "gold", label: "🔒 Locked" }],
    dna: {
      refs: ["🐾 Crash (mov)", "🍄 Mario (feel)", "🏟️ Riot (hitbox)", "📷 Crash (cam)"],
      params: [["Coyote Time", "120ms"], ["Jump Buffer", "150ms"], ["Gravedad Caída", "0.55g"], ["Velocidad Base", "220 u/s"], ["Squash & Stretch", "ON ✓"], ["Hitbox Precision", "97% Riot"]]
    }
  },
  {
    id: "lia", type: "ally",
    img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/c95398628_generated_image.png",
    name: "Lía", role: "Aliada · Mage · 26 años · Bastón de Cristal",
    physics: "⚙️ Zelda Float + Diablo AoE + Riot Hitbox",
    badges: [{ color: "cyan", label: "GLB ✓" }, { color: "magenta", label: "ElevenLabs" }, { color: "gold", label: "🔒 Locked" }],
    dna: {
      refs: ["🌿 Zelda (flotación)", "👀 Diablo (AoE)", "🏟️ Riot (hitbox)"],
      params: [["Gravedad", "0.35g (flotación)"], ["Velocidad Hechizos", "340 u/s"], ["AoE Radius", "5.2 units"], ["Cast Animation", "0.3s wind-up"], ["Mana Regen", "WoW style"]]
    }
  },
];

const typeColors = { protagonist: C.cyan, ally: C.purple, villain: C.red, npc: C.muted };

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "protagonist", label: "Protagonistas" },
  { id: "ally", label: "Aliados" },
  { id: "villain", label: "Villanos" },
  { id: "npc", label: "NPCs" },
];

export default function CharsScreen({ showToast }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const filtered = filter === "all" ? CHARS : CHARS.filter(c => c.type === filter);

  return (
    <div>
      <div style={{ padding: "1rem 1rem 0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900 }}>Personajes</div>
        <Btn onClick={() => setShowModal(true)}>+ Añadir</Btn>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", padding: "0.5rem 1rem 0.8rem", scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <div key={f.id} onClick={() => setFilter(f.id)} style={{
            flexShrink: 0, padding: "0.4rem 1rem", borderRadius: 50,
            border: `1px solid ${filter === f.id ? "rgba(0,245,255,0.3)" : C.border}`,
            background: filter === f.id ? "rgba(0,245,255,0.1)" : "transparent",
            color: filter === f.id ? C.cyan : C.muted, fontSize: "0.72rem", cursor: "pointer"
          }}>{f.label}</div>
        ))}
      </div>

      <div style={{ padding: "0 1rem" }}>
        {filtered.map(ch => (
          <div key={ch.id}>
            <div onClick={() => setExpanded(expanded === ch.id ? null : ch.id)} style={{
              display: "flex", alignItems: "center", gap: "0.8rem",
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: "0.9rem", marginBottom: expanded === ch.id ? 0 : "0.8rem",
              cursor: "pointer", position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: typeColors[ch.type], borderRadius: "2px 0 0 2px" }} />
              <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, flexShrink: 0 }}>
                <img src={ch.img} alt={ch.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.2rem" }}>{ch.name}</div>
                <div style={{ fontSize: "0.68rem", color: C.muted, marginBottom: "0.4rem" }}>{ch.role}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(124,58,237,0.12)", color: "#a78bfa", padding: "2px 7px", borderRadius: 50, fontSize: "0.58rem", marginBottom: "0.3rem" }}>{ch.physics}</div>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {ch.badges.map((b, i) => <Pill key={i} color={b.color}>{b.label}</Pill>)}
                </div>
              </div>
              <span style={{ fontSize: "0.8rem", color: C.muted }}>›</span>
            </div>

            {expanded === ch.id && (
              <div style={{ border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "1rem", marginBottom: "0.8rem", background: C.card2 }}>
                <div style={{ background: C.card, border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "1rem", marginBottom: "0.8rem" }}>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#a78bfa", marginBottom: "0.8rem" }}>🧬 ADN de Física Individual</div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                    {ch.dna.refs.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 50, padding: "3px 8px", fontSize: "0.62rem", color: "#a78bfa", cursor: "pointer" }}>{r}</div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {ch.dna.params.map(([k, v], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                        <span style={{ color: C.muted }}>{k}</span>
                        <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.72rem", color: C.purple, fontWeight: 700 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Btn variant="ghost" style={{ flex: 1 }} onClick={() => showToast(`▶ Voz de ${ch.name}...`)}>▶ Voz</Btn>
                  <Btn variant="ghost" style={{ flex: 1 }} onClick={() => showToast("🖥 Modelo 3D...")}>🖥 Modelo</Btn>
                  <Btn variant="ghost" style={{ flex: 1 }} onClick={() => showToast("✏️ Editar...")}>✏️ Editar</Btn>
                </div>
              </div>
            )}
          </div>
        ))}

        <div onClick={() => setShowModal(true)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "0.4rem", border: "2px dashed rgba(0,245,255,0.15)", borderRadius: 14,
          padding: "1.2rem", cursor: "pointer", textAlign: "center", marginBottom: "1rem"
        }}>
          <div style={{ fontSize: "1.8rem" }}>+</div>
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: C.muted }}>Añadir personaje con IA</div>
          <div style={{ fontSize: "0.65rem", color: C.muted }}>Foto → 3D → Voz → Física propia</div>
        </div>
      </div>

      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.card, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", padding: "1.5rem 1rem" }}>
            <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, margin: "0 auto 1.5rem" }} />
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900, marginBottom: "1.2rem" }}>👤 Nuevo Personaje</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
              {[{ icon: "⚔️", name: "Protagonista", sub: "Héroe principal" }, { icon: "🤝", name: "Aliado", sub: "Compañero" }, { icon: "💀", name: "Villano", sub: "Antagonista" }, { icon: "🧑", name: "NPC", sub: "Secundario" }].map((t, i) => (
                <div key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "0.8rem", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{t.icon}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: "0.6rem", color: C.muted }}>{t.sub}</div>
                </div>
              ))}
            </div>
            <Btn full variant="primary" onClick={() => { showToast("🎨 Generando con Tripo3D + ElevenLabs..."); setShowModal(false); }}>
              🚀 Crear con Súper Cerebro (Foto → 3D → Voz → Física)
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}