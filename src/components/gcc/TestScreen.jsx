import { useState } from "react";
import { C, Btn } from "./shared";

const INFO = [
  { val: "17", lbl: "Plataformas" },
  { val: "8", lbl: "Enemigos" },
  { val: "3", lbl: "Power-ups" },
  { val: "120ms", lbl: "Coyote" },
  { val: "60fps", lbl: "Target" },
  { val: "Crash+Riot", lbl: "Physics" },
];

export default function TestScreen({ showToast }) {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div>
      <div style={{ padding: "1rem 1rem 0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900 }}>Test & Play</div>
        <Btn onClick={() => setGameStarted(true)}>▶ Jugar</Btn>
      </div>

      {/* Game frame */}
      <div style={{ background: "#000", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 320 }}>
        {!gameStarted ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "linear-gradient(135deg,rgba(8,12,26,0.9),rgba(26,10,46,0.9))" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.cyan, textAlign: "center", textShadow: "0 0 20px rgba(0,245,255,0.5)" }}>
              El Resurgir del<br />Pingüino de Cristal
            </div>
            <div style={{ fontSize: "0.75rem", color: C.muted }}>Sprint 1 · Nintendo Polish + Crash Physics</div>
            <button onClick={() => setGameStarted(true)} style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg,${C.cyan},${C.purple})`,
              border: "none", cursor: "pointer", fontSize: "1.8rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.dark, boxShadow: "0 0 30px rgba(0,245,255,0.4)"
            }}>▶</button>
            <div style={{ fontSize: "0.65rem", color: C.muted }}>Toca para iniciar · Phaser.js</div>
          </div>
        ) : (
          <div style={{ width: "100%", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.9rem", color: C.cyan }}>🎮 Juego Iniciado</div>
            <div style={{ fontSize: "0.75rem", color: C.muted }}>Phaser.js · 60fps · Crash+Riot Physics</div>
            <div style={{ display: "flex", gap: 3, marginTop: "0.5rem" }}>
              {[1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.cyan, animation: `blink ${i * 0.3 + 0.4}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div style={{ padding: "0.6rem 1rem", background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", gap: "1.2rem", overflowX: "auto", scrollbarWidth: "none" }}>
        {INFO.map((item, i) => (
          <div key={i} style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.85rem", color: C.cyan, fontWeight: 700 }}>{item.val}</div>
            <div style={{ fontSize: "0.52rem", color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{item.lbl}</div>
          </div>
        ))}
      </div>

      {/* Director Neuronal */}
      <div style={{ padding: "0.8rem 1rem", background: C.card, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: "0.68rem", letterSpacing: "1.5px", textTransform: "uppercase", color: C.muted, marginBottom: "0.6rem" }}>Director Neuronal Live</div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Btn variant="ghost" onClick={() => showToast("🌩️ Tormenta activada")}>🌩️ Clima</Btn>
          <Btn variant="ghost" onClick={() => showToast("👾 NPC spawneado")}>👾 Spawn NPC</Btn>
          <Btn variant="ghost" onClick={() => showToast("⚡ Dificultad ajustada")}>⚡ Dificultad</Btn>
          <Btn variant="ghost" onClick={() => showToast("🎭 Diálogo generado")}>🎭 Diálogo</Btn>
        </div>
      </div>
    </div>
  );
}