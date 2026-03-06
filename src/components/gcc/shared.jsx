export const C = {
  dark: "#080c1a", card: "#111827", card2: "#1a2235",
  cyan: "#00f5ff", purple: "#7c3aed", magenta: "#ff00ff",
  border: "rgba(0,245,255,0.12)", text: "#e0e8ff", muted: "#5a7090",
  gold: "#ffd700", green: "#22c55e", red: "#ef4444", orange: "#f97316",
};

export const pillStyles = {
  cyan: { background: "rgba(0,245,255,0.12)", color: "#00f5ff" },
  purple: { background: "rgba(124,58,237,0.15)", color: "#a78bfa" },
  green: { background: "rgba(34,197,94,0.12)", color: "#22c55e" },
  gold: { background: "rgba(255,215,0,0.12)", color: "#ffd700" },
  red: { background: "rgba(239,68,68,0.12)", color: "#ef4444" },
  magenta: { background: "rgba(255,0,255,0.12)", color: "#ff00ff" },
  orange: { background: "rgba(249,115,22,0.12)", color: "#f97316" },
};

export function Pill({ color = "cyan", children }) {
  const s = pillStyles[color] || pillStyles.cyan;
  return (
    <span style={{
      ...s, padding: "2px 9px", borderRadius: 50,
      fontSize: "0.62rem", fontWeight: 600,
      letterSpacing: "0.8px", textTransform: "uppercase",
      display: "inline-flex", alignItems: "center", gap: 3
    }}>
      {children}
    </span>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "0.68rem", letterSpacing: 2, textTransform: "uppercase",
      color: C.muted, marginBottom: "0.7rem", padding: "0 1rem"
    }}>{children}</div>
  );
}

export function Btn({ onClick, variant = "primary", style = {}, children, full }) {
  const base = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
    border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'Inter',sans-serif",
    fontWeight: 600, transition: "all 0.2s", padding: "0.45rem 0.9rem", fontSize: "0.8rem",
    ...(full ? { width: "100%", padding: "0.9rem", fontSize: "0.95rem", borderRadius: 12 } : {})
  };
  const variants = {
    primary: { background: "linear-gradient(135deg,#00f5ff,#7c3aed)", color: "#080c1a" },
    outline: { background: "transparent", border: "1px solid rgba(0,245,255,0.12)", color: "#e0e8ff" },
    ghost: { background: "rgba(255,255,255,0.05)", color: "#e0e8ff" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export function InputField({ label, value, onChange, placeholder, type = "text", as = "input", rows }) {
  const fieldStyle = {
    width: "100%", background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,245,255,0.12)", borderRadius: 10,
    padding: "0.7rem 1rem", color: "#e0e8ff",
    fontFamily: "'Inter',sans-serif", fontSize: "0.88rem", outline: "none"
  };
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <div style={{ fontSize: "0.72rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</div>}
      {as === "textarea"
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows || 3} style={{ ...fieldStyle, resize: "none" }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={fieldStyle} />
      }
    </div>
  );
}