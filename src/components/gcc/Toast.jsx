import { useEffect, useState } from "react";

export default function Toast({ message, type = "info" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, [message]);

  if (!message || !visible) return null;

  const colors = {
    info:    { border:"rgba(0,245,255,0.45)",   color:"#00f5ff",  bg:"rgba(0,245,255,0.06)" },
    success: { border:"rgba(34,197,94,0.45)",   color:"#22c55e",  bg:"rgba(34,197,94,0.06)" },
    error:   { border:"rgba(239,68,68,0.45)",   color:"#ef4444",  bg:"rgba(239,68,68,0.06)" },
    warning: { border:"rgba(255,215,0,0.45)",   color:"#ffd700",  bg:"rgba(255,215,0,0.06)" },
  };
  const c = colors[type] || colors.info;

  return (
    <div style={{
      position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
      background:`rgba(15,10,30,0.97)`, border:`1px solid ${c.border}`,
      borderRadius:12, padding:"0.65rem 1.4rem", color:c.color,
      fontSize:"0.82rem", fontWeight:600, zIndex:9999,
      backdropFilter:"blur(12px)", whiteSpace:"nowrap",
      boxShadow:`0 4px 24px ${c.border}`,
      animation:"fadeInUp 0.2s ease"
    }}>
      {message}
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}
