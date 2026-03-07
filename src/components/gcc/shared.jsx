export const C = {
  dark: "#060212", bg: "#0f0a1e", card: "#160d2e", card2: "#1f1340",
  cyan: "#00f5ff", purple: "#7c3aed", pink: "#e91e8c",
  red: "#ef4444", green: "#22c55e", gold: "#ffd700",
  muted: "#5a4080", text: "#e0e8ff",
  border: "rgba(124,58,237,0.2)", borderHover: "rgba(124,58,237,0.5)",
};

export const PILL_COLORS = {
  cyan:    { bg:"rgba(0,245,255,0.12)",   color:"#00f5ff" },
  purple:  { bg:"rgba(124,58,237,0.2)",   color:"#a78bfa" },
  green:   { bg:"rgba(34,197,94,0.12)",   color:"#22c55e" },
  gold:    { bg:"rgba(255,215,0,0.12)",   color:"#ffd700" },
  pink:    { bg:"rgba(233,30,140,0.15)",  color:"#e91e8c" },
  red:     { bg:"rgba(239,68,68,0.12)",   color:"#ef4444" },
};

export function Pill({ color="cyan", children, style={} }) {
  const s = PILL_COLORS[color] || PILL_COLORS.cyan;
  return (
    <span style={{
      background:s.bg, color:s.color, padding:"2px 8px", borderRadius:20,
      fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.8px",
      textTransform:"uppercase", ...style
    }}>{children}</span>
  );
}

export const inputStyle = {
  width:"100%", background:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(124,58,237,0.25)", borderRadius:8,
  color:"#e0e8ff", padding:"0.55rem 0.75rem", fontSize:"0.82rem",
  outline:"none", fontFamily:"inherit", boxSizing:"border-box",
};

export const labelStyle = {
  fontSize:"0.62rem", color:"#5a4080", letterSpacing:1,
  textTransform:"uppercase", marginBottom:"0.3rem", display:"block",
};

export function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily:"'Orbitron',sans-serif", fontSize:"1rem", fontWeight:900,
      color:"#c084fc", letterSpacing:2, marginBottom:"1.2rem"
    }}>{children}</div>
  );
}

export function EmptyState({ icon, title, sub, action, onAction }) {
  return (
    <div style={{ textAlign:"center", padding:"3rem 1rem", color:"#5a4080" }}>
      <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>{icon}</div>
      <div style={{ fontSize:"0.85rem", color:"#e0e8ff", marginBottom:"0.4rem" }}>{title}</div>
      <div style={{ fontSize:"0.72rem", marginBottom: action ? "1.2rem" : 0 }}>{sub}</div>
      {action && (
        <button onClick={onAction} style={{
          background:"linear-gradient(135deg,#7c3aed,#e91e8c)", border:"none",
          borderRadius:10, padding:"0.7rem 1.5rem", color:"#fff",
          fontWeight:700, fontSize:"0.82rem", cursor:"pointer", fontFamily:"inherit"
        }}>{action}</button>
      )}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"3rem", color:"#5a4080", flexDirection:"column", gap:"0.8rem" }}>
      <div style={{ width:36, height:36, border:"2px solid rgba(124,58,237,0.2)", borderTopColor:"#7c3aed", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <div style={{ fontSize:"0.65rem", letterSpacing:2, textTransform:"uppercase" }}>Cargando...</div>
      <style>{`@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}