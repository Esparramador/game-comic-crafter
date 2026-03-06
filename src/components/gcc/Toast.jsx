export default function Toast({ msg, show }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
      background: "rgba(22,13,46,0.97)", border: "1px solid rgba(124,58,237,0.4)",
      borderRadius: 12, padding: "0.6rem 1.2rem", color: "#e0e8ff",
      fontSize: "0.82rem", fontWeight: 600, zIndex: 9999,
      backdropFilter: "blur(12px)", whiteSpace: "nowrap",
      boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
      animation: "fadeInUp 0.2s ease"
    }}>
      {msg}
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}