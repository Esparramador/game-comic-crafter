export default function Toast({ msg, show }) {
  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%",
      transform: `translateX(-50%) translateY(${show ? 0 : 20}px)`,
      background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.3)",
      borderRadius: 50, padding: "0.55rem 1.3rem", fontSize: "0.8rem",
      color: "#00f5ff", zIndex: 999, opacity: show ? 1 : 0,
      transition: "all 0.3s", pointerEvents: "none", whiteSpace: "nowrap",
      backdropFilter: "blur(10px)"
    }}>
      {msg}
    </div>
  );
}