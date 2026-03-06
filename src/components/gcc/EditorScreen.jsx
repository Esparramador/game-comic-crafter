import { useState } from "react";
import { C, Pill, Btn, InputField } from "./shared.jsx";

const TABS_DEF = [
  { id: "gdd", label: "📋 GDD" },
  { id: "voice", label: "🎙️ Voces" },
  { id: "assets", label: "🎨 Assets" },
  { id: "build", label: "📦 Build" },
  { id: "mic", label: "🎤 Voz IA" },
];

const ASSETS = [
  { label: "Logo", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/69f73e56b_generated_image.png", locked: true },
  { label: "Cover", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/273dd5c9e_generated_image.png", locked: false },
  { label: "Póster", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/53073646b_generated_image.png", locked: false },
  { label: "IgnisBud", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/0e324937d_generated_image.png", locked: true },
  { label: "Storyboard", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/2fa12dd66_generated_image.png", locked: false },
  { label: "Loading", img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa73f013b5c82e8989d6fc/ecba86024_generated_image.png", locked: false },
];

const VOICES = [
  { name: "Harry — Fierce Warrior", id: "SOYHLrjzK2X1ezoPC6cr", score: 97 },
  { name: "George — Narrator", id: "JBFqnCBsd6RMkjVDRZzb", score: 98 },
  { name: "Lía — Voz Maga Crystal Staff", id: "Xb7hH8MSUJpSbSDYk0k2", score: 90 },
];

const PLATFORMS = [
  { icon: "🌐", name: "Web PWA", sub: "HTML5 · WebGL", on: true },
  { icon: "🤖", name: "Android APK", sub: "API 26+ · Play Store", on: true },
  { icon: "🍎", name: "iOS App Store", sub: "Swift · TestFlight", on: true },
  { icon: "🥽", name: "Meta Quest / Apple Vision", sub: "WebXR · Haptics", on: false },
];

const MODES = [
  { icon: "⚔️", name: "RPG Plataformas" },
  { icon: "🏟️", name: "MOBA" },
  { icon: "🐾", name: "Monster Tamer" },
  { icon: "🏰", name: "RTS" },
];

export default function EditorScreen({ onNav, showToast }) {
  const [activeTab, setActiveTab] = useState("gdd");
  const [selectedMode, setSelectedMode] = useState(0);
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [micOn, setMicOn] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [buildLoading, setBuildLoading] = useState(false);
  const [buildSteps, setBuildSteps] = useState([]);

  const togglePlatform = (i) => {
    setPlatforms(p => p.map((pl, idx) => idx === i ? { ...pl, on: !pl.on } : pl));
  };

  const handleBuild = () => {
    setBuildLoading(true);
    const steps = ["Iniciando 6-AI Cluster...", "Generando código Phaser.js...", "Aplicando Physics Mix...", "Embebiendo voces ElevenLabs...", "Build Web + Android + iOS...", "Publicando en Shopify..."];
    let i = 0;
    setBuildSteps([]);
    const iv = setInterval(() => {
      if (i < steps.length) { setBuildSteps(s => [...s, steps[i]]); i++; }
      else { clearInterval(iv); setBuildLoading(false); showToast("✅ Build listo y publicado en Shopify"); }
    }, 900);
  };

  const handleMic = () => {
    setMicOn(true);
    setTimeout(() => { setMicOn(false); showToast("✅ Asset generado con IA"); }, 3000);
  };

  return (
    <div>
      <div style={{ padding: "1rem 1rem 0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900 }}>Editor GCC</div>
        <Btn onClick={() => showToast("✅ Guardado")}>Guardar</Btn>
      </div>

      <div style={{ display: "flex", background: C.card, borderBottom: `1px solid ${C.border}`, overflowX: "auto", scrollbarWidth: "none" }}>
        {TABS_DEF.map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flexShrink: 0, padding: "0.85rem 1rem", fontSize: "0.72rem",
            letterSpacing: "0.8px", textTransform: "uppercase",
            color: activeTab === t.id ? C.cyan : C.muted, cursor: "pointer",
            borderBottom: `2px solid ${activeTab === t.id ? C.cyan : "transparent"}`,
            transition: "all 0.2s", whiteSpace: "nowrap"
          }}>{t.label}</div>
        ))}
      </div>

      <div style={{ padding: "1rem" }}>
        {activeTab === "gdd" && (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.72rem", letterSpacing: 1, textTransform: "uppercase", color: C.cyan, marginBottom: "0.9rem" }}>🎮 Información del Juego</div>
              <InputField label="Título" value="El Resurgir del Pingüino de Cristal" />
              <InputField label="Descripción" as="textarea" value="Adrián Voss, el último guerrero del Imperio, debe recuperar la Espada Celeste." />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <InputField label="Motor" />
                <InputField label="Formato" />
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.72rem", letterSpacing: 1, textTransform: "uppercase", color: C.cyan, marginBottom: "0.9rem" }}>🎮 Modo de Juego</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                {MODES.map((m, i) => (
                  <div key={i} onClick={() => setSelectedMode(i)} style={{
                    background: selectedMode === i ? "rgba(0,245,255,0.05)" : C.card2,
                    border: `1px solid ${selectedMode === i ? "rgba(0,245,255,0.4)" : C.border}`,
                    borderRadius: 10, padding: "0.8rem", textAlign: "center", cursor: "pointer"
                  }}>
                    <div style={{ fontSize: "1.6rem", marginBottom: "0.3rem" }}>{m.icon}</div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>{m.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <Btn full variant="outline" onClick={() => onNav("physics")}>⚙️ Configurar Physics Mixer →</Btn>
          </div>
        )}

        {activeTab === "voice" && (
          <div>
            <div style={{ fontSize: "0.72rem", letterSpacing: 1, textTransform: "uppercase", color: C.muted, marginBottom: "0.7rem" }}>Adrián Voss — 3 voces</div>
            {VOICES.map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.85rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: "0.65rem" }}>
                <div onClick={() => showToast(`▶ ${v.name}`)} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.85rem", flexShrink: 0 }}>▶</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>{v.name}</div>
                  <div style={{ fontSize: "0.65rem", color: C.muted }}>{v.id}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 2, height: 26, flex: 1 }}>
                  {[...Array(8)].map((_, j) => <div key={j} style={{ flex: 1, background: "rgba(0,245,255,0.2)", borderRadius: 2, height: `${30 + Math.random() * 70}%` }} />)}
                </div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.78rem", color: C.cyan, fontWeight: 700 }}>{v.score}</div>
              </div>
            ))}
            <Btn full variant="outline" onClick={() => showToast("+ Nueva voz con ElevenLabs")}>+ Nueva voz con ElevenLabs</Btn>
          </div>
        )}

        {activeTab === "assets" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.55rem", marginBottom: "1rem" }}>
              {ASSETS.map((a, i) => (
                <div key={i} style={{ aspectRatio: "1/1", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer", position: "relative" }}>
                  <img src={a.img} alt={a.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
                  {a.locked && <div style={{ position: "absolute", top: 3, right: 3, fontSize: "0.65rem" }}>🔒</div>}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.7)", fontSize: "0.52rem", padding: "3px 5px", textAlign: "center" }}>{a.label}</div>
                </div>
              ))}
            </div>
            <Btn full variant="outline" onClick={() => setShowAssetModal(true)}>✨ Generar asset con IA</Btn>
          </div>
        )}

        {activeTab === "build" && (
          <div>
            {platforms.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.85rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: "0.65rem" }}>
                <div style={{ fontSize: "1.4rem" }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: "0.68rem", color: C.muted }}>{p.sub}</div>
                </div>
                <div onClick={() => togglePlatform(i)} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${p.on ? C.cyan : C.border}`, background: p.on ? "rgba(0,245,255,0.1)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.75rem", color: C.cyan }}>
                  {p.on ? "✓" : ""}
                </div>
              </div>
            ))}
            {buildLoading ? (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "1rem", marginTop: "0.5rem" }}>
                <div style={{ width: 44, height: 44, border: "2px solid rgba(0,245,255,0.1)", borderTopColor: C.cyan, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 0.8rem" }} />
                {buildSteps.map((s, i) => <div key={i} style={{ fontSize: "0.75rem", color: C.green, marginBottom: "0.4rem" }}>✓ {s}</div>)}
              </div>
            ) : (
              <Btn full variant="primary" style={{ marginTop: "0.5rem" }} onClick={handleBuild}>🚀 Build & Deploy</Btn>
            )}
          </div>
        )}

        {activeTab === "mic" && (
          <div>
            <div style={{ textAlign: "center", padding: "1.5rem 0 1rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.3rem" }}>Voice to Creation</div>
              <div style={{ fontSize: "0.75rem", color: C.muted, marginBottom: "1.2rem" }}>Habla para crear con el Súper Cerebro</div>
              <div onClick={micOn ? undefined : handleMic} style={{
                width: 72, height: 72, borderRadius: "50%",
                border: `2px solid ${micOn ? C.red : "rgba(0,245,255,0.3)"}`,
                background: micOn ? "rgba(239,68,68,0.1)" : "rgba(0,245,255,0.07)",
                margin: "0 auto 0.8rem", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.8rem", cursor: "pointer", transition: "all 0.3s"
              }}>{micOn ? "⏹" : "🎤"}</div>
              <div style={{ fontSize: "0.75rem", color: C.muted }}>{micOn ? "🔴 Escuchando..." : "Pulsa para hablar"}</div>
            </div>
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", padding: "0.8rem", background: "rgba(0,245,255,0.03)", borderRadius: 10, border: `1px solid ${C.border}`, alignItems: "center" }}>
              <Pill color="cyan">🎤 STT</Pill>
              <span style={{ color: C.muted, fontSize: "0.8rem" }}>→</span>
              <Pill color="purple">🧠 Gemini</Pill>
              <span style={{ color: C.muted, fontSize: "0.8rem" }}>→</span>
              <Pill color="cyan">📋 GDD</Pill>
              <span style={{ color: C.muted, fontSize: "0.8rem" }}>→</span>
              <Pill color="magenta">🖥 Tripo3D</Pill>
              <span style={{ color: C.muted, fontSize: "0.8rem" }}>→</span>
              <Pill color="gold">🤖 Manus</Pill>
            </div>
          </div>
        )}
      </div>

      {showAssetModal && (
        <div onClick={() => setShowAssetModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.card, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, padding: "1.5rem 1rem" }}>
            <div style={{ width: 40, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, margin: "0 auto 1.5rem" }} />
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900, marginBottom: "1.2rem" }}>✨ Generar Asset con IA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
              {[{ icon: "🎨", name: "Imagen 2D" }, { icon: "🖥", name: "Modelo 3D" }, { icon: "📊", name: "Audio/SFX" }, { icon: "🎙️", name: "Voz" }].map((t, i) => (
                <div key={i} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "0.8rem", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{t.icon}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600 }}>{t.name}</div>
                </div>
              ))}
            </div>
            <InputField label="Prompt" as="textarea" placeholder="Describe el asset que quieres crear..." />
            <Btn full variant="primary" onClick={() => { showToast("✨ Generando con 6-AI Cluster..."); setShowAssetModal(false); }}>Generar con Súper Cerebro</Btn>
          </div>
        </div>
      )}
    </div>
  );
}