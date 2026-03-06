import { useState } from "react";
import { C, Pill, Btn } from "./shared.jsx";

const CATEGORIES = [
  {
    id: "mov", label: "🏃 Movimiento & Gravedad",
    refs: [
      { icon: "🐾", name: "Crash Bandicoot", studio: "Sony / Naughty Dog" },
      { icon: "🍄", name: "Super Mario", studio: "Nintendo" },
      { icon: "🔧", name: "Ratchet & Clank", studio: "Sony / Insomniac" },
      { icon: "🕷️", name: "Spider-Man", studio: "Sony / Insomniac" },
      { icon: "🌿", name: "Zelda BotW", studio: "Nintendo" },
      { icon: "🐻", name: "Banjo-Kazooie", studio: "Xbox / Rare" },
      { icon: "👀", name: "Diablo IV", studio: "Blizzard" },
      { icon: "👾", name: "Atari 2600", studio: "Atari Classic" },
    ]
  },
  {
    id: "hit", label: "🥊 Hitboxes & Combate",
    refs: [
      { icon: "🏟️", name: "League of Legends", studio: "Riot Games" },
      { icon: "🔫", name: "Valorant", studio: "Riot Games" },
      { icon: "👊", name: "Street Fighter", studio: "Capcom" },
      { icon: "⚔️", name: "World of Warcraft", studio: "Blizzard" },
      { icon: "💥", name: "Overwatch", studio: "Blizzard" },
      { icon: "🔨", name: "God of War", studio: "Sony / Santa Monica" },
      { icon: "🎯", name: "Halo", studio: "Xbox / Bungie" },
    ]
  },
  {
    id: "cam", label: "📷 Sistema de Cámara",
    refs: [
      { icon: "🔨", name: "God of War", studio: "Sony — cámara hombro" },
      { icon: "🐾", name: "Crash Bandicoot", studio: "Sony — side scroller" },
      { icon: "🌿", name: "Zelda OoT", studio: "Nintendo — Z-targeting" },
      { icon: "👀", name: "Diablo", studio: "Blizzard — isométrica" },
      { icon: "🏟️", name: "LoL", studio: "Riot — estratégica" },
      { icon: "🍄", name: "Super Mario 64", studio: "Nintendo — libre" },
    ]
  },
  {
    id: "ai", label: "🧠 IA de Enemigos & NPCs",
    refs: [
      { icon: "👀", name: "Diablo IV", studio: "Blizzard — hordas" },
      { icon: "⚔️", name: "World of Warcraft", studio: "Blizzard — aggro/patrol" },
      { icon: "🎯", name: "Halo", studio: "Xbox — flanking" },
      { icon: "🐾", name: "Pokémon", studio: "Nintendo — encuentros" },
      { icon: "👾", name: "StarCraft", studio: "Blizzard — enjambre" },
      { icon: "🧟", name: "Resident Evil", studio: "Capcom — sigilo" },
    ]
  },
  {
    id: "feel", label: "✨ Game Feel & Polish",
    refs: [
      { icon: "🍄", name: "Super Mario", studio: "Nintendo Polish AAA" },
      { icon: "🐾", name: "Crash Bandicoot", studio: "Sony squash/stretch" },
      { icon: "🔧", name: "Ratchet & Clank", studio: "Sony gadget feel" },
      { icon: "💥", name: "Overwatch", studio: "Blizzard — impacto" },
      { icon: "👊", name: "Street Fighter", studio: "Capcom — frame data" },
      { icon: "👾", name: "Atari Classic", studio: "Retro arcade feel" },
    ]
  },
];

const PARAMS = [
  { name: "Coyote Time", val: "120ms", ref: "Super Mario (Nintendo Polish)", min: 0, max: 300, value: 120 },
  { name: "Jump Buffer", val: "150ms", ref: "Super Mario / Crash Bandicoot", min: 0, max: 300, value: 150 },
  { name: "Gravity Down", val: "0.55", ref: "Crash Bandicoot (Sony)", min: 10, max: 100, value: 55 },
  { name: "Hitbox Precision", val: "97%", ref: "League of Legends (Riot Games)", min: 50, max: 100, value: 97 },
  { name: "Enemy Aggro Range", val: "8.5 units", ref: "Diablo IV (Blizzard)", min: 1, max: 20, value: 8 },
];

