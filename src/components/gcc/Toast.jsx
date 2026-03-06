export default function Toast({ msg, show }) {
  if (!show || !msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 72, left: "50%", transform: "translateX(-50%)",
      background: "rgba(0,245,255,0.12)", border: "1px solid rgba(0,245,255,0.3)",
      backdropFilter: "blur(12px)", borderRadius: 30,
      padding: "0.5rem 1.2rem", fontSize: "0.75rem", color: "#00f5ff",
      zIndex: 999, whiteSpace: "nowrap", pointerEvents: "none",
      boxShadow: "0 4px 20px rgba(0,245,255,0.15)"
    }}>
      {msg}
    </div>
  );
}