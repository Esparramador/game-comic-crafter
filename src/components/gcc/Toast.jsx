export default function Toast({ message, msg, type = "info", show }) {
  const text = message || msg;
  if (!text) return null;

  const colors = {
    info:    { border: "rgba(0,245,255,0.4)",    color: "#00f5ff" },
    success: { border: "rgba(34,197,94,0.4)",    color: "#22c55e" },
    error:   { border: "rgba(239,68,68,0.4)",    color: "#ef4444" },
    warning: { border: "rgba(255,215,0,0.4)",    color: "#ffd700" },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
      background: "rgba(15,10,30,0.97)", border: `1px solid ${c.border}`,
      borderRadius: 12, padding: "0.65rem 1.4rem", color: c.color,
      fontSize: "0.82rem", fontWeight: 600, zIndex: 9999,
      backdropFilter: "blur(12px)", whiteSpace: "nowrap",
      boxShadow: `0 4px 20px ${c.border}`,
      animation: "fadeInUp 0.2s ease"
    }}>
      {text}
      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateX(-50%) translateY(8px) }
          to   { opacity:1; transform:translateX(-50%) translateY(0) }
        }
      `}</style>
    </div>
  );
}