export default function PhysicsScreen({ showToast }) {
  const [selected, setSelected] = useState({ mov: 0, hit: 0, cam: 1, ai: 0, feel: 0 });

  return (
    <div>
      <div style={{ padding: "1rem 1rem 0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900 }}>Physics Mixer</div>
        <Btn onClick={() => showToast("⚙️ Física guardada en el proyecto")}>Aplicar</Btn>
      </div>

      <div style={{ padding: "0 1rem" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,245,255,0.05))", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "1rem", marginBottom: "1.2rem", fontSize: "0.82rem", lineHeight: 1.6 }}>
          Mezcla referencias de los mejores juegos AAA. Elige la física <span style={{ color: C.cyan, fontWeight: 700 }}>por categoría</span> — cada personaje puede tener su propio ADN de física individual.
        </div>

        {CATEGORIES.map(cat => (
          <div key={cat.id} style={{ marginBottom: "1.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", letterSpacing: "1.5px", textTransform: "uppercase", color: C.muted, marginBottom: "0.8rem", padding: "0.5rem 0.8rem", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: `2px solid ${C.purple}` }}>
              {cat.label}
            </div>
            <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.3rem" }}>
              {cat.refs.map((ref, i) => (
                <div key={i} onClick={() => { setSelected(s => ({ ...s, [cat.id]: i })); showToast(`⚙️ Referencia: ${ref.name}`); }} style={{
                  flexShrink: 0, width: 90,
                  border: `1px solid ${selected[cat.id] === i ? "rgba(0,245,255,0.5)" : C.border}`,
                  background: selected[cat.id] === i ? "rgba(0,245,255,0.06)" : C.card,
                  borderRadius: 12, padding: "0.7rem 0.5rem", textAlign: "center", cursor: "pointer",
                  position: "relative", transition: "all 0.2s"
                }}>
                  {selected[cat.id] === i && <div style={{ position: "absolute", top: 4, right: 6, fontSize: "0.65rem", color: C.cyan, fontWeight: 700 }}>✓</div>}
                  <div style={{ fontSize: "1.6rem", marginBottom: "0.35rem" }}>{ref.icon}</div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 600, lineHeight: 1.2 }}>{ref.name}</div>
                  <div style={{ fontSize: "0.54rem", color: C.muted, marginTop: "0.15rem" }}>{ref.studio}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: C.card, border: "1px solid rgba(0,245,255,0.2)", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.68rem", letterSpacing: "1.5px", textTransform: "uppercase", color: C.cyan, marginBottom: "0.8rem" }}>🎯 Mix Actual del Proyecto</div>
          {PARAMS.map((p, i) => (
            <div key={i} style={{ marginBottom: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.78rem" }}>{p.name}</span>
                <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.75rem", color: C.cyan, fontWeight: 700 }}>{p.val}</span>
              </div>
              <div style={{ fontSize: "0.6rem", color: C.muted, marginBottom: "0.3rem" }}>📌 Referencia: {p.ref}</div>
              <input type="range" min={p.min} max={p.max} defaultValue={p.value} style={{ width: "100%", accentColor: C.cyan, cursor: "pointer" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <Pill color="purple">🐾 Crash (mov)</Pill>
          <Pill color="cyan">🏟️ Riot (hitbox)</Pill>
          <Pill color="magenta">📷 Crash (cam)</Pill>
          <Pill color="red">👀 Diablo (IA)</Pill>
          <Pill color="gold">🍄 Mario (feel)</Pill>
        </div>

        <Btn full variant="primary" onClick={() => showToast("✅ Physics Mix guardado en el proyecto")}>
          ✅ Aplicar Physics Mix al Proyecto
        </Btn>
      </div>
    </div>
  );
}