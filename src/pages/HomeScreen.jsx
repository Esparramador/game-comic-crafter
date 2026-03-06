import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import HomeScreenComponent from "../components/gcc/HomeScreen";
import PhysicsScreen from "../components/gcc/PhysicsScreen";
import CharsScreen from "../components/gcc/CharsScreen";
import EditorScreen from "../components/gcc/EditorScreen";
import TestScreen from "../components/gcc/TestScreen";
import MarketingScreen from "../components/gcc/MarketingScreen";
import Toast from "../components/gcc/Toast";

const TABS = [
  { id: "home", icon: "🏠", label: "Inicio" },
  { id: "physics", icon: "⚙️", label: "Physics" },
  { id: "chars", icon: "👥", label: "Chars" },
  { id: "create", icon: "✏️", label: "Editor" },
  { id: "test", icon: "▶️", label: "Test" },
  { id: "marketing", icon: "📣", label: "Mkt" },
];

export default function HomeScreen() {
  const [splash, setSplash] = useState(true);
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState({ msg: "", show: false });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2200);
    base44.auth.me().then(u => {
      if (!u) base44.auth.redirectToLogin(createPageUrl("HomeScreen"));
      else setUser(u);
    }).catch(() => base44.auth.redirectToLogin(createPageUrl("HomeScreen")));
    return () => clearTimeout(t);
  }, []);

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2400);
  };

  return (
    <div style={{
      height: "100vh", background: "#080c1a", color: "#e0e8ff",
      fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column",
      overflow: "hidden", maxWidth: 480, margin: "0 auto", position: "relative"
    }}>
      {/* SPLASH */}
      {splash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999, background: "#080c1a",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "1.5rem"
        }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%",
            background: "rgba(0,245,255,0.05)", border: "2px solid rgba(0,245,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem",
            animation: "pingAnim 2s ease-in-out infinite"
          }}>🧠</div>
          <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "2rem", fontWeight: 900, color: "#00f5ff", textShadow: "0 0 40px rgba(0,245,255,0.8)", letterSpacing: 3 }}>GCC</div>
          <div style={{ fontSize: "0.75rem", color: "#5a7090", letterSpacing: 2, textTransform: "uppercase" }}>Game Comic Crafter</div>
          <div style={{ width: 220, height: 3, background: "rgba(0,245,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg,#00f5ff,#7c3aed)", animation: "loadBar 1.8s ease forwards" }} />
          </div>
          <div style={{ fontSize: "0.62rem", color: "#5a7090", letterSpacing: 2, textTransform: "uppercase", opacity: 0.5 }}>6-AI CLUSTER INICIANDO...</div>
        </div>
      )}

      {/* TOPBAR */}
      <div style={{
        flexShrink: 0, height: 56, background: "rgba(8,12,26,0.95)",
        backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,245,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem"
      }}>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "0.95rem", fontWeight: 900, color: "#00f5ff", letterSpacing: 2 }}>GCC</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ position: "relative", cursor: "pointer", fontSize: "1.2rem" }}>
            🔔
            <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#ff00ff", border: "1px solid #080c1a" }} />
          </div>
          <div
            onClick={() => base44.auth.logout(createPageUrl("Landing"))}
            title="Cerrar sesión"
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg,#00f5ff,#7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", fontWeight: 700, color: "#080c1a", cursor: "pointer"
            }}>{user?.full_name?.[0]?.toUpperCase() || "G"}</div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ paddingBottom: 72 }}>
          {tab === "home" && <HomeScreenComponent onNav={setTab} showToast={showToast} />}
          {tab === "physics" && <PhysicsScreen showToast={showToast} />}
          {tab === "chars" && <CharsScreen showToast={showToast} />}
          {tab === "create" && <EditorScreen onNav={setTab} showToast={showToast} />}
          {tab === "test" && <TestScreen showToast={showToast} />}
          {tab === "marketing" && <MarketingScreen showToast={showToast} />}
        </div>
      </div>

      {/* FAB */}
      {tab !== "create" && (
        <button onClick={() => setTab("create")} style={{
          position: "fixed", bottom: 74, right: "calc(50% - 240px + 1.2rem)",
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg,#00f5ff,#7c3aed)",
          border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#080c1a",
          boxShadow: "0 4px 20px rgba(0,245,255,0.4)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 99
        }}>🎤</button>
      )}

      {/* BOTTOM NAV */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, height: 60,
        background: "rgba(8,12,26,0.97)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,245,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100
      }}>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, cursor: "pointer", padding: "8px 0",
            color: tab === t.id ? "#00f5ff" : "#5a7090",
            fontSize: "0.55rem", letterSpacing: 0.5, textTransform: "uppercase", position: "relative"
          }}>
            <span style={{ fontSize: "1.2rem", transform: tab === t.id ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }}>{t.icon}</span>
            <span>{t.label}</span>
            {tab === t.id && <div style={{ position: "absolute", bottom: 0, width: 22, height: 2, background: "#00f5ff", borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      <Toast msg={toast.msg} show={toast.show} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes loadBar { 0%{width:0} 100%{width:100%} }
        @keyframes pingAnim { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(0,245,255,0.4)} 50%{transform:scale(1.05);box-shadow:0 0 0 14px rgba(0,245,255,0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { 100%{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: #5a7090; }
      `}</style>
    </div>
  );
}