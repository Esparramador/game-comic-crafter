import { C, Btn, InputField, Pill } from "./shared";

const PHYSICS_PRESETS = [
  { id: "earth", label: "Tierra", gravity: "9.8", friction: "0.4", icon: "🌍" },
  { id: "moon", label: "Luna", gravity: "1.6", friction: "0.1", icon: "🌙" },
  { id: "space", label: "Espacio", gravity: "0.0", friction: "0.0", icon: "🚀" },
  { id: "water", label: "Agua", gravity: "4.0", friction: "0.9", icon: "🌊" },
];

export default function PhysicsScreen({ showToast }) {
  return (
    <div style={{ padding: "1.2rem" }}>
      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.62rem", color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.2rem" }}>MÓDULO</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.1rem", fontWeight: 900, color: C.cyan }}>⚙️ Physics Engine</div>
      </div>

      <div style={{ marginBottom: "1.2rem" }}>
        <div style={{ fontSize: "0.7rem", color: C.muted, marginBottom: "0.7rem", textTransform: "uppercase", letterSpacing: 1 }}>Presets</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          {PHYSICS_PRESETS.map(p => (
            <div
              key={p.id}
              onClick={() => showToast(`Preset "${p.label}" aplicado`)}
              style={{
                background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
                borderRadius: 10, padding: "0.8rem", cursor: "pointer"
              }}
            >
              <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{p.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", color: C.text }}>{p.label}</div>
              <div style={{ fontSize: "0.65rem", color: C.muted }}>g={p.gravity} · fr={p.friction}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.12)",
        borderRadius: 12, padding: "1rem"
      }}>
        <div style={{ fontSize: "0.7rem", color: C.muted, marginBottom: "0.8rem", textTransform: "uppercase", letterSpacing: 1 }}>Configuración manual</div>
        <InputField label="Gravedad (m/s²)" placeholder="9.8" />
        <InputField label="Fricción" placeholder="0.4" />
        <InputField label="Densidad del aire" placeholder="1.2" />
        <Btn variant="primary" full onClick={() => showToast("Física guardada ✓")}>Guardar configuración</Btn>
      </div>
    </div>
  );
}