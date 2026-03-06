export const C = {
  dark: "#080c1a",
  bg: "#0f0a1e",
  card: "#160d2e",
  card2: "#1f1340",
  cyan: "#00f5ff",
  purple: "#7c3aed",
  magenta: "#e91e8c",
  red: "#ef4444",
  green: "#22c55e",
  gold: "#ffd700",
  muted: "#5a7090",
  text: "#e0e8ff",
  border: "rgba(124,58,237,0.2)",
  borderCyan: "rgba(0,245,255,0.15)",
};

const PILL_COLORS = {
  cyan:    { bg: "rgba(0,245,255,0.12)",   color: "#00f5ff" },
  purple:  { bg: "rgba(124,58,237,0.2)",   color: "#a78bfa" },
  green:   { bg: "rgba(34,197,94,0.12)",   color: "#22c55e" },
  gold:    { bg: "rgba(255,215,0,0.12)",   color: "#ffd700" },
  magenta: { bg: "rgba(233,30,140,0.15)",  color: "#e91e8c" },
  red:     { bg: "rgba(239,68,68,0.12)",   color: "#ef4444" },
};

export function Pill({ color = "cyan", children, style = {} }) {
  const s = PILL_COLORS[color] || PILL_COLORS.cyan;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 8px", borderRadius: 20,
      fontSize: "0.6rem", fontWeight: 700,
      letterSpacing: "0.8px", textTransform: "uppercase",
      ...style
    }}>{children}</span>
  );
}

export function Btn({ children, onClick, variant = "default", full = false, style = {} }) {
  const variants = {
    default: { background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.25)", color: "#00f5ff" },
    primary: { background: "linear-gradient(135deg,#7c3aed,#00f5ff22)", border: "1px solid rgba(0,245,255,0.4)", color: "#00f5ff" },
    outline: { background: "transparent", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" },
    ghost:   { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#5a7090" },
  };
  const v = variants[variant] || variants.default;
  return (
    <button onClick={onClick} style={{
      ...v, borderRadius: 8, padding: "0.45rem 1rem",
      fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
      letterSpacing: "0.5px", width: full ? "100%" : undefined,
      fontFamily: "inherit", transition: "opacity 0.15s",
      ...style
    }}>
      {children}
    </button>
  );
}

export function InputField({ label, value, placeholder, as, onChange }) {
  const shared = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8,
    color: "#e0e8ff", padding: "0.5rem 0.7rem", fontSize: "0.8rem",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    marginBottom: "0.6rem", display: "block",
  };
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      {label && <div style={{ fontSize: "0.62rem", color: "#5a7090", letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.3rem" }}>{label}</div>}
      {as === "textarea"
        ? <textarea defaultValue={value} placeholder={placeholder} onChange={onChange} rows={3} style={{ ...shared, resize: "vertical" }} />
        : <input defaultValue={value} placeholder={placeholder} onChange={onChange} style={shared} />
      }
    </div>
  );
}